// src/pages/About.tsx
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Calendar, Globe, Users, Target, Award, FileCheck } from 'lucide-react';

const About = () => {
  const { t, lang } = useI18n();

  const features = [
    { icon: Calendar, title: lang === 'ru' ? 'Ежегодный формат' : 'Annual Format', desc: lang === 'ru' ? 'Конкурс проводится каждый год с новой темой и обновлённым жюри' : 'The competition is held every year with a new theme and updated jury' },
    { icon: Globe, title: lang === 'ru' ? 'Международное участие' : 'International Participation', desc: lang === 'ru' ? 'Открыт для участников из всех стран мира' : 'Open to participants from all countries' },
    { icon: Users, title: lang === 'ru' ? 'Возраст 18–40 лет' : 'Age 18–40 years', desc: lang === 'ru' ? 'Конкурс для молодых и перспективных творцов' : 'Competition for young and promising creators' },
    { icon: Target, title: lang === 'ru' ? '7 номинаций' : '7 Nominations', desc: lang === 'ru' ? 'Широкий спектр творческих направлений' : 'Wide range of creative directions' },
    { icon: Award, title: lang === 'ru' ? 'Призовой фонд' : 'Prize Fund', desc: lang === 'ru' ? 'Денежные призы и возможности для победителей' : 'Cash prizes and opportunities for winners' },
    { icon: FileCheck, title: lang === 'ru' ? 'Два этапа' : 'Two Stages', desc: lang === 'ru' ? 'Онлайн-отбор и офлайн-финал с выставкой' : 'Online selection and offline final with exhibition' },
  ];

  return (
    <div>
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold lg:text-5xl"
          >
            {t('about.title')}
          </motion.h1>
          <div className="ornament-divider my-4">
            <span className="text-gold text-lg">✦</span>
          </div>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            {t('about.description')}
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-6 shadow-soft"
            >
              <f.icon className="mb-3 h-6 w-6 text-gold" />
              <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-20 mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-10">
            {lang === 'ru' ? 'Этапы конкурса' : 'Competition Stages'}
          </h2>
          <div className="relative border-l-2 border-gold/30 pl-8 space-y-10">
            {[
              { title: t('about.stage1.title'), desc: t('about.stage1.description'), date: lang === 'ru' ? 'Май — Сентябрь 2026' : 'May — September 2026' },
              { title: lang === 'ru' ? 'Оценка жюри' : 'Jury Evaluation', desc: lang === 'ru' ? 'Профессиональное жюри оценивает все поступившие работы' : 'Professional jury evaluates all submitted works', date: lang === 'ru' ? 'Октябрь 2026' : 'October 2026' },
              { title: t('about.stage2.title'), desc: t('about.stage2.description'), date: lang === 'ru' ? 'Ноябрь 2026' : 'November 2026' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-gold bg-background" />
                <p className="text-xs font-medium text-gold mb-1">{step.date}</p>
                <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
