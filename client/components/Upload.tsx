import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";
import { 
    PROGRESS_INCREMENT, 
    PROGRESS_INTERVAL_MS, 
    REDIRECT_DELAY_MS 
} from "lib/constants";

interface UploadProps {
    onComplete: (base64: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    // This should likely come from a Prop or Auth Context in a real app
    const isSignedIn = true; 

    const processFile = (selectedFile: File) => {
        if (!isSignedIn) return;

        setFile(selectedFile);
        const reader = new FileReader();

        reader.onload = () => {
            const base64String = reader.result as string;

            const interval = setInterval(() => {
                setProgress((prev) => {
                    const nextValue = prev + PROGRESS_INCREMENT;

                    if (nextValue >= 100) {
                        clearInterval(interval);
                        
                        // Execute completion callback after the specified delay
                        setTimeout(() => {
                            onComplete(base64String);
                        }, REDIRECT_DELAY_MS);
                        
                        return 100;
                    }
                    return nextValue;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    /* --- Drag and Drop Handlers --- */
    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (isSignedIn) setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) processFile(droppedFile);
    };

    return (
        <div className="upload">
            {!file ? (
                <div 
                    className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png,.svg"
                        disabled={!isSignedIn}
                        onChange={handleFileChange}
                    />

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>
                            {isSignedIn 
                                ? "Drag and drop your floor plan here, or click to select a file" 
                                : "Please log in to upload your floor plan"}
                        </p>
                        <p className="help">Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check" />
                            ) : (
                                <ImageIcon className="image" />
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className="progress">
                            <div className="bar" style={{ width: `${progress}%` }} />
                            <p className="status-text">
                                {progress < 100 ? `Analyzing... ${progress}%` : "Redirecting..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;