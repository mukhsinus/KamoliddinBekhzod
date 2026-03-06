import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

const Footer = () => {
  const { t, lang } = useI18n();

  const links = [
    { to: '/about', label: t('nav.about') },
    { to: '/nominations', label: t('nav.nominations') },
    { to: '/rules', label: t('nav.rules') },
    { to: '/biography', label: t('nav.biography') },
    { to: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 pt-12 lg:pt-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold">
                <span className="font-display text-lg font-bold text-primary">B</span>
              </div>
              <div>
                <p className="font-display text-sm font-semibold leading-tight">
                  {lang === 'ru' ? 'Конкурс Бехзода' : 'Behzod Competition'}
                </p>
                <p className="text-xs text-primary-foreground/60">
                  {lang === 'ru' ? 'Международный творческий конкурс' : 'International Creative Competition'}
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60 max-w-xs">
              {lang === 'ru' 
                ? 'Сохранение и развитие культурного наследия великого мастера восточной миниатюры'
                : 'Preserving and developing the cultural heritage of the great master of Eastern miniature painting'
              }
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-gold">
              {lang === 'ru' ? 'Навигация' : 'Navigation'}
            </h4>
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-primary-foreground/60 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-gold">
              {t('contacts.title')}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <p>info@behzod-competition.org</p>
              <p>+998 71 123 45 67</p>
              <p>{lang === 'ru' ? 'Ташкент, Узбекистан' : 'Tashkent, Uzbekistan'}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} {lang === 'ru' ? 'Конкурс им. Бехзода' : 'Behzod Competition'}. {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-1 text-xs text-primary-foreground/40">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            {lang === 'ru' ? 'Культурное наследие • Современное искусство' : 'Cultural Heritage • Contemporary Art'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
