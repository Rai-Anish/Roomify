import { vi, afterAll, afterEach } from "vitest";

// mock prisma globally
vi.mock("../config/db.js", () => ({
    prisma: {
        user: {
            findFirst: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
        project: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
    },
}));

// mock cloudinary
vi.mock("../utils/cloudinary.js", () => ({
    uploadToCloudinary: vi.fn().mockResolvedValue("https://cloudinary.com/test-image.jpg"),
    getPublicIdFromUrl: vi.fn().mockReturnValue("test-public-id"),
    deleteFromCloudinary: vi.fn().mockResolvedValue(undefined),
}));

// mock email
vi.mock("../utils/email.utils.js", () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

// mock queue
vi.mock("../jobs/queue.js", () => ({
    projectQueue: {
        add: vi.fn().mockResolvedValue({ id: "test-job-id" }),
        getJob: vi.fn().mockResolvedValue(null),
    },
}));

afterEach(() => {
    vi.clearAllMocks();
});

afterAll(async () => {
    vi.restoreAllMocks();
});