import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

const Biography = () => {
  const { t, lang } = useI18n();

  const sections = lang === 'ru'
    ? [
        { title: 'Ранние годы', text: 'Камолиддин Бехзод родился около 1455 года в Герате (современный Афганистан). Осиротев в раннем возрасте, он был воспитан великим поэтом и мыслителем Алишером Навои, который распознал его уникальный талант и обеспечил ему лучшее образование.' },
        { title: 'Мастерство и стиль', text: 'Бехзод революционизировал искусство миниатюры, привнеся в него реалистичность, глубину и эмоциональность. Его композиции отличались динамичностью, изысканной цветовой гаммой и вниманием к деталям повседневной жизни. Он отошёл от условности и создал новый визуальный язык.' },
        { title: 'Наследие', text: 'Влияние Бехзода на искусство Центральной Азии, Ирана и Индии невозможно переоценить. Его называют «Рафаэлем Востока». Его традиции продолжают жить в работах современных художников, а его имя стало символом высочайшего мастерства в изобразительном искусстве.' },
        { title: 'Значение конкурса', text: 'Международный конкурс имени Бехзода создан для того, чтобы сохранить и развить традиции великого мастера, вдохновить новое поколение художников на диалог между классическим наследием и современным творчеством.' },
      ]
    : [
        { title: 'Early Years', text: 'Kamoliddin Behzod was born around 1455 in Herat (modern-day Afghanistan). Orphaned at a young age, he was raised by the great poet and thinker Alisher Navoi, who recognized his unique talent and provided him with the finest education.' },
        { title: 'Mastery and Style', text: 'Behzod revolutionized the art of miniature painting by introducing realism, depth, and emotional expression. His compositions were distinguished by their dynamism, exquisite color palette, and attention to everyday life details. He moved away from convention and created a new visual language.' },
        { title: 'Legacy', text: 'Behzod\'s influence on the art of Central Asia, Iran, and India cannot be overstated. He is often called the "Raphael of the East." His traditions live on in the works of contemporary artists, and his name has become a symbol of the highest mastery in visual arts.' },
        { title: 'Competition Significance', text: 'The International Competition named after Behzod was created to preserve and develop the traditions of the great master, inspiring a new generation of artists to engage in dialogue between classical heritage and contemporary creativity.' },
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
            {t('bio.title')}
          </motion.h1>
          <div className="ornament-divider my-4">
            <span className="text-gold text-lg">✦</span>
          </div>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">{t('bio.subtitle')}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg leading-relaxed text-muted-foreground italic border-l-4 border-gold pl-6"
          >
            {t('bio.intro')}
          </motion.p>

          <div className="mt-12 space-y-10">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h2 className="font-display text-xl font-bold text-foreground">{s.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Biography;
