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
      "text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus-visible:ring-primary-500 shadow-soft hover:shadow-medium",
    secondary:
      "text-primary-700 bg-primary-50 hover:bg-primary-100 focus-visible:ring-primary-500 border border-primary-200",
    success:
      "text-white bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 focus-visible:ring-success-500 shadow-soft hover:shadow-medium",
    error:
      "text-white bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 focus-visible:ring-error-500 shadow-soft hover:shadow-medium",
    warning:
      "text-white bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 focus-visible:ring-warning-500 shadow-soft hover:shadow-medium",
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
