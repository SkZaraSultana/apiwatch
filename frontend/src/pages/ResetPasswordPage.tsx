import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import AuthAlert from "../components/auth/AuthAlert";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to reset password. The link may have expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password to secure your APIWatch account."
      footer={
        <>
          Ready to continue?{" "}
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
          id="reset-password"
          label="New password"
          type="password"
          placeholder="Enter new password"
          icon={<FiLock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <AuthInput
          id="reset-confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Confirm new password"
          icon={<FiLock className="h-4 w-4" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <AuthButton loading={loading} loadingText="Updating password...">
          Update password
        </AuthButton>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;
