// src/components/jury/JuryLayout.tsx

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function JuryLayout() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md text-sm transition ${
      isActive
        ? "bg-[#e9eef9] text-[#1f2f57] font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-[#f5f1ea]">

      {/* MOBILE SIDEBAR OVERLAY */}

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{t("jury.title")}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t("jury.subtitle")}
            </p>
          </div>

          {/* CLOSE MOBILE */}

          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">

          <NavLink
            to="/jury"
            end
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            {t("jury.dashboard")}
          </NavLink>

          <NavLink
            to="/jury/submissions"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            {t("jury.submissions")}
          </NavLink>

          <NavLink
            to="/jury/reviews"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            {t("jury.myReviews")}
          </NavLink>

        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            {t("jury.backProfile")}
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col md:ml-64">

        {/* HEADER */}

        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

          <div className="flex items-center gap-4">

            {/* BURGER */}

            <button
              className="md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>

            <h1 className="text-lg font-semibold">
              {t("jury.title")}
            </h1>

          </div>

          <div className="text-sm text-gray-600">
            {user?.firstName} {user?.lastName}
          </div>

        </header>

        {/* PAGE */}

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}