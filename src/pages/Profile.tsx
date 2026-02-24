import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import ProfileApplicationForm from './ProfileApplicationForm';

type Tab = 'profile' | 'applications' | 'diplomas';

export default function Profile() {
  const [tab, setTab] = useState<Tab>('profile');
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

        const myApps = await api.get('/api/applications/my');
        setApps(myApps.data);

        const myDiplomas = await api.get('/api/diplomas/my');
        setDiplomas(myDiplomas.data);
      } catch (e) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoadingUser(false);
      }
    }

    load();
  }, []);

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
          Загрузка профиля...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea]">

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#1f2f57] to-[#2e4379] py-20 text-center text-white">
        <h1 className="text-5xl font-serif">Личный кабинет</h1>
        <p className="mt-4 text-gray-300">Управление профилем и заявками</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* TABS */}
        <div className="flex justify-center gap-6 mb-12">
          {(['profile','applications','diplomas'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 rounded-full transition ${
                tab === t
                  ? 'bg-[#1f2f57] text-white shadow'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {t === 'profile' && 'Профиль'}
              {t === 'applications' && 'Мои заявки'}
              {t === 'diplomas' && 'Дипломы'}
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
              Личная информация
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
                    field === 'firstName' ? 'Имя' :
                    field === 'lastName' ? 'Фамилия' :
                    field === 'age' ? 'Возраст' :
                    'Город'
                  }
                />
              ))}
            </div>

            {/* CONTACT INFO */}
            <h3 className="text-xl font-serif mb-6">Контактные данные</h3>

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
                placeholder="Email"
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
                placeholder="Телефон"
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => edit ? handleProfileSave() : setEdit(true)}
                disabled={saving}
                className="px-8 py-3 bg-[#1f2f57] text-white rounded-lg hover:bg-[#2e4379] transition disabled:opacity-50"
              >
                {saving ? 'Сохранение...' : (edit ? 'Сохранить изменения' : 'Редактировать профиль')}
              </button>
            </div>

            {/* PASSWORD SECTION */}
            <PasswordChangeSection />

          </div>
        )}

        {tab === 'applications' && <ProfileApplicationForm />}

        {tab === 'diplomas' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
            <h3 className="text-2xl font-serif mb-8">Мои дипломы</h3>
            {diplomas.map(d => (
              <div key={d._id} className="flex justify-between py-4 border-b">
                <span>{d.title}</span>
                <a href={d.fileUrl} target="_blank" className="text-[#1f2f57] font-semibold">
                  Скачать
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
      setMessage('Пароль успешно изменён');
      setForm({ currentPassword:'', newPassword:'', confirmNewPassword:'' });
    } catch (err:any) {
      setMessage(err.response?.data?.error || 'Ошибка смены пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t">
      <h3 className="text-xl font-serif mb-6">Смена пароля</h3>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="password"
          name="currentPassword"
          placeholder="Текущий пароль"
          value={form.currentPassword}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Новый пароль"
          value={form.newPassword}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border"
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Повторите пароль"
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
        {loading ? 'Сохранение...' : 'Обновить пароль'}
      </button>

      {message && (
        <div className="mt-4 text-sm text-center">
          {message}
        </div>
      )}
    </div>
  );
}