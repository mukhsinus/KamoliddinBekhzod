// src/components/admin/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import {
  LayoutDashboard,
  Users,
  FileText,
  ScrollText,
  Settings
} from "lucide-react";

interface Props {
  closeSidebar?: () => void;
}

export default function Sidebar({ closeSidebar }: Props) {
  const { t } = useI18n();
  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  const linkActive =
    "bg-indigo-100 text-indigo-700";

  const linkInactive =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold tracking-tight">
          {t('admin.sidebar.title')}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {t('admin.sidebar.subtitle')}
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2">

        <NavItem
          to="/admin"
          end
          icon={<LayoutDashboard size={18} />}
          label={t('admin.sidebar.dashboard')}
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/users"
          icon={<Users size={18} />}
          label={t('admin.sidebar.users')}
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/submissions"
          icon={<FileText size={18} />}
          label={t('admin.sidebar.submissions')}
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/logs"
          icon={<ScrollText size={18} />}
          label={t('admin.sidebar.logs')}
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/contest"
          icon={<Settings size={18} />}
          label={t('admin.sidebar.contest')}
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} {t('admin.sidebar.footer')}
      </div>

    </div>
  );
}

/* ============================
   NAV ITEM COMPONENT
============================ */

function NavItem({
  to,
  icon,
  label,
  closeSidebar,
  end,
  linkBase,
  linkActive,
  linkInactive
}: any) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => closeSidebar?.()}
      className={({ isActive }: { isActive: boolean }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}