import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useAuth";
import { AuthForm } from "~/components/AuthForm";
import { FormField } from "~/components/ui/FormField";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const [message, setMessage] = useState("");

  const handleSubmit = (formData: FormData) => {
    setMessage("");

    const data = Object.fromEntries(formData.entries()) as any;

    data.email = data.email.trim();
    data.password = data.password.trim();

    if (!data.email || !data.password) {
      setMessage("Email and password are required");
      return;
    }

    mutate(data, {
      onSuccess: () => navigate("/"),
      onError: (err: any) =>
        setMessage(err.response?.data?.message || "Invalid credentials"),
    });
  };

  return (
    <AuthForm
      title="FloorPlan3D"
      subtitle="Welcome back"
      onSubmit={handleSubmit}
      isPending={isPending}
      message={message}
      isLogin = {true}
      urlLink="/signup"
    >
      <FormField
        label="Email Address"
        name="email"
        type="email"
        placeholder="example@example.com"
        icon={<Mail className="w-4 h-4" />}
        autoFocus
        autoComplete="email"
        disabled={isPending}
        onChange={() => message && setMessage("")}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        autoComplete="current-password"
        disabled={isPending}
        onChange={() => message && setMessage("")}
      />
      
    </AuthForm>
  );
}