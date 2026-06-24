import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import AuthAlert from "../components/auth/AuthAlert";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import { useAuth } from "../hooks/useAuth";

const REMEMBER_KEY = "apiwatch-remember-email";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Login payload:", { email, password });
      await login({ email, password });
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      console.log("Login response:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your APIWatch workspace and monitor API health in real time."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <AuthAlert type="error" message={error} /> : null}

        <AuthInput
          id="login-email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          icon={<FiMail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<FiLock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Remember me
          </label>
        </div>

        <AuthButton loading={loading} loadingText="Signing in...">
          Sign in
        </AuthButton>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
