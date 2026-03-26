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
import { googleAuth, googleCallback, googleTokenAuth } from "../controllers/oauth.controller.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/verify-email", verifyEmailHandler);
router.post("/resend-verification", resendVerification);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// For google provided login button
router.post("/google/token", authLimiter, googleTokenAuth);

export default router;
