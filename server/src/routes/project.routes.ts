import { Router } from "express";
import { authenticate, optionalAuth } from "../middlewares/auth.middleware.js";
import { authorizeProject } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../types/project.types.js";
import {
    createProject,
    getMyProjects,
    getCommunityProjects,
    getProject,
    updateProject,
    deleteProject,
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/community", getCommunityProjects);
router.get("/my", authenticate, getMyProjects);
router.get("/:id",optionalAuth, getProject);
router.post("/", authenticate, upload.single("floorPlan"), validate(createProjectSchema), createProject);
router.put("/:id", authenticate, authorizeProject, validate(updateProjectSchema), updateProject);
router.delete("/:id", authenticate, authorizeProject, deleteProject);

export default router;