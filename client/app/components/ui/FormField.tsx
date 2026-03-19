import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange?: () => void;
};

export const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  error,
  disabled,
  autoFocus,
  autoComplete,
  onChange,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          onChange={onChange}
          className={`w-full py-3 rounded-xl bg-zinc-50 border transition-all text-sm
            ${icon ? "pl-10" : "px-4"}
            ${isPassword ? "pr-12" : "pr-4"}
            ${error ? "border-red-500" : "border-zinc-200"}
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:opacity-60 disabled:cursor-not-allowed`}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs ml-1">{error}</p>
      )}
    </div>
  );
};