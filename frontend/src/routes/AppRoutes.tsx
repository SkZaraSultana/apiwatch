import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MarketingLayout from "../layouts/MarketingLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardPage from "../pages/DashboardPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import MonitorsPage from "../pages/MonitorsPage";
import AlertsPage from "../pages/AlertsPage";
import IncidentsPage from "../pages/IncidentsPage";
import SecurityCenterPage from "../pages/SecurityCenterPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import PublicStatusPage from "../pages/PublicStatusPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import HowItWorksPage from "../pages/HowItWorksPage";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/status/:slug" element={<PublicStatusPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/monitors" element={<MonitorsPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route
              path="/dashboard/endpoints"
              element={<Navigate to="/dashboard/monitors" replace />}
            />
            <Route path="/dashboard/incidents" element={<IncidentsPage />} />
            <Route path="/dashboard/alerts" element={<AlertsPage />} />
            <Route path="/dashboard/security" element={<SecurityCenterPage />} />
            <Route path="/dashboard/reports" element={<ReportsPage />} />
            <Route path="/dashboard/status-page" element={<PublicStatusPage />} />
            <Route
              path="/dashboard/settings"
              element={<SettingsPage />}
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
