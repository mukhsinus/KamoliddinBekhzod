// src/routes/RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/roles";

interface Props {
  allowed: UserRole[];
  children: JSX.Element;
}

export default function RoleProtectedRoute({
  allowed,
  children
}: Props) {
  const { user, loading, initialized } = useAuth();

  // ⏳ Bootstrap guard
  if (!initialized || loading) {
    return null;
  }

  // ❌ Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ❌ Role not allowed
  if (!allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}