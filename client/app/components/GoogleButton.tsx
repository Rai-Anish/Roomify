import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore.js";
import axiosInstance from "../lib/axios.js";
import type { ApiResponse, User } from "../types/index.js";

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: object) => void;
                    renderButton: (element: HTMLElement, config: object) => void;
                    prompt: () => void;
                };
            };
        };
        handleGoogleCallback: (response: { credential: string }) => void;
    }
}

export const GoogleButton = () => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuthStore();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCredential = async (credential: string) => {
        try {
            const response = await axiosInstance.post<ApiResponse<{ user: User; accessToken: string }>>(
                "auth/google/token",
                { credential }
            );

            setAccessToken(response.data.data.accessToken);
            setUser(response.data.data.user);
            navigate("/");
        } catch (error: any) {
            console.error(error.response?.data?.message || "Google login failed");
        }
    };

    const initializeGoogle = () => {
        if (!window.google || !buttonRef.current) return;

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: (response: { credential: string }) => {
                handleCredential(response.credential);
            },
            auto_select: false,
            cancel_on_tap_outside: true,
            itp_support: false,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            width: buttonRef.current.offsetWidth,
            text: "signin_with",
            shape: "rectangular",
            type: "standard",
            logo_alignment: "left"
        });
    };

    return <div ref={buttonRef} className="w-full" />;
};