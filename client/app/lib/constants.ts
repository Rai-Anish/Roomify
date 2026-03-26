export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
    ROOT: "roomify",
    SOURCES: "roomify/sources",
    RENDERS: "roomify/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

export const ROOMIFY_RENDER_PROMPT = `
    TASK: Convert the input 2D floor plan into a **photorealistic, top‑down 3D architectural render**.

    STRICT REQUIREMENTS (do not violate):
    1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
    2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
    3) **TOP‑DOWN ONLY**: Orthographic top‑down view. No perspective tilt.
    4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/hand‑drawn look.
    5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

    STRUCTURE & DETAILS:
    - **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
    - **Doors**: Convert door swing arcs into open doors, aligned to the plan.
    - **Windows**: Convert thin perimeter lines into realistic glass windows.

    FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
    - Bed icon → realistic bed with duvet and pillows.
    - Sofa icon → modern sectional or sofa.
    - Dining table icon → table with chairs.
    - Kitchen icon → counters with sink and stove.
    - Bathroom icon → toilet, sink, and tub/shower.
    - Office/study icon → desk, chair, and minimal shelving.
    - Porch/patio/balcony icon → outdoor seating or simple furniture (keep minimal).
    - Utility/laundry icon → washer/dryer and minimal cabinetry.

    STYLE & LIGHTING:
    - Lighting: bright, neutral daylight. High clarity and balanced contrast.
    - Materials: realistic wood/tile floors, clean walls, subtle shadows.
    - Finish: professional architectural visualization; no text, no watermarks, no logos.
    `.trim();


import { Shield, Zap, Users, Globe, Headphones, Building2, Sparkles, CheckCircle2 } from "lucide-react";

export const TESTIMONIALS = [
    { quote: "Roomify cut our visualization turnaround from 3 days to 20 minutes. Our clients are blown away.", author: "Sarah Chen", role: "Principal Architect", company: "Chen & Associates", avatar: "SC" },
    { quote: "We process over 500 floor plans a month. The API and team workspace make it seamless.", author: "Marcus Webb", role: "Head of Design", company: "Webb Studio", avatar: "MW" },
    { quote: "The quality of renders is indistinguishable from our manual process, but 100x faster.", author: "Priya Nair", role: "Design Director", company: "Nair Interiors", avatar: "PN" },
];

export const PRICING_PLANS = [
    {
        name: "Free",
        icon: Zap,
        description: "Perfect for trying out FloorPlan3D",
        monthly: 0,
        yearly: 0,
        cta: "Get started free",
        features: ["3 projects per month", "ComfyUI rendering", "Community visibility only", "Standard resolution output", "Basic support"],
        missing: ["Gemini AI rendering", "Private projects", "Priority rendering", "API access"],
    },
    {
        name: "Pro",
        icon: Sparkles,
        popular: true,
        description: "For designers and architects",
        monthly: 19,
        yearly: 15,
        cta: "Start Pro",
        features: ["Unlimited projects", "ComfyUI + Gemini AI rendering", "Private & community projects", "High resolution output", "Priority rendering queue", "Email support"],
        missing: ["Team collaboration", "API access"],
    },
    {
        name: "Team",
        icon: Users,
        description: "For design teams and studios",
        monthly: 49,
        yearly: 39,
        cta: "Start Team",
        features: ["Everything in Pro", "Up to 10 team members", "Shared project workspace", "API access", "Custom branding", "Priority support", "Usage analytics"],
        missing: [],
    },
];

export const ENTERPRISE_FEATURES = [
    { icon: Shield, title: "SSO & Security", description: "SAML SSO, SOC 2 compliance, custom data retention policies." },
    { icon: Zap, title: "Dedicated Infrastructure", description: "Your own rendering pipeline with guaranteed SLAs and uptime." },
    { icon: Users, title: "Unlimited Seats", description: "Add your entire organization with role-based access control." },
    { icon: Globe, title: "Custom Domain", description: "White-label the product under your own brand and domain." },
    { icon: Headphones, title: "White-glove Onboarding", description: "Dedicated success manager and custom training for your team." },
    { icon: Building2, title: "Custom Contracts", description: "Flexible billing, custom MSAs, and volume-based pricing." },
];

export const PRICING_FAQ = [
    { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and you'll be billed or credited on a prorated basis." },
    { q: "What rendering models are included?", a: "Free includes ComfyUI (local). Pro and Team include both ComfyUI and Google Gemini AI for higher quality renders." },
    { q: "Is there a free trial for Pro?", a: "Yes, Pro comes with a 14-day free trial. No credit card required to start." },
    { q: "What happens to my projects if I downgrade?", a: "Your projects are never deleted. Private projects become view-only until you upgrade again." },
];

export const ENTERPRISE_FAQ = [
    { q: "How long does enterprise onboarding take?", a: "Most enterprise customers are fully onboarded within 2 weeks, including SSO setup and team migration." },
    { q: "Do you support on-premise deployment?", a: "Yes, we offer private cloud deployment options for strict data residency requirements." },
    { q: "What SLAs do you offer?", a: "Enterprise plans include 99.9% uptime SLA with priority incident response." },
];