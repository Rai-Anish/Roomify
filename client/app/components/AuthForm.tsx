import { CheckCircle, Chrome, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/Button";

type AuthFormProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  message?: string;
  messageType?: "error" | "success";
  isLogin: boolean;
  urlLink: string;
};

export const AuthForm = ({
  title,
  subtitle,
  children,
  onSubmit,
  isPending,
  message,
  messageType,
  isLogin,
  urlLink,
}: AuthFormProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center mb-2">
        <h1 className="text-4xl font-serif font-bold text-black">{title}</h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-mono">
          {subtitle}
        </p>
      </div>
      <div className="flex bg-white rounded-2xl border border-zinc-200 shadow-2xl p-7 flex-col gap-4 w-full max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(new FormData(e.currentTarget));
          }}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
          {children}

          {message && (
            <p
              className={`flex items-center gap-2 p-2 text-xs rounded ${
                messageType === "success"
                  ? "text-green-700 bg-green-100"
                  : "text-red-500 bg-red-100"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="text-white p-2 rounded disabled:bg-gray-400"
          >
            {isPending ? "Authenticating..." : "Submit"}
          </Button>
        </form>
        <div className="mt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-zinc-400 font-mono tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div>{/* <GoogleButton /> */}</div>
            {isLogin ? (
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`)
                }
                className="btn btn--secondary btn--md flex items-center justify-center"
              >
                |
                <Chrome className="w-4 h-4 mr-2" />
                Sign In with Google
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`)
                }
                className="btn btn--secondary btn--md flex items-center justify-center"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign Up with Google
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="font-bold text-black hover:text-primary transition-colors underline underline-offset-4">
            {isLogin ? (
              <Link to={urlLink}>Sign up for free</Link>
            ) : (
              <Link to={urlLink}>Log in here</Link>
            )}
          </button>
        </p>
      </div>
    </div>
  );
};
