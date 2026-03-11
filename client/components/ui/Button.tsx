import * as React from "react";

export type ButtonVariant =
  | "default" 
  | "destructive" 
  | "outline"
  | "subtle"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "btn btn--primary",
  destructive: "btn btn--secondary",
  outline: "btn btn--outline",
  subtle: "btn btn--ghost",
  ghost: "btn btn--ghost",
  link: "text-blue-600 underline hover:text-blue-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "btn--md",
  sm: "btn--sm",
  lg: "btn--lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", fullWidth = false, ...props },
    ref
  ) => {
    const classes = [
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
