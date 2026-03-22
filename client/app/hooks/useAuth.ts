import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "../store/authStore.js";
import type { ApiResponse, User } from "../types/index.js";
import { toast } from "sonner";

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: {
            email: string;
            username: string;
            password: string;
        }) => {
            const response = await axiosInstance.post<ApiResponse<{ user: User }>>(
                "auth/register",
                data
            );
            return response.data;
        },
        onSuccess:() =>{
            toast.success("Registeration successful. Please verify your account!")
        }
    });
};

export const useLogin = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await axiosInstance.post<ApiResponse<{ user: User; accessToken: string }>>(
                "auth/login", 
                data
            );
            return response.data;
        },
        onSuccess: (res) => {
            // Update Zustand Store
            setAccessToken(res.data.accessToken);
            setUser(res.data.user);
            
            // Sync TanStack Cache
            queryClient.setQueryData(["user"], res.data.user);
        },
    });
};

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post("auth/logout");
            return response.data;
        },
        onSuccess: () => {
            logout(); // Clears Zustand user and token
            queryClient.clear(); // Clears all cached queries
        },
    });
};

export const useMe = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const accessToken = useAuthStore((state) => state.accessToken);

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await axiosInstance.get<ApiResponse<{ user: User }>>(
                "auth/me"
            );
            const user = response.data.data.user;
            setUser(user); // Keep Zustand in sync with the fetch
            return user;
        },
        // Only run if we actually have a token
        enabled: !!accessToken,
        retry: false,
    });
};

export const useVerifyEmail = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (token: string) => {
            const response = await axiosInstance.get<ApiResponse<{ user: User; accessToken: string }>>(
                `auth/verify-email?token=${token}`
            );
            return response.data;
        },
        onSuccess: (res) => {
            setAccessToken(res.data.accessToken);
            setUser(res.data.user);
            queryClient.setQueryData(["user"], res.data.user);
        },
    });
};

export const useResendVerification = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await axiosInstance.post("auth/resend-verification", {
                email,
            });
            return response.data;
        },
    });
};


// for google login button
export const useGoogleLogin = () => {
    const { setAccessToken, setUser } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credential: string) => {
            const response = await axiosInstance.post<ApiResponse<{ user: User; accessToken: string }>>(
                "auth/google/token",
                { credential }
            );
            return response.data;
        },
        onSuccess: (res) => {
            setAccessToken(res.data.accessToken);
            setUser(res.data.user);
            queryClient.setQueryData(["user"], res.data.user);
        },
    });
};