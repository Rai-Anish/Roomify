import { useState } from "react";
import { useRegister } from "../../hooks/useAuth";
import { AuthForm } from "~/components/AuthForm";
import { FormField } from "~/components/ui/FormField";
import { Mail, Lock, User } from "lucide-react";
import {z} from "zod";
import { registerSchema } from "~/schemas/auth.schema";

export default function SignUpPage() {
  const { mutate, isPending } = useRegister();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleSubmit = (formData: FormData) => {
    setMessage("");

    const data = Object.fromEntries(formData.entries()) as any;

    data.username = data.username.trim();
    data.email = data.email.trim();
    data.password = data.password.trim();
    data.confirmPassword = data.confirmPassword.trim();

    const result = registerSchema.safeParse(data)
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      const firstError =
        Object.values(tree.properties ?? {})
          .map((field) => field?.errors?.[0])
          .find(Boolean);

      setMessage(firstError || "Invalid input");
      return;
    }

    mutate({
      username: result.data.username,
      email: result.data.email,
      password: result.data.password,
    }, {
      onSuccess: () => {
        setMessage("Verification email has been send. Please verify it!")
        setMessageType("success");
      },
      onError: (err: any) =>{
        setMessage(
          err.response?.data?.message ||
          "Something went wrong"
        );
        setMessageType("error");
      }
        
    });
  };

  return (
    <AuthForm
      title="FloorPlan3D"
      subtitle="Create Your Account"
      onSubmit={handleSubmit}
      isPending={isPending}
      message={message}
      messageType={messageType}
      isLogin = {false}
      urlLink="/login"
    >
      <FormField
        label="Name"
        name="username"
        type="text"
        placeholder="Anish Rai"
        icon={<User className="w-4 h-4" />}
        autoFocus
        autoComplete="name"
        disabled={isPending}
        onChange={() => message && setMessage("")}
      />

      <FormField
        label="Email Address"
        name="email"
        type="email"
        placeholder="example@example.com"
        icon={<Mail className="w-4 h-4" />}
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

      <FormField
        label="Confirm Password"
        name="confirmPassword"
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