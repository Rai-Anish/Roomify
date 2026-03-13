import { Resend } from "resend";

const getResendClient = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not set");
    }
    return new Resend(process.env.RESEND_API_KEY);
};

export const sendVerificationEmail = async (
    email: string,
    username: string,
    token: string
) => {
    const resend = getResendClient();
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: "Verify your Roomify account",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Roomify, ${username}!</h2>
                <p>Please verify your email address by clicking the button below.</p>
                <p>This link will expire in <strong>24 hours</strong>.</p>
                <a 
                    href="${verificationUrl}"
                    style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #4F46E5;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        margin: 16px 0;
                    "
                >
                    Verify Email
                </a>
                <p>Or copy and paste this link:</p>
                <p style="color: #6B7280;">${verificationUrl}</p>
                <p>If you did not create an account, you can safely ignore this email.</p>
            </div>
        `,
    });
};