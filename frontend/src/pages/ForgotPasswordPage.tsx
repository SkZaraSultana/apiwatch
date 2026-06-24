import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import AuthAlert from "../components/auth/AuthAlert";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import { forgotPassword } from "../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Unable to send reset link. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a secure password reset link."
      footer={
        <>
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {message ? <AuthAlert type="success" message={message} /> : null}
        {error ? <AuthAlert type="error" message={error} /> : null}

        <AuthInput
          id="forgot-email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          icon={<FiMail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <AuthButton loading={loading} loadingText="Sending link...">
          Send reset link
        </AuthButton>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
