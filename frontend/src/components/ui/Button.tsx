import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-plum-500 to-coral-500 hover:from-plum-600 hover:to-coral-600 text-white shadow-lg hover:shadow-xl",
  secondary:
    "bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg",
  outline:
    "border-2 border-plum-500 text-plum-500 hover:bg-plum-50 hover:border-plum-600",
  ghost:
    "text-plum-600 hover:bg-plum-50 hover:text-plum-700",
  danger:
    "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm font-medium rounded-lg",
  md: "px-5 py-2.5 text-base font-semibold rounded-lg",
  lg: "px-7 py-3.5 text-lg font-semibold rounded-xl",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      isLoading = false,
      fullWidth = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          font-[Plus Jakarta Sans]
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
