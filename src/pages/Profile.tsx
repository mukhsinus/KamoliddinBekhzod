// Profile.tsx
import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import ProfileApplicationForm from './ProfileApplicationForm';
import { useI18n } from '@/lib/i18n';


type Tab =  'profile' | 'applications' | 'diplomas';

export default function Profile() {
  const [tabName, setTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [apps, setApps] = useState<any[]>([]);
  const [diplomas, setDiplomas] = useState<any[]>([]);

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { t } = useI18n();

  // ------------------------------
  // LOAD DATA
  // ------------------------------

  useEffect(() => {
    async function load() {
      try {
        const me = await api.get('/api/auth/me');
        setUser(me.data);
        setForm(me.data);
        setAvatarPreview(me.data.avatar || '/default-avatar.png');

        const mySubs = await api.get('/api/submissions/me');
        setApps(mySubs.data);

        const myDiplomas = await api.get('/api/diplomas/my');
        setDiplomas(myDiplomas.data);
      } catch (e) {
        setError(t('profile.error.load'));
      } finally {
        setLoadingUser(false);
      }
    }

    load();
  }, []);


  // ------------------------------
  // REFRESH SUBMISSIONS
  // ------------------------------

  const refreshSubmissions = async () => {
    try {
      const res = await api.get('/api/submissions/me');
      setApps(res.data);
    } catch (e) {
      console.error('Ошибка обновления заявок');
    }
  };


  // ------------------------------
  // SAVE PROFILE
  // ------------------------------

  const handleProfileSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let avatarUrl = form.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const res = await api.put('/api/auth/avatar', formData);
        avatarUrl = res.data.avatar;
      }

      const res = await api.put('/api/auth/me', {
        firstName: form.firstName,
        lastName: form.lastName,
        age: form.age,
        city: form.city,
        phone: form.phone,
        email: form.email,
        avatar: avatarUrl
      });

      setUser(res.data);
      setForm(res.data);
      setSuccess('Профиль успешно обновлён');
      setEdit(false);
      setAvatarFile(null);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // LOADING
  // ------------------------------

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1ea]">
        <div className="animate-pulse text-[#1f2f57] text-lg">
          {t('profile.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea]">

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#1f2f57] to-[#2e4379] py-20 text-center text-white">
        <h1 className="text-5xl font-serif">
          {t('profile.hero.title')}
        </h1>

        <p className="mt-4 text-gray-300">
          {t('profile.hero.subtitle')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* TABS */}
        <div className="flex justify-center gap-6 mb-12">
          {(['profile','applications','diplomas'] as Tab[]).map(tabName => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`px-6 py-3 rounded-full transition ${
                tabName === tabName
                  ? 'bg-[#1f2f57] text-white shadow'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tabName === 'profile' && t('profile.tabs.profile')}
              {tabName === 'applications' && t('profile.tabs.applications')}
              {tabName === 'diplomas' && t('profile.tabs.diplomas')}
            </button>
          ))}
        </div>

        {error && <div className="text-red-500 text-center mb-6">{error}</div>}
        {success && <div className="text-green-600 text-center mb-6">{success}</div>}

        {/* PROFILE TAB */}
        {tabName === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">

            {/* AVATAR */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group">
                <img
                  src={avatarPreview || '/default-avatar.png'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#d4af37] shadow-md"
                />

                {edit && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
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

            <h3 className="text-2xl font-serif text-center mb-10">
              {t('profile.section.personal')}
            </h3>

            {/* PERSONAL INFO */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {['firstName','lastName','age','city'].map(field => (
                <input
                  key={field}
                  value={form?.[field] || ''}
                  disabled={!edit}
                  onChange={e => setForm((prev:any)=>({...prev, [field]:e.target.value}))}
                  className={`px-4 py-3 rounded-lg border transition ${
                    edit
                      ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#1f2f57]'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                  placeholder={
                    field === 'firstName' ? t('profile.field.firstName') :
                    field === 'lastName' ? t('profile.field.lastName') :
                    field === 'age' ? t('profile.field.age') :
                    t('profile.field.city')
                  }
                />
              ))}
            </div>

            {/* CONTACT INFO */}
            <h3 className="text-xl font-serif mb-6">{t('profile.section.contacts')}</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <input
                value={form?.email || ''}
                disabled={!edit}
                onChange={e => setForm((prev:any)=>({...prev, email:e.target.value}))}
                className={`px-4 py-3 rounded-lg border transition ${
                  edit
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#1f2f57]'
                    : 'bg-gray-100 border-gray-200'
                }`}
                placeholder={t('profile.field.email')}
              />

              <input
                value={form?.phone || ''}
                disabled={!edit}
                onChange={e => setForm((prev:any)=>({...prev, phone:e.target.value}))}
                className={`px-4 py-3 rounded-lg border transition ${
                  edit
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#1f2f57]'
                    : 'bg-gray-100 border-gray-200'
                }`}
                placeholder={t('profile.field.phone')}
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => edit ? handleProfileSave() : setEdit(true)}
                disabled={saving}
                className="px-8 py-3 bg-[#1f2f57] text-white rounded-lg hover:bg-[#2e4379] transition disabled:opacity-50"
              >
                {saving ? t('profile.saving') : (edit ? t('profile.save') : t('profile.edit'))}
              </button>
            </div>

            {/* PASSWORD SECTION */}
            <PasswordChangeSection />

          </div>
        )}

        {tabName === 'applications' && (
          <div className="space-y-12">

            {/* EXISTING SUBMISSIONS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-serif mb-6">{t('profile.tabs.applications')}</h3>

              {apps.length === 0 ? (
                <p className="text-gray-500">{t('profile.applications.empty')}</p>
              ) : (
                <div className="space-y-6">
                  {apps.map(app => (
                    <div
                      key={app._id}
                      className="border rounded-xl p-6 flex justify-between items-start"
                    >
                      <div>
                        <div className="font-semibold text-lg">
                          {app.nomination}
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          {t('profile.applications.status')}: {app.status}
                        </div>

                        {app.workDescription && (
                          <div className="mt-3 text-sm text-gray-700 max-w-xl">
                            {app.workDescription}
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CREATE FORM */}
            <ProfileApplicationForm onSuccess={refreshSubmissions} />

          </div>
        )}

        {tabName === 'diplomas' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
            <h3 className="text-2xl font-serif mb-8">{t('profile.diplomas.title')}</h3>
            {diplomas.map(d => (
              <div key={d._id} className="flex justify-between py-4 border-b">
                <span>{d.title}</span>
                <a href={d.fileUrl} target="_blank" className="text-[#1f2f57] font-semibold">
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

// ----------------------------------------
// PASSWORD COMPONENT
// ----------------------------------------

function PasswordChangeSection() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e:any) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      await api.put('/api/auth/change-password', form);
      setMessage(t('profile.password.success'));
      setForm({ currentPassword:'', newPassword:'', confirmNewPassword:'' });
    } catch (err:any) {
      setMessage(err.response?.data?.error || t('profile.password.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t">
      <h3 className="text-xl font-serif mb-6">{t('profile.password.title')}</h3>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="password"
          name="currentPassword"
          placeholder={t('profile.password.current')}
          value={form.currentPassword}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border"
        />
        <input
          type="password"
          name="newPassword"
          placeholder={t('profile.password.new')}
          value={form.newPassword}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border"
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder={t('profile.password.confirm')}
          value={form.confirmNewPassword}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[#1f2f57] text-white px-6 py-2 rounded-lg hover:bg-[#2e4379]"
      >
        {loading ? t('profile.saving') : t('profile.password.update')}
      </button>

      {message && (
        <div className="mt-4 text-sm text-center">
          {message}
        </div>
      )}
    </div>
  );
}