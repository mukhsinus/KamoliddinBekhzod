// Profile.tsx
import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProfileApplicationForm from '@/pages/ProfileApplicationForm';
import { useI18n } from '@/lib/i18n';

type Tab = 'profile' | 'applications' | 'diplomas';

interface ProfileForm {
  firstName: string;
  lastName: string;
  age?: number;
  city?: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Submission {
  _id: string;
  nomination: string;
  status: string;
  workDescription?: string;
  createdAt: string;
}

interface Diploma {
  _id: string;
  title: string;
  fileUrl: string;
}

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();
  const { t } = useI18n();

  const [tab, setTab] = useState<Tab>('profile');
  const [form, setForm] = useState<ProfileForm | null>(null);

  const [apps, setApps] = useState<Submission[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('/default-avatar.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ===============================
     LOAD DATA
  =============================== */

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      city: user.city,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    });

    const avatarUrl = user.avatar?.startsWith('http')
      ? user.avatar
      : user.avatar
        ? `${import.meta.env.VITE_API_URL}${user.avatar}`
        : '/default-avatar.png';

    setAvatarPreview(avatarUrl);

    const loadExtra = async () => {
      try {
        const [subsRes, diplomasRes] = await Promise.all([
          api.get('/api/submissions/me'),
          api.get('/api/diplomas/my')
        ]);

        setApps(subsRes.data);
        setDiplomas(diplomasRes.data);
      } catch {
        setError(t('profile.error.load'));
      }
    };

    loadExtra();
  }, [user, t]);

  /* ===============================
     CLEANUP BLOB URL
  =============================== */

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* ===============================
     REFRESH SUBMISSIONS
  =============================== */

  const refreshSubmissions = async () => {
    try {
      const res = await api.get('/api/submissions/me');
      setApps(res.data);
    } catch {
      console.error('Failed to refresh submissions');
    }
  };

  /* ===============================
     SAVE PROFILE
  =============================== */

  const handleProfileSave = async () => {
    if (!form) return;

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await api.put('/api/auth/avatar', formData);
      }

      await api.put('/api/auth/me', {
        firstName: form.firstName,
        lastName: form.lastName,
        age: form.age,
        city: form.city,
        phone: form.phone,
        email: form.email
      });

      await refreshUser();

      setSuccess(t('profile.success'));
      setEdit(false);
      setAvatarFile(null);

    } catch (err: any) {
      setError(err?.response?.data?.error || t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

/* ===============================
   LOADING
=============================== */

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ea]">
      <div className="animate-pulse text-[#1f2f57] text-lg">
        {t('profile.loading')}
      </div>
    </div>
  );
}

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ea]">
      <div className="text-[#1f2f57] text-lg">
        Unauthorized
      </div>
    </div>
  );
}

if (!form) return null;

  /* ===============================
     UI
  =============================== */

  return (
    <div className="min-h-screen bg-[#f5f1ea]">

      <div className="bg-gradient-to-r from-[#1f2f57] to-[#2e4379] py-20 text-center text-white">
        <h1 className="text-5xl font-serif">{t('profile.hero.title')}</h1>
        <p className="mt-4 text-gray-300">{t('profile.hero.subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* TABS */}
        <div className="flex justify-center gap-6 mb-12">
          {(['profile','applications','diplomas'] as Tab[]).map(tabItem => (
            <button
              key={tabItem}
              onClick={() => setTab(tabItem)}
              className={`px-6 py-3 rounded-full transition ${
                tab === tabItem
                  ? 'bg-[#1f2f57] text-white shadow'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tabItem === 'profile' && t('profile.tabs.profile')}
              {tabItem === 'applications' && t('profile.tabs.applications')}
              {tabItem === 'diplomas' && t('profile.tabs.diplomas')}
            </button>
          ))}
        </div>

        {error && <div className="text-red-500 text-center mb-6">{error}</div>}
        {success && <div className="text-green-600 text-center mb-6">{success}</div>}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">

            {/* AVATAR */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group">
                <img
                  src={avatarPreview}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#d4af37] shadow-md"
                />
                {edit && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          const blobUrl = URL.createObjectURL(file);
                          setAvatarPreview(blobUrl);
                        }
                      }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition"
                    >
                      Изменить
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {(['firstName','lastName','age','city','email','phone'] as const).map(field => (
                <input
                  key={field}
                  value={form[field] ?? ''}
                  disabled={!edit}
                  onChange={e =>
                    setForm(prev => prev ? { ...prev, [field]: e.target.value } : prev)
                  }
                  className={`px-4 py-3 rounded-lg border transition ${
                    edit
                      ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#1f2f57]'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => edit ? handleProfileSave() : setEdit(true)}
                disabled={saving}
                className="px-8 py-3 bg-[#1f2f57] text-white rounded-lg hover:bg-[#2e4379] transition disabled:opacity-50"
              >
                {saving ? t('profile.saving') : (edit ? t('profile.save') : t('profile.edit'))}
              </button>
            </div>

            <PasswordChangeSection />
          </div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <div className="space-y-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-serif mb-6">{t('profile.tabs.applications')}</h3>

              {apps.length === 0 ? (
                <p className="text-gray-500">{t('profile.applications.empty')}</p>
              ) : (
                <div className="space-y-6">
                  {apps.map(app => (
                    <div key={app._id} className="border rounded-xl p-6 flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">{app.nomination}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {t('profile.applications.status')}: {app.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ProfileApplicationForm onSuccess={refreshSubmissions} />
          </div>
        )}

        {/* DIPLOMAS */}
        {tab === 'diplomas' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
            <h3 className="text-2xl font-serif mb-8">{t('profile.diplomas.title')}</h3>
            {diplomas.map(d => (
              <div key={d._id} className="flex justify-between py-4 border-b">
                <span>{d.title}</span>
                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1f2f57] font-semibold"
                >
                  {t('profile.diplomas.download')}
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================================
   PASSWORD CHANGE SECTION — PRODUCTION
========================================= */

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

function PasswordChangeSection() {
  const { t } = useI18n();

  const [form, setForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword) {
      return t('profile.password.error');
    }

    if (form.newPassword.length < 6) {
      return t('profile.password.error');
    }

    if (form.newPassword !== form.confirmNewPassword) {
      return t('profile.password.error');
    }

    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;

    setSuccess(null);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await api.put('/api/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword
      });

      setSuccess(t('profile.password.success'));

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.error ||
        t('profile.password.error');

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t">
      <h3 className="text-xl font-serif mb-6">
        {t('profile.password.title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder={t('profile.password.current')}
          className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#1f2f57]"
          autoComplete="current-password"
        />

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder={t('profile.password.new')}
          className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#1f2f57]"
          autoComplete="new-password"
        />

        <input
          type="password"
          name="confirmNewPassword"
          value={form.confirmNewPassword}
          onChange={handleChange}
          placeholder={t('profile.password.confirm')}
          className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#1f2f57]"
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#1f2f57] text-white px-6 py-2 rounded-lg hover:bg-[#2e4379] transition disabled:opacity-50"
        >
          {loading
            ? t('profile.saving')
            : t('profile.password.update')}
        </button>

        {success && (
          <div className="text-green-600 text-sm text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}