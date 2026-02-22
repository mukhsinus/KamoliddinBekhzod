import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Rules = () => {
  const { t, lang } = useI18n();

  const rules = lang === 'ru'
    ? [
        { title: 'Участники', items: ['Возраст: от 18 до 40 лет', 'Гражданство: любая страна мира', 'Профессиональные и начинающие художники, дизайнеры, архитекторы', 'Регистрация через электронную почту с подтверждением'] },
        { title: 'Подача заявки', items: ['Выберите одну или несколько номинаций', 'Загрузите работы в соответствии с техническими требованиями', 'Заполните информацию о работе: название, описание, теги', 'Сохраняйте черновики и редактируйте до дедлайна', 'После дедлайна подача и редактирование блокируются'] },
        { title: 'Оценка работ', items: ['Первый этап: оценка профессиональным жюри онлайн', 'Критерии: оригинальность, мастерство, связь с традицией, инновационность', 'Жюри выставляет баллы по шкале от 1 до 10', 'Финалисты приглашаются на офлайн-выставку и церемонию'] },
        { title: 'Технические требования', items: ['Изображения: JPEG, PNG, TIFF — до 50 МБ', 'Видео: MP4 — до 200 МБ, до 5 минут', '3D-модели: GLB — до 200 МБ', 'PDF-файлы: до 50 МБ', 'Все работы должны быть оригинальными'] },
        { title: 'Правила и ограничения', items: ['Работы, нарушающие авторские права, отклоняются', 'Запрещён контент, содержащий насилие или дискриминацию', 'Один участник может подать заявки в несколько номинаций', 'Решения жюри являются окончательными'] },
      ]
    : [
        { title: 'Participants', items: ['Age: 18 to 40 years old', 'Citizenship: any country in the world', 'Professional and emerging artists, designers, architects', 'Registration via email with verification'] },
        { title: 'Application Submission', items: ['Select one or more nominations', 'Upload works according to technical requirements', 'Fill in work information: title, description, tags', 'Save drafts and edit until deadline', 'After deadline, submission and editing are locked'] },
        { title: 'Evaluation', items: ['Stage 1: professional jury online evaluation', 'Criteria: originality, craftsmanship, connection to tradition, innovation', 'Jury assigns scores from 1 to 10', 'Finalists are invited to offline exhibition and ceremony'] },
        { title: 'Technical Requirements', items: ['Images: JPEG, PNG, TIFF — up to 50 MB', 'Video: MP4 — up to 200 MB, up to 5 minutes', '3D models: GLB — up to 200 MB', 'PDF files: up to 50 MB', 'All works must be original'] },
        { title: 'Rules and Restrictions', items: ['Works violating copyright will be rejected', 'Content containing violence or discrimination is prohibited', 'One participant may apply to multiple nominations', 'Jury decisions are final'] },
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
            {t('rules.title')}
          </motion.h1>
          <div className="ornament-divider my-4">
            <span className="text-gold text-lg">✦</span>
          </div>
          <p className="text-primary-foreground/60">{t('rules.subtitle')}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {rules.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-6 shadow-soft lg:p-8"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rules;
