import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardOverviewSkeleton } from "./dashboard/LoadingState";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
