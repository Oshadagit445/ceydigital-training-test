import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "antd";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto" }}>
        <Skeleton active />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}