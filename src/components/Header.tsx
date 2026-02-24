import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t, lang, setLang } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/nominations', label: t('nav.nominations') },
    { to: '/rules', label: t('nav.rules') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/biography', label: t('nav.biography') },
    { to: '/contacts', label: t('nav.contacts') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-lg font-bold text-primary-foreground">
              B
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold leading-tight text-white">
              {lang === 'ru' ? 'Конкурс Бехзода' : 'Behzod Competition'}
            </p>
            <p className="text-xs text-gray-300">
              {lang === 'ru' ? 'Международный' : 'International'}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {baseLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-gold-dark bg-secondary'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* AUTH BUTTON LOGIC */}
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="ml-4 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Войти
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="ml-4 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Профиль
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 text-sm text-red-300 hover:text-red-400"
              >
                Выйти
              </button>
            </>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="flex items-center gap-1.5 rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white hover:border-gold transition"
          >
            <Globe className="h-4 w-4" />
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-white lg:hidden"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/20 bg-[#1f2f57]/95 backdrop-blur-md lg:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
              {baseLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-4 py-3 text-sm text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="rounded-md bg-white/10 px-4 py-3 text-sm text-white"
                >
                  Войти
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="rounded-md bg-white/10 px-4 py-3 text-sm text-white"
                  >
                    Профиль
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-3 text-sm text-red-300"
                  >
                    Выйти
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