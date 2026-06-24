import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FiActivity } from "react-icons/fi";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-glass backdrop-blur-xl"
    >
      <div className="mb-8 text-center lg:hidden">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <FiActivity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">APIWatch</span>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">{subtitle}</p>
      </div>

      <div className="mx-auto w-full max-w-sm">{children}</div>

      {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
    </motion.div>
  );
};

export default AuthCard;
