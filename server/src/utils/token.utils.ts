import crypto from "crypto";

export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

export const getVerificationTokenExpiry = (): Date => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24 hour expiry
    return expiry;
};