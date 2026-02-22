import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const nominations = [
  { key: '1', icon: '🎨', formats: 'JPEG, PNG, TIFF', maxSize: '50 MB', maxWorks: 5 },
  { key: '2', icon: '🏺', formats: 'JPEG, PNG, PDF', maxSize: '50 MB', maxWorks: 5 },
  { key: '3', icon: '📖', formats: 'JPEG, PNG, PDF', maxSize: '50 MB', maxWorks: 10 },
  { key: '4', icon: '💻', formats: 'JPEG, PNG, MP4, GLB', maxSize: '200 MB', maxWorks: 3 },
  { key: '5', icon: '✏️', formats: 'JPEG, PNG, PDF', maxSize: '50 MB', maxWorks: 5 },
  { key: '6', icon: '🏛️', formats: 'JPEG, PNG, PDF, MP4', maxSize: '100 MB', maxWorks: 3 },
  { key: '7', icon: '👗', formats: 'JPEG, PNG, PDF, MP4', maxSize: '100 MB', maxWorks: 5 },
];

const Nominations = () => {
  const { t, lang } = useI18n();

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
          <p className="text-primary-foreground/60 max-w-lg mx-auto">{t('nominations.subtitle')}</p>
        </div>
      </section>

      {/* Cards */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid gap-6 lg:gap-8">
          {nominations.map((nom, i) => (
            <motion.div
              key={nom.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-elevated lg:p-8"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{nom.icon}</span>
                    <h2 className="font-display text-xl font-bold text-foreground lg:text-2xl">
                      {t(`nom.${nom.key}.title` as any)}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`nom.${nom.key}.desc` as any)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {t('nominations.age')}
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {t('nominations.international')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
                  <div className="rounded-lg bg-muted p-4 text-sm w-full lg:w-auto">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">{lang === 'ru' ? 'Форматы' : 'Formats'}:</span> {nom.formats}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium text-foreground">{lang === 'ru' ? 'Макс. размер' : 'Max size'}:</span> {nom.maxSize}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium text-foreground">{lang === 'ru' ? 'Макс. работ' : 'Max works'}:</span> {nom.maxWorks}
                    </p>
                  </div>
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 lg:w-auto">
                    {t('nominations.apply')}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Nominations;
