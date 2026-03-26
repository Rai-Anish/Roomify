import { motion,type HTMLMotionProps } from "framer-motion";


interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost" | "dark";
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = "primary", 
  fullWidth, 
  className, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20",
    outline: "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50",
    dark: "bg-zinc-900 text-white hover:bg-zinc-800",
    ghost: "text-zinc-600 hover:bg-zinc-100",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-all ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      {...props} // Now TypeScript is happy because the types match
    >
      {children}
    </motion.button>
  );
};
