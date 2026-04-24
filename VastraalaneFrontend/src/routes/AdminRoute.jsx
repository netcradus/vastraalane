import { Navigate, Outlet } from "react-router-dom";

export function AdminRoute() {
  const token = localStorage.getItem("adminToken");
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
