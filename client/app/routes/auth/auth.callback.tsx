import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../../store/authStore.js";
import axiosInstance from "~/lib/axios.js";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error || !token) {
            navigate("/login?error=oauth_failed");
            return;
        }

        setAccessToken(token);

        axiosInstance
            .get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data.data.user);
                navigate("/");
            })
            .catch(() => navigate("/login"));
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-zinc-500">Authenticating...</p>
        </div>
    );
}