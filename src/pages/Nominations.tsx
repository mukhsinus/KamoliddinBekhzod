import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface Nomination {
  _id: string;
  title: {
    ru: string;
    en: string;
  };
  slug: string;
  description?: {
    ru: string;
    en: string;
  };
  formats?: string;
  maxSize?: string;
  maxWorks?: number;
  icon?: string;
}

const Nominations = () => {
  const { t, lang } = useI18n();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/nominations')
      .then(res => setNominations(res.data))
      .catch(() => console.error('Ошибка загрузки номинаций'))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (slug: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/auth');
    } else {
      navigate(`/profile?nomination=${slug}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold lg:text-5xl"
          >
            {t('nominations.title')}
          </motion.h1>

          <div className="ornament-divider my-4">
            <span className="text-gold text-lg">✦</span>
          </div>

          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            {t('nominations.subtitle')}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        {loading ? (
          <div className="text-center text-muted-foreground">
            {lang === 'ru' ? 'Загрузка номинаций...' : 'Loading nominations...'}
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-8">
            {nominations.map((nom, i) => (
              <motion.div
                key={nom._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-elevated lg:p-8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">

                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">
                        {nom.icon || '🎨'}
                      </span>

                      <h2 className="font-display text-xl font-bold text-foreground lg:text-2xl">
                        {nom.title?.[lang]}
                      </h2>
                    </div>

                    {nom.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {nom.description?.[lang]}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {t('nominations.age')}
                      </span>

                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {t('nominations.international')}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
                    <div className="rounded-lg bg-muted p-4 text-sm w-full lg:w-auto">
                      {nom.formats && (
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {lang === 'ru' ? 'Форматы' : 'Formats'}:
                          </span>{' '}
                          {nom.formats}
                        </p>
                      )}

                      {nom.maxSize && (
                        <p className="mt-1 text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {lang === 'ru' ? 'Макс. размер' : 'Max size'}:
                          </span>{' '}
                          {nom.maxSize}
                        </p>
                      )}

                      {nom.maxWorks && (
                        <p className="mt-1 text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {lang === 'ru' ? 'Макс. работ' : 'Max works'}:
                          </span>{' '}
                          {nom.maxWorks}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleApply(nom.slug)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 lg:w-auto"
                    >
                      {t('nominations.apply')}
                      <ArrowRight className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Nominations;