// Auth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Auth() {
  const { t } = useI18n();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;

      if (mode === 'login') {
        res = await api.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
      } else {
        res = await api.post('/api/auth/register', {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });
      }

      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="gradient-hero">
        <div className="container mx-auto px-4 py-24 text-center text-primary-foreground">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            {mode === 'login'
              ? t('auth.hero.loginTitle')
              : t('auth.hero.registerTitle')}
          </h1>

          <div className="ornament-divider my-6">
            <span className="text-gold text-xl">✦</span>
          </div>

          <p className="text-primary-foreground/70 max-w-xl mx-auto">
            {t('auth.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">

          {/* MODE SWITCH */}
          <div className="flex justify-center mb-8 gap-3">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition
                ${mode === 'login'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }
              `}
            >
              {t('auth.login')}
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition
                ${mode === 'register'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }
              `}
            >
              {t('auth.register')}
            </button>
          </div>

          {error && (
            <div className="mb-6 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t('auth.firstName')}
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    {t('auth.lastName')}
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-muted-foreground">
                {t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                autoComplete={mode === 'login' ? 'username' : 'email'}
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                {t('auth.password')}
              </label>
              <input
                type="password"
                name="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 font-medium text-primary shadow-gold transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading
                ? t('auth.loading')
                : mode === 'login'
                ? t('auth.login')
                : t('auth.register')}
              <ArrowRight className="h-4 w-4" />
            </button>

          </form>
        </div>
      </section>
    </div>
  );
}