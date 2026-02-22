import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const { t, lang } = useI18n();

  const faqs = lang === 'ru'
    ? [
        { q: 'Кто может участвовать в конкурсе?', a: 'Конкурс открыт для всех граждан мира в возрасте от 18 до 40 лет — как для профессиональных художников и дизайнеров, так и для начинающих.' },
        { q: 'Как зарегистрироваться?', a: 'Нажмите кнопку «Регистрация», заполните форму и подтвердите электронную почту. После этого вам станет доступен личный кабинет для подачи заявок.' },
        { q: 'Можно ли подавать работы в несколько номинаций?', a: 'Да, один участник может подать заявки в несколько номинаций одновременно.' },
        { q: 'Можно ли редактировать заявку после подачи?', a: 'Да, вы можете редактировать и заменять работы до окончания дедлайна. После дедлайна заявка блокируется.' },
        { q: 'Как оцениваются работы?', a: 'Работы оцениваются профессиональным жюри по критериям оригинальности, мастерства, связи с традицией и инновационности. Баллы от 1 до 10.' },
        { q: 'Когда будут объявлены результаты?', a: 'Результаты первого этапа объявляются в октябре. Финалисты приглашаются на офлайн-выставку и церемонию награждения в ноябре.' },
        { q: 'Есть ли организационный взнос?', a: 'Участие в конкурсе бесплатно.' },
        { q: 'Какие форматы файлов принимаются?', a: 'JPEG, PNG, TIFF, PDF, MP4, GLB. Ограничения по размеру зависят от номинации. Подробности — на странице номинаций.' },
      ]
    : [
        { q: 'Who can participate?', a: 'The competition is open to all citizens of the world aged 18 to 40 — both professional artists and designers, as well as emerging talents.' },
        { q: 'How do I register?', a: 'Click the "Register" button, fill out the form, and verify your email. After that, you will have access to your personal dashboard to submit works.' },
        { q: 'Can I submit works to multiple nominations?', a: 'Yes, one participant can submit applications to multiple nominations simultaneously.' },
        { q: 'Can I edit my submission after submitting?', a: 'Yes, you can edit and replace works until the deadline. After the deadline, the submission is locked.' },
        { q: 'How are works evaluated?', a: 'Works are evaluated by a professional jury based on originality, craftsmanship, connection to tradition, and innovation. Scores from 1 to 10.' },
        { q: 'When will results be announced?', a: 'First stage results are announced in October. Finalists are invited to the offline exhibition and award ceremony in November.' },
        { q: 'Is there a participation fee?', a: 'Participation in the competition is free.' },
        { q: 'What file formats are accepted?', a: 'JPEG, PNG, TIFF, PDF, MP4, GLB. Size limits depend on the nomination. Details on the nominations page.' },
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
            {t('faq.title')}
          </motion.h1>
          <div className="ornament-divider my-4">
            <span className="text-gold text-lg">✦</span>
          </div>
          <p className="text-primary-foreground/60">{t('faq.subtitle')}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem value={`item-${i}`} className="rounded-xl border border-border bg-card px-6 shadow-soft">
                  <AccordionTrigger className="font-display text-left text-base font-semibold hover:no-underline hover:text-gold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
