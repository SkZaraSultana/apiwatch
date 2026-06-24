import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiLoader, FiMail } from "react-icons/fi";
import AuthAlert from "../components/auth/AuthAlert";
import AuthCard from "../components/auth/AuthCard";
import AuthButton from "../components/auth/AuthButton";
import { verifyEmail } from "../services/authService";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setError("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(token);
        setMessage(response.message);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Email verification failed. The link may have expired.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  return (
    <AuthCard
      title="Email verification"
      subtitle="We're confirming your email address to activate your APIWatch account."
      footer={
        <>
          Return to{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            sign in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            {loading ? (
              <FiLoader className="h-6 w-6 animate-spin" />
            ) : (
              <FiMail className="h-6 w-6" />
            )}
          </div>
        </div>

        {loading ? (
          <AuthAlert type="info" message="Verifying your email address..." />
        ) : null}

        {!loading && message ? <AuthAlert type="success" message={message} /> : null}
        {!loading && error ? <AuthAlert type="error" message={error} /> : null}

        {!loading ? (
          <AuthButton type="button" onClick={() => navigate("/login")}>
            Continue to sign in
          </AuthButton>
        ) : null}
      </div>
    </AuthCard>
  );
};

export default VerifyEmailPage;
