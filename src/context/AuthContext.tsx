// AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from "react";
import api from "@/services/api";
import { UserRole } from '@/types/roles';


/* ======================================================
   TYPES
====================================================== */

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  age?: number;
  city?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;        // initial bootstrap loading
  refreshing: boolean;     // manual refresh loading
  initialized: boolean;    // app auth bootstrap completed
  refreshUser: () => Promise<void>;
  logout: () => void;
}

/* ======================================================
   CONTEXT
====================================================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ======================================================
   PROVIDER
====================================================== */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const isMountedRef = useRef(true);

  /* ======================================================
     LOAD USER
  ====================================================== */

  const loadUser = useCallback(
    async (manual = false) => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMountedRef.current) {
          setUser(null);
          setLoading(false);
          setRefreshing(false);
          setInitialized(true);
        }
        return;
      }

      try {
        if (manual) setRefreshing(true);
        else setLoading(true);

        const res = await api.get<User>("/api/auth/me");

        if (isMountedRef.current) {
          setUser(res.data);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
        }

        if (isMountedRef.current) {
          setUser(null);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setRefreshing(false);
          setInitialized(true);
        }
      }
    },
    []
  );

  /* ======================================================
     LOGOUT
  ====================================================== */

  const logout = useCallback(() => {
    localStorage.removeItem("token");

    if (isMountedRef.current) {
      setUser(null);
      setInitialized(true);
    }
  }, []);

  /* ======================================================
     INITIAL BOOTSTRAP
  ====================================================== */

  useEffect(() => {
    loadUser();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadUser]);

  /* ======================================================
     CONTEXT VALUE
  ====================================================== */

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      refreshing,
      initialized,
      refreshUser: () => loadUser(true),
      logout
    }),
    [user, loading, refreshing, initialized, loadUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ======================================================
   SAFE HOOK
====================================================== */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};