import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import History from "./pages/History.jsx";
import Login from "./pages/auth/Login.jsx";
import Profile from "./pages/Profile.jsx";
import RegisterAbsence from "./pages/RegisterAbsence.jsx";
import RegisterPage from "./pages/auth/Register.jsx";
import Reports from "./pages/Reports.jsx";
import Validations from "./pages/Validations.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/absences/new" element={<RegisterAbsence />} />
          <Route path="/validations" element={<Validations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
