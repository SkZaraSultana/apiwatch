import { motion, type HTMLMotionProps } from "framer-motion";
import { FiLoader } from "react-icons/fi";

type AuthButtonProps = Omit<HTMLMotionProps<"button">, "ref"> & {
  loading?: boolean;
  loadingText?: string;
};

const AuthButton = ({
  children,
  loading = false,
  loadingText = "Please wait...",
  disabled,
  className = "",
  type = "submit",
  ...props
}: AuthButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.99 }}
      type={type}
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <FiLoader className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthButton;
