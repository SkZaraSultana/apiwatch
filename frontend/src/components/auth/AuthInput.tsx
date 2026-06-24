import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { InputHTMLAttributes, ReactNode } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
};

const AuthInput = ({ label, icon, error, className = "", type = "text", ...props }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordField = type === "password";
  const inputType = passwordField && showPassword ? "text" : type;

  return (
    <div>
      <label htmlFor={props.id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          {...props}
          type={inputType}
          className={`w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-11 ${passwordField ? "pr-11" : "pr-4"} text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
        />
        {passwordField ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          >
            {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};

export default AuthInput;
