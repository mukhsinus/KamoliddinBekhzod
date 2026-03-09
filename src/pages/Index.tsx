import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Calendar, Globe, Users, Award, Palette, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.webp';
import heroBgMobile from '@/assets/herobg-mobile.webp';

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
    { icon: Globe, value: '10+', label: lang === 'ru' ? 'Стран-участниц' : 'Countries' },
    { icon: Users, value: '100+', label: lang === 'ru' ? 'Участников' : 'Participants' },
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

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[100svh] lg:h-screen flex flex-col">

        {/* background */}
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width:768px)" srcSet={heroBgMobile} />
            <img
              src={heroBg}
              alt=""
              className="h-full w-full object-cover object-[70%_center] lg:object-right"
            />
          </picture>

          <div className="absolute inset-0 bg-primary/70" />
        </div>

        {/* content */}
        <div className="relative container mx-auto px-4 py-24 lg:py-28">

          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto lg:mx-0 text-left lg:text-left"
          >

            {/* deadline */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold-light backdrop-blur-sm"
            >
              <Clock className="h-4 w-4" />
              {t('hero.deadline')}: 15.09.2026
            </motion.div>

            {/* title */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display font-bold leading-tight text-primary-foreground text-[34px] md:text-5xl lg:text-6xl"
            >
              {t('hero.title')}
              <span className="block text-gold">
                {t('hero.subtitle')}
              </span>
            </motion.h1>

            {/* DESCRIPTION + BUTTONS */}
            <div className="mt-16 lg:mt-10">

              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-[520px] mx-auto lg:mx-0 text-lg text-primary-foreground/70 whitespace-pre-line"
              >
                {t('hero.description')}
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
              >

              <Link
                to="/nominations"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-medium text-primary shadow-gold transition-all hover:brightness-110"
              >
                {t('hero.cta')}
              
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-6 py-3 font-medium text-primary-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {t('hero.learnMore')}
              </Link>

            </motion.div>
          </div>
          </motion.div>
          

        </div>

        {/* STATS inside hero */}
        <div className="relative container mx-auto px-4 pb-12 mt-auto">

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">

            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >

                <stat.icon className="mx-auto mb-3 h-6 w-6 text-gold" />

                <p className="font-display text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-primary-foreground/70">
                  {stat.label}
                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* ABOUT */}
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

            <p className="text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>

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

              <h3 className="font-display text-lg font-semibold text-foreground">
                {t('about.stage1.title')}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {t('about.stage1.description')}
              </p>

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

              <h3 className="font-display text-lg font-semibold text-foreground">
                {t('about.stage2.title')}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {t('about.stage2.description')}
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* NOMINATIONS */}
      <section className="bg-primary text-primary-foreground">

        <div className="container mx-auto px-4 py-16 lg:py-24">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >

            <h2 className="font-display text-3xl font-bold lg:text-4xl">
              {t('nominations.title')}
            </h2>

            <div className="ornament-divider my-4">
              <span className="text-gold text-lg">✦</span>
            </div>

            <p className="text-primary-foreground/60">
              {t('nominations.subtitle')}
            </p>

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

                  <span className="mb-3 block text-2xl">
                    {nom.icon}
                  </span>

                  <h3 className="font-display text-sm font-semibold leading-snug group-hover:text-gold transition-colors">
                    {t(`nom.${nom.key}.title` as any)}
                  </h3>

                </Link>

              </motion.div>
            ))}

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
            {lang === 'ru'
              ? 'Готовы принять участие?'
              : 'Ready to Participate?'}
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