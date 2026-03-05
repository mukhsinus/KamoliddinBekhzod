// components/admin/AdminLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

export default function AdminLayout() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["admin-phase-indicator"],
    queryFn: async () => {
      const res = await api.get("/api/contest");
      return res.data;
    }
  });

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r transform
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1">

        {/* TOPBAR */}
        <header className="min-h-[64px] bg-white border-b 
                   flex items-center justify-between 
                   px-4 sm:px-6">

          <div className="flex items-center gap-4">

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>

            <h1 className="font-semibold text-lg">
              {t('admin.sidebar.title')}
            </h1>

            {data?.phase && (
              <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
                {data.phase}
              </span>
            )}

          </div>

          {/* USER INFO */}
          <div className="flex items-center gap-4">

            <div className="text-sm text-right hidden sm:block">
              <div className="font-medium">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-gray-500 text-xs">
                {user?.email}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={18} />
            </button>

          </div>

        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto 
                 px-4 py-6 
                 sm:px-6 
                 lg:px-8 lg:py-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}