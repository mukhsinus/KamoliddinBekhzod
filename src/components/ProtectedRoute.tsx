// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return null; // можно поставить глобальный Loader
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}