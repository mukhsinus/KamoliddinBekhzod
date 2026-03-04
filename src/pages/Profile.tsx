import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import ParticipantProfileView from "./profile/views/ParticipantProfileView";
import JuryProfileView from "./profile/views/JuryProfileView";
import AdminProfileView from "./profile/views/AdminProfileView";

export default function Profile() {
  const { user, loading, initialized } = useAuth();

  /* ================= BOOTSTRAP LOADING ================= */

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  /* ================= UNAUTHORIZED ================= */

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  /* ================= ROLE SWITCH ================= */

  switch (user.role) {
    case "participant":
      return <ParticipantProfileView />;

    case "jury":
      return <JuryProfileView />;

    case "admin":
      return <AdminProfileView />;

    default:
      // неизвестная роль — безопасный fallback
      return <Navigate to="/" replace />;
  }
}