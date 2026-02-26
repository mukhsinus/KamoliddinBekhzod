// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";

import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

import { AuthProvider } from "@/context/AuthContext";
import AdminRoute from "@/routes/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Nominations from "./pages/Nominations";
import Rules from "./pages/Rules";
import FAQ from "./pages/FAQ";
import Biography from "./pages/Biography";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Submissions from "./pages/admin/Submissions";
import Logs from "./pages/admin/Logs";
import ContestSettings from "./pages/admin/ContestSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <AuthProvider>

          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>

              {/* ============================
                  PUBLIC ROUTES
              ============================ */}
              <Route element={<Layout />}>

                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/nominations" element={<Nominations />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/biography" element={<Biography />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/auth" element={<Auth />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

              </Route>

              {/* ============================
                  ADMIN ROUTES
              ============================ */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="submissions" element={<Submissions />} />
                <Route path="logs" element={<Logs />} />
                <Route path="contest" element={<ContestSettings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>

        </AuthProvider>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;