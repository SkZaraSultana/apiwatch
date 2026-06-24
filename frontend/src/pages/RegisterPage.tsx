import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import AuthAlert from "../components/auth/AuthAlert";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start monitoring APIs with secure alerts, uptime tracking, and performance visibility."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {message ? <AuthAlert type="success" message={message} /> : null}
        {error ? <AuthAlert type="error" message={error} /> : null}

        <AuthInput
          id="register-name"
          label="Full name"
          placeholder="Alex Morgan"
          icon={<FiUser className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <AuthInput
          id="register-email"
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
          id="register-password"
          label="Password"
          type="password"
          placeholder="Create a strong password"
          icon={<FiLock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <AuthInput
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          icon={<FiLock className="h-4 w-4" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <AuthButton loading={loading} loadingText="Creating account...">
          Create account
        </AuthButton>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
