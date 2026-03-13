import { Router } from "express";
import {
    register,
    login,
    refresh,
    logout,
    getMe,
    verifyEmailHandler,
    resendVerification,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../types/auth.types.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email", verifyEmailHandler);
router.post("/resend-verification", resendVerification);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;
