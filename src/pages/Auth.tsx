// Auth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/context/AuthContext';

export default function Auth() {
  const { t } = useI18n();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const endpoint =
        mode === 'login' ? '/api/auth/login' : '/api/auth/register';

      const payload =
        mode === 'login'
          ? {
              email: form.email.trim(),
              password: form.password,
            }
          : {
              firstName: form.firstName.trim(),
              lastName: form.lastName.trim(),
              email: form.email.trim(),
              password: form.password,
            };

      const res = await api.post(endpoint, payload);

      if (!res.data?.token) {
        throw new Error('Token not returned from server');
      }

      // 1️⃣ Сохраняем токен
      localStorage.setItem('token', res.data.token);

      // 2️⃣ Загружаем текущего пользователя
      await refreshUser();

      // 3️⃣ Только после успешной синхронизации — переход
      navigate('/profile', { replace: true });

    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        t('auth.error');

      setError(message);

      // если логин упал — на всякий случай очищаем токен
      localStorage.removeItem('token');
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
              disabled={loading}
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
              disabled={loading}
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
                value={form.email}
                onChange={handleChange}
                required
                autoComplete={mode === 'login' ? 'username' : 'email'}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                {t('auth.password')}
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
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