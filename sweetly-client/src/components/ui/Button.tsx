import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "error" | "warning";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  className = "",
  onClick,
  disabled,
  variant = "primary",
  size = "md",
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "group relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer";

  const variants = {
    primary:
      "text-white bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 focus-visible:ring-amber-500 shadow-md hover:shadow-lg",
    secondary:
      "text-slate-700 bg-slate-100 hover:bg-slate-200 focus-visible:ring-slate-500 border border-slate-200",
    success:
      "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus-visible:ring-green-500 shadow-md hover:shadow-lg",
    error:
      "text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus-visible:ring-red-500 shadow-md hover:shadow-lg",
    warning:
      "text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus-visible:ring-yellow-500 shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-5 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "hover:-translate-y-0.5";

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      <span className="drop-shadow-sm">{children}</span>
      {/* subtle shine effect */}
      {!disabled && (
        <span className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/10 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </motion.button>
  );
}
