import { NavLink } from "react-router-dom";
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
          Admin Panel
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Management System
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2">

        <NavItem
          to="/admin"
          end
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/users"
          icon={<Users size={18} />}
          label="Users"
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/submissions"
          icon={<FileText size={18} />}
          label="Submissions"
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/logs"
          icon={<ScrollText size={18} />}
          label="Logs"
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

        <NavItem
          to="/admin/contest"
          icon={<Settings size={18} />}
          label="Contest Settings"
          closeSidebar={closeSidebar}
          linkBase={linkBase}
          linkActive={linkActive}
          linkInactive={linkInactive}
        />

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} Admin System
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