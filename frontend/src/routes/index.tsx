import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AppPage from "./pages/app";
import Feed from "./pages/app/feed";
import TaskManagementPage from "./pages/app/task-management";
import ForgotPasswordPage from "./pages/forgot-password";
import GoogleAuthCallbackPage from "./pages/google-auth-callback";
import LoginPage from "./pages/login";
import ResetPasswordPage from "./pages/reset-password";
import SignupPage from "./pages/signup";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = true;
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export const RouterConfig = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="auth/google" element={<GoogleAuthCallbackPage />} />
        <Route path="app" element={<ProtectedRoute element={<AppPage />} />}>
          <Route index element={<Feed />} />
          <Route
            path="task-management"
            element={<ProtectedRoute element={<TaskManagementPage />} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
