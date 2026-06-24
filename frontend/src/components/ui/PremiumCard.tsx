import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hover?: boolean;
  variant?: "default" | "gradient" | "glass";
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    {
      hover = true,
      variant = "default",
      icon,
      title,
      description,
      children,
      className = "",
      animate = true,
      ...props
    },
    ref
  ) => {
    const motionProps = animate
      ? {
          whileHover: hover ? { y: -4, boxShadow: "0 20px 60px rgba(91, 42, 134, 0.15)" } : {},
          transition: { duration: 0.2 },
        }
      : {};

    const variantClasses = {
      default: "bg-white border border-slate-100 shadow-card hover:shadow-premium",
      gradient: "bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-card",
      glass:
        "bg-white/80 backdrop-blur-md border border-white/20 shadow-glass",
    };

    return (
      <motion.div
        ref={ref}
        className={`
          ${variantClasses[variant]}
          rounded-2xl p-6 transition-all duration-200
          ${className}
        `}
        {...motionProps}
        {...props}
      >
        {icon && (
          <div className="mb-4 inline-block rounded-lg bg-gradient-plum-coral p-3 text-white">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="mb-2 text-xl font-bold text-dark-slate">{title}</h3>
        )}
        {description && (
          <p className="mb-4 text-slate-600">{description}</p>
        )}
        {children}
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";

export default PremiumCard;
