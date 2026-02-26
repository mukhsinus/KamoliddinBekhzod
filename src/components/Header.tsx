// Header.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { t, lang, setLang } = useI18n();
  const { user, loading, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  /* =========================
     Scroll Detection
  ========================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     Navigation Links
  ========================= */
  const baseLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/nominations", label: t("nav.nominations") },
    { to: "/rules", label: t("nav.rules") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/biography", label: t("nav.biography") },
    { to: "/contacts", label: t("nav.contacts") },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  const topText = scrolled
    ? "text-foreground"
    : "text-primary-foreground/80";

  const topMuted = scrolled
    ? "text-muted-foreground"
    : "text-primary-foreground/60";

  if (loading) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-lg font-bold text-primary-foreground">
              B
            </span>
          </div>

          <div className="hidden sm:block">
            <p className={`font-display text-sm font-semibold ${topText}`}>
              {lang === "ru"
                ? "Конкурс Бехзода"
                : "Behzod Competition"}
            </p>
            <p className={`text-xs ${topMuted}`}>
              {lang === "ru" ? "" : "International"}
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-1 lg:flex">
          {baseLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? scrolled
                    ? "text-primary bg-secondary"
                    : "text-primary-foreground bg-white/10"
                  : scrolled
                  ? "text-muted-foreground hover:text-primary hover:bg-muted"
                  : "text-primary-foreground/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* ================= AUTH AREA ================= */}
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className={`ml-4 rounded-md px-4 py-2 text-sm font-semibold transition ${
                scrolled
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-white/10 text-primary-foreground hover:bg-white/20"
              }`}
            >
              {t("nav.login")}
            </Link>
          ) : (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className={`ml-4 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  scrolled
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-white/10 text-primary-foreground hover:bg-white/20"
                }`}
              >
                {t("profile.tabs.profile")}
              </Link>

              {/* Admin Panel */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="ml-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  Admin
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`ml-3 text-sm transition ${
                  scrolled
                    ? "text-destructive hover:opacity-80"
                    : "text-red-300 hover:text-red-200"
                }`}
              >
                {t("profile.logout")}
              </button>
            </>
          )}
        </nav>

        {/* ================= RIGHT CONTROLS ================= */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              scrolled
                ? "border border-border text-foreground hover:border-primary"
                : "border border-white/30 text-primary-foreground hover:border-white"
            }`}
          >
            <Globe className="h-4 w-4" />
            {lang === "ru" ? "EN" : "RU"}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-md p-2 lg:hidden ${topText}`}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
              {baseLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobile}
                  className="rounded-md px-4 py-3 text-sm text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  onClick={closeMobile}
                  className="rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground"
                >
                  {t("nav.login")}
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className="rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground"
                  >
                    {t("profile.tabs.profile")}
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMobile}
                      className="rounded-md bg-indigo-600 px-4 py-3 text-sm text-white"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobile();
                    }}
                    className="text-left px-4 py-3 text-sm text-destructive"
                  >
                    {t("profile.logout")}
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;