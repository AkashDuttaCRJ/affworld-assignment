import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AppPage from "./pages/app";
import Feed from "./pages/app/feed";
import ForgotPasswordPage from "./pages/forgot-password";
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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/app" element={<ProtectedRoute element={<AppPage />} />}>
          <Route index element={<Feed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
