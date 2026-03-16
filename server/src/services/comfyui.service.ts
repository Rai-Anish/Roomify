import ApiError from "../utils/ApiError.js";

const COMFYUI_URL = process.env.COMFYUI_URL || "http://host.docker.internal:8188";

const PROMPT = `
STRICT REQUIREMENTS (do not violate):
1) REMOVE ALL TEXT: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
2) GEOMETRY MUST MATCH: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
3) TOP-DOWN ONLY: Orthographic top-down view. No perspective tilt.
4) CLEAN, REALISTIC OUTPUT: Crisp edges, balanced lighting, and realistic materials. No sketch/hand-drawn look.
5) NO EXTRA CONTENT: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

STRUCTURE & DETAILS:
- Walls: Extrude precisely from the plan lines. Consistent wall height and thickness.
- Doors: Convert door swing arcs into open doors, aligned to the plan.
- Windows: Convert thin perimeter lines into realistic glass windows.

FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
- Bed icon → realistic bed with duvet and pillows.
- Sofa icon → modern sectional or sofa.
- Dining table icon → table with chairs.
- Kitchen icon → counters with sink and stove.
- Bathroom icon → toilet, sink, and tub/shower.
- Utility/laundry icon → washer/dryer and minimal cabinetry.

STYLE & LIGHTING:
- Lighting: bright, neutral daylight. High clarity and balanced contrast.
- Materials: realistic wood/tile floors, clean walls, subtle shadows.
- Finish: professional architectural visualization; no text, no watermarks, no logos.
`;

const buildWorkflow = (imageFilename: string): object => {
    return {
        "9": {
            "inputs": {
                "filename_prefix": "roomify_render",
                "images": ["75:65", 0]
            },
            "class_type": "SaveImage"
        },
        "76": {
            "inputs": {
                "image": imageFilename
            },
            "class_type": "LoadImage"
        },
        "75:61": {
            "inputs": {
                "sampler_name": "euler"
            },
            "class_type": "KSamplerSelect"
        },
        "75:62": {
            "inputs": {
                "steps": 20,
                "width": ["75:100", 0],
                "height": ["75:100", 1]
            },
            "class_type": "Flux2Scheduler"
        },
        "75:63": {
            "inputs": {
                "cfg": 5,
                "model": ["75:70", 0],
                "positive": ["75:79:77", 0],
                "negative": ["75:79:101", 0]
            },
            "class_type": "CFGGuider"
        },
        "75:64": {
            "inputs": {
                "noise": ["75:73", 0],
                "guider": ["75:63", 0],
                "sampler": ["75:61", 0],
                "sigmas": ["75:62", 0],
                "latent_image": ["75:66", 0]
            },
            "class_type": "SamplerCustomAdvanced"
        },
        "75:65": {
            "inputs": {
                "samples": ["75:64", 0],
                "vae": ["75:72", 0]
            },
            "class_type": "VAEDecode"
        },
        "75:73": {
            "inputs": {
                "noise_seed": Math.floor(Math.random() * 999999999999999)
            },
            "class_type": "RandomNoise"
        },
        "75:74": {
            "inputs": {
                "text": PROMPT,
                "clip": ["75:71", 0]
            },
            "class_type": "CLIPTextEncode"
        },
        "75:67": {
            "inputs": {
                "text": "",
                "clip": ["75:71", 0]
            },
            "class_type": "CLIPTextEncode"
        },
        "75:72": {
            "inputs": {
                "vae_name": "flux2-vae.safetensors"
            },
            "class_type": "VAELoader"
        },
        "75:66": {
            "inputs": {
                "width": ["75:100", 0],
                "height": ["75:100", 1],
                "batch_size": 1
            },
            "class_type": "EmptyFlux2LatentImage"
        },
        "75:80": {
            "inputs": {
                "upscale_method": "nearest-exact",
                "megapixels": 1,
                "resolution_steps": 1,
                "image": ["76", 0]
            },
            "class_type": "ImageScaleToTotalPixels"
        },
        "75:100": {
            "inputs": {
                "image": ["75:80", 0]
            },
            "class_type": "GetImageSize"
        },
        "75:71": {
            "inputs": {
                "clip_name": "qwen_3_4b.safetensors",
                "type": "flux2",
                "device": "default"
            },
            "class_type": "CLIPLoader"
        },
        "75:79:101": {
            "inputs": {
                "conditioning": ["75:67", 0],
                "latent": ["75:79:78", 0]
            },
            "class_type": "ReferenceLatent"
        },
        "75:79:78": {
            "inputs": {
                "pixels": ["75:80", 0],
                "vae": ["75:72", 0]
            },
            "class_type": "VAEEncode"
        },
        "75:79:77": {
            "inputs": {
                "conditioning": ["75:74", 0],
                "latent": ["75:79:78", 0]
            },
            "class_type": "ReferenceLatent"
        },
        "75:70": {
            "inputs": {
                "unet_name": "flux-2-klein-base-4b-fp8.safetensors",
                "weight_dtype": "default"
            },
            "class_type": "UNETLoader"
        }
    };
};

// Upload image to ComfyUI input folder
const uploadImageToComfyUI = async (buffer: Buffer, filename: string): Promise<string> => {
    const formData = new FormData();
    const blob = new Blob([buffer]);
    formData.append("image", blob, filename);
    formData.append("overwrite", "true");

    const response = await fetch(`${COMFYUI_URL}/upload/image`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new ApiError(500, "Failed to upload image to ComfyUI");
    }

    const data = await response.json() as { name: string };
    return data.name;
};

// Queue prompt and get prompt ID
const queuePrompt = async (workflow: object): Promise<string> => {
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: workflow }),
    });

    if (!response.ok) {
        throw new ApiError(500, "Failed to queue prompt in ComfyUI");
    }

    const data = await response.json() as { prompt_id: string };
    return data.prompt_id;
};

// Poll until generation is complete
const waitForCompletion = async (promptId: string): Promise<void> => {
    const maxWait = 300000; // 5 minutes
    const interval = 2000;  // poll every 2 seconds
    let elapsed = 0;

    while (elapsed < maxWait) {
        const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
        const history = await response.json() as Record<string, any>;

        if (history[promptId]) {
            const status = history[promptId].status;
            if (status?.completed) return;
            if (status?.status_str === "error") {
                throw new ApiError(500, "ComfyUI generation failed");
            }
        }

        await new Promise(resolve => setTimeout(resolve, interval));
        elapsed += interval;
    }

    throw new ApiError(500, "ComfyUI generation timed out");
};

// Get generated image buffer
const getGeneratedImage = async (promptId: string): Promise<{ imageBuffer: Buffer; mimeType: string }> => {
    const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
    const history = await response.json() as Record<string, any>;

    const outputs = history[promptId]?.outputs;
    if (!outputs) throw new ApiError(500, "No outputs found in ComfyUI history");

    // Find the SaveImage node output
    for (const nodeId in outputs) {
        const images = outputs[nodeId]?.images;
        if (images && images.length > 0) {
            const image = images[0];
            const imageResponse = await fetch(
                `${COMFYUI_URL}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`
            );

            if (!imageResponse.ok) {
                throw new ApiError(500, "Failed to fetch generated image from ComfyUI");
            }

            const arrayBuffer = await imageResponse.arrayBuffer();
            return {
                imageBuffer: Buffer.from(arrayBuffer),
                mimeType: "image/png",
            };
        }
    }

    throw new ApiError(500, "No images found in ComfyUI output");
};

// Main function
export const generateRender = async (
    buffer: Buffer,
    mimeType: string
): Promise<{ imageBuffer: Buffer; mimeType: string }> => {
    try {
        // 1. Upload floor plan to ComfyUI
        const ext = mimeType.split("/")[1] || "png";
        const filename = `floorplan_${Date.now()}.${ext}`;
        const uploadedFilename = await uploadImageToComfyUI(buffer, filename);

        // 2. Build and queue workflow
        const workflow = buildWorkflow(uploadedFilename);
        const promptId = await queuePrompt(workflow);

        // 3. Wait for completion
        await waitForCompletion(promptId);

        // 4. Get generated image
        return await getGeneratedImage(promptId);

    } catch (error: any) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `ComfyUI error: ${error.message}`);
    }
};