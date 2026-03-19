import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle, RefreshCcw, LoaderCircle } from "lucide-react";
import { useVerifyEmail, useResendVerification } from "~/hooks/useAuth";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your account...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  useEffect(() => {
    if (!token) {
      setMessage("No verification token provided.");
      setStatus("error");
      return;
    }

    verifyEmail.mutate(token, {
      onSuccess: () => {
        setMessage("Email verified successfully! Redirecting to login...");
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.error || "Verification failed.";
        setMessage(errorMsg);
        setStatus("error");
      },
    });
  }, [token]);

  const handleResend = () => {
    resendVerification.mutate(searchParams.get("email") || "", {
      onSuccess: () => {
        setMessage("Verification email resent! Please check your inbox.");
        setStatus("success");
      },
      onError: (err: any) => {
        setMessage(err.response?.data?.error || "Failed to resend email.");
        setStatus("error");
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div
        className={`flex items-center gap-2 p-4 rounded shadow-md w-full max-w-md justify-center
          ${status === "success" ? "bg-green-100 text-green-700" : ""}
          ${status === "error" ? "bg-red-100 text-red-500" : ""}
          ${status === "loading" ? "bg-yellow-50 text-yellow-700" : ""}
        `}
      >
        {status === "loading" && <LoaderCircle className="w-5 h-5 animate-spin" />}
        {status === "success" && <CheckCircle className="w-5 h-5" />}
        {status === "error" && <XCircle className="w-5 h-5" />}
        <span>{message}</span>
      </div>

      {status === "error" && (
        <button
          onClick={handleResend}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        >
          <RefreshCcw className="w-4 h-4" />
          Resend verification email
        </button>
      )}
    </div>
  );
}