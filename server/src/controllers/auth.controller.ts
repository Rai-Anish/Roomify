import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    verifyEmail,
    resendVerificationEmail,
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const register = asyncHandler(async(req, res)=>{
    const { user } = await registerUser(req.body);
    res
        .status(201)
        .json(new ApiResponse(201,{user},"Registration successful. Please check your email to verify your account."))
})

export const verifyEmailHandler = asyncHandler(async (req, res) => {
    const { token } = req.query as { token: string };

    if (!token) {
        throw new ApiError(400,"Token is required");
    }

    const { user, accessToken, refreshToken } = await verifyEmail(token);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(
        200,
        { user,accessToken },
        "Email verified successfully",
));

    
});

export const resendVerification = asyncHandler( async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        throw new  ApiError(400,"Email is required" );
    }

    await resendVerificationEmail(email);
    res.status(200).json(new ApiResponse(200,{},"Verification email sent"));

});

export const login = asyncHandler( async (req: Request, res: Response) => {
 
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200,{ user, accessToken },"Login successful"));

});

export const refresh = asyncHandler(async (req: Request, res: Response) => {

    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401,"No refresh token provided");

    const { accessToken } = refreshAccessToken(token);
    res.status(200).json(new ApiResponse(200,{ accessToken },"Token refreshed"));

});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.status(200).json(new ApiResponse(200,{},"Logged out successfully"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse(200, { user: req.user }, "User fetched successfully"));
});