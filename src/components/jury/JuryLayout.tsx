// JuryLayout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";

export default function JuryLayout() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md text-sm transition ${
      isActive
        ? "bg-[#e9eef9] text-[#1f2f57] font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-[#f5f1ea]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-6 border-b">
          <h2 className="text-lg font-semibold">{t('jury.title')}</h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('jury.subtitle')}
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/jury" end className={linkClass}>
            {t('jury.dashboard')}
          </NavLink>

          <NavLink to="/jury/submissions" className={linkClass}>
            {t('jury.submissions')}
          </NavLink>

          <NavLink to="/jury/reviews" className={linkClass}>
            {t('jury.myReviews')}
          </NavLink>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            {t('jury.backProfile')}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">{t('jury.title')}</h1>

          <div className="text-sm text-gray-600">
            {user?.firstName} {user?.lastName}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}