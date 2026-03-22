import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import api from '@/services/api';

const Contacts = () => {
  const { t, lang } = useI18n();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('📧 Form submitted:', { name: formState.name, email: formState.email, messageLength: formState.message.length });

    if (!formState.name || !formState.email || !formState.message) {
      alert(lang === 'ru' ? 'Заполните все поля' : 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/contact', formState);
      console.log('✅ Message sent successfully:', response.data);
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: any) {
      console.error('❌ Error submitting contact form:', error);
      const errorMsg = error?.response?.data?.error || error?.message || 'Unknown error';
      console.error('Error details:', errorMsg);
      alert(lang === 'ru' ? `Ошибка: ${errorMsg}` : `Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t('contacts.email'), value: 'info@behzod-competition.org' },
    { icon: Phone, label: t('contacts.phone'), value: '+998 71 123 45 67' },
    { icon: MapPin, label: t('contacts.address'), value: lang === 'ru' ? 'г. Ташкент, ул. Навои, 30' : '30 Navoi Street, Tashkent' },
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
            {t('contacts.title')}
          </motion.h1>
          <div className="ornament-divider my-4">
            <span className="text-gold text-lg">✦</span>
          </div>
          <p className="text-primary-foreground/60">{t('contacts.subtitle')}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <info.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{info.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{info.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-6 shadow-soft lg:p-8"
            onSubmit={handleSubmit}
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">
              {lang === 'ru' ? 'Напишите нам' : 'Write to us'}
            </h3>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                <CheckCircle className="h-5 w-5" />
                {lang === 'ru' ? 'Спасибо! Ваше сообщение отправлено.' : 'Thank you! Your message has been sent.'}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  {lang === 'ru' ? 'Имя' : 'Name'}
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  disabled={loading}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
                  placeholder={lang === 'ru' ? 'Ваше имя' : 'Your name'}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  {lang === 'ru' ? 'Электронная почта' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  disabled={loading}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  {lang === 'ru' ? 'Сообщение' : 'Message'}
                </label>
                <textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  disabled={loading}
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none disabled:opacity-50"
                  placeholder={lang === 'ru' ? 'Ваше сообщение...' : 'Your message...'}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {loading ? (lang === 'ru' ? 'Отправка...' : 'Sending...') : t('common.submit')}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Contacts;
