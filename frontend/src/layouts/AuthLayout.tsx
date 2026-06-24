import { Outlet } from "react-router-dom";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <AuthBrandPanel />

        <div className="flex w-full flex-col items-center justify-center px-6 py-12 sm:px-10 lg:py-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
