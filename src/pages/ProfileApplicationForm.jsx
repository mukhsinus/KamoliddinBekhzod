import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Upload, X, CheckCircle } from 'lucide-react';

export default function ProfileApplicationForm() {
  const [form, setForm] = useState({
    fullName: '',
    education: '',
    nomination: '',
    driveLink: '',
    works: []
  });

  const [nominations, setNominations] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    api.get('/api/nominations')
      .then(res => setNominations(res.data))
      .catch(() => setError('Ошибка загрузки номинаций'));
  }, []);

  // -----------------------------
  // FILE HANDLING
  // -----------------------------

  const handleFiles = (files) => {
    const allowed = 10 - form.works.length;
    const selected = Array.from(files).slice(0, allowed);

    setForm(prev => ({
      ...prev,
      works: [...prev.works, ...selected]
    }));

    setPreviews(prev => [
      ...prev,
      ...selected.map(file => URL.createObjectURL(file))
    ]);
  };

  const removeFile = (index) => {
    setForm(prev => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index)
    }));

    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nomination) {
      return setError('Выберите номинацию');
    }

    if (form.works.length === 0) {
      return setError('Загрузите хотя бы одну работу');
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'works') {
          data.append(key, value);
        }
      });

      form.works.forEach(file => {
        data.append('works', file);
      });

      await api.post('/api/applications', data);

      setSuccess(true);

    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // SUCCESS STATE
  // -----------------------------

  if (success) {
    return (
      <div className="text-center py-24">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-gold" />
        <h3 className="font-display text-3xl font-bold">
          Заявка отправлена
        </h3>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          Ваша работа успешно отправлена на рассмотрение жюри.
          Результаты будут опубликованы после завершения этапа отбора.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14">

      {/* HEADER */}
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold">
          Подача заявки
        </h2>
        <div className="ornament-divider my-4">
          <span className="text-gold text-lg">✦</span>
        </div>
        <p className="text-muted-foreground">
          Заполните информацию и прикрепите свои работы
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* PERSONAL INFO */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft space-y-6">
          <h3 className="font-display text-xl font-semibold">
            Личная информация
          </h3>

          <div className="space-y-4">
            <input
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              placeholder="ФИО участника"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              value={form.education}
              onChange={e => setForm({ ...form, education: e.target.value })}
              placeholder="Учебное заведение и факультет"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              value={form.driveLink}
              onChange={e => setForm({ ...form, driveLink: e.target.value })}
              placeholder="Ссылка на Google Drive (если требуется)"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* NOMINATION */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft space-y-6">
          <h3 className="font-display text-xl font-semibold">
            Выбор номинации
          </h3>

          <div className="flex flex-wrap gap-3">
            {nominations.map(n => (
              <button
                key={n._id}
                type="button"
                onClick={() => setForm({ ...form, nomination: n.slug })}
                className={`px-5 py-2.5 rounded-lg border transition-all text-sm font-medium
                  ${form.nomination === n.slug
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }
                `}
              >
                {n.title}
              </button>
            ))}
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft space-y-6">
          <h3 className="font-display text-xl font-semibold">
            Загрузка работ
          </h3>

          <div
            onClick={() => inputRef.current.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/40 p-10 text-center transition hover:border-primary hover:bg-muted"
          >
            <Upload className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">
              Нажмите для загрузки изображений
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              До 10 файлов, максимум 5MB каждый
            </p>

            <input
              type="file"
              hidden
              multiple
              ref={inputRef}
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt=""
                    className="w-28 h-28 object-cover rounded-lg shadow-soft"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-center text-destructive font-medium">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold px-6 py-4 font-medium text-primary shadow-gold transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Подать заявку'}
        </button>

      </form>
    </div>
  );
}