type AuthAlertProps = {
  type: "success" | "error" | "info";
  message: string;
};

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-brand-200 bg-brand-50 text-brand-800",
};

const AuthAlert = ({ type, message }: AuthAlertProps) => {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

export default AuthAlert;
