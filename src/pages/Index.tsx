// Index.tsx
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Globe, Users, Award, Palette, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.webp';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const { t, lang } = useI18n();

  const stats = [
    { icon: Globe, value: '40+', label: lang === 'ru' ? 'Стран-участниц' : 'Countries' },
    { icon: Users, value: '2,500+', label: lang === 'ru' ? 'Участников' : 'Participants' },
    { icon: Palette, value: '7', label: lang === 'ru' ? 'Номинаций' : 'Nominations' },
    { icon: Award, value: '21', label: lang === 'ru' ? 'Призовых мест' : 'Prize Places' },
  ];

  const nominations = [
    { key: '1', icon: '🎨' },
    { key: '2', icon: '🏺' },
    { key: '3', icon: '📖' },
    { key: '4', icon: '💻' },
    { key: '5', icon: '✏️' },
    { key: '6', icon: '🏛️' },
    { key: '7', icon: '👗' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover object-right" />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative container mx-auto px-4 py-24 lg:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold-light backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              {t('hero.deadline')}: 15.09.2026
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              {t('hero.title')}
              <span className="block text-gold">{t('hero.subtitle')}</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-xl text-lg text-primary-foreground/70"
            >
              {t('hero.description')}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/nominations"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-medium text-primary shadow-gold transition-all hover:brightness-110"
              >
                {t('hero.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-6 py-3 font-medium text-primary-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {t('hero.learnMore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 lg:py-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-gold" />
              <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              {t('about.title')}
            </h2>
            <div className="ornament-divider my-4">
              <span className="text-gold text-lg">✦</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t('about.description')}</p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-6 text-left shadow-soft"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <Calendar className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{t('about.stage1.title')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t('about.stage1.description')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-6 text-left shadow-soft"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <Award className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{t('about.stage2.title')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t('about.stage2.description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nominations Preview */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold lg:text-4xl">{t('nominations.title')}</h2>
            <div className="ornament-divider my-4">
              <span className="text-gold text-lg">✦</span>
            </div>
            <p className="text-primary-foreground/60">{t('nominations.subtitle')}</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nominations.map((nom, i) => (
              <motion.div
                key={nom.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to="/nominations"
                  className="group block rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 transition-all hover:border-gold/30 hover:bg-primary-foreground/10"
                >
                  <span className="mb-3 block text-2xl">{nom.icon}</span>
                  <h3 className="font-display text-sm font-semibold leading-snug group-hover:text-gold transition-colors">
                    {t(`nom.${nom.key}.title` as any)}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/nominations"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-medium text-primary transition-all hover:brightness-110"
            >
              {t('nominations.details')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-elevated lg:p-12"
        >
          <h2 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
            {lang === 'ru' ? 'Готовы принять участие?' : 'Ready to Participate?'}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {lang === 'ru'
              ? 'Подайте заявку на участие в международном творческом конкурсе имени Камолиддина Бехзода'
              : 'Apply to participate in the International Creative Competition named after Kamoliddin Behzod'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/nominations"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              {t('hero.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/rules"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t('nav.rules')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
