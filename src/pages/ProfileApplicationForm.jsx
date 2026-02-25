// ProfileApplicationForm.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Upload, X, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

export default function ProfileApplicationForm({ onSuccess }) {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({
    fullName: '',
    education: '',
    nomination: '',
    driveLink: '',
    workDescription: '',
    works: []
  });

  const [nominations, setNominations] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    api.get('/api/nominations')
      .then(res => {
      console.log(res.data);
        setNominations(res.data)})
      .catch(() => setError(t('profile.form.error.loadNominations')));
  }, []);

  useEffect(() => {
    if (nominations.length === 0) return;

    const slug = searchParams.get('nomination');

    if (slug) {
      setForm(prev => ({
        ...prev,
        nomination: slug
      }));
    }
  }, [searchParams, nominations]);

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
      return setError(t('profile.form.error.nomination'));
    }

    if (form.works.length === 0) {
      return setError(t('profile.form.error.noWorks'));
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append('fullName', form.fullName);
      data.append('education', form.education);
      data.append('nomination', form.nomination);

      if (form.driveLink) {
        data.append('driveLink', form.driveLink);
      }

      if (form.workDescription) {
        data.append('workDescription', form.workDescription);
      }

      form.works.forEach(file => {
        data.append('works', file);
      });

      await api.post('/api/submissions', data);

      if (onSuccess) {
        await onSuccess();
      }

      setSuccess(true);

      // Reset form
      setForm({
        fullName: '',
        education: '',
        nomination: '',
        driveLink: '',
        workDescription: '',
        works: []
      });

      setPreviews([]);

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.error || t('profile.form.error.submit'));
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
          {t('profile.form.success.title')}
        </h3>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          {t('profile.form.success.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14">

      <div className="text-center">
        <h2 className="font-display text-3xl font-bold">
          {t('profile.form.title')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* PERSONAL INFO */}
        <div className="rounded-2xl border bg-card p-8 shadow-soft space-y-6">

          <input
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            placeholder={t('profile.form.field.fullName')}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            value={form.education}
            onChange={e => setForm({ ...form, education: e.target.value })}
            placeholder={t('profile.form.field.education')}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            value={form.driveLink}
            onChange={e => setForm({ ...form, driveLink: e.target.value })}
            placeholder={t('profile.form.field.drive')}
            className="w-full rounded-lg border px-4 py-3"
          />

          {/* 🔥 НОВОЕ ПОЛЕ */}
          <div>
            <textarea
              value={form.workDescription}
              onChange={e =>
                setForm({ ...form, workDescription: e.target.value })
              }
              placeholder={t('profile.form.field.description')}
              maxLength={10000}
              rows={6}
              className="w-full rounded-lg border px-4 py-3 resize-none"
            />

            <div className="text-right text-sm text-muted-foreground mt-1">
              {form.workDescription.length} / 10000
            </div>
          </div>
        </div>

        {/* NOMINATION */}
        <div className="flex flex-wrap gap-3">
          {nominations.map(n => (
            <button
              key={n._id}
              type="button"
              onClick={() => setForm({ ...form, nomination: n.slug })}
              className={`px-5 py-2 rounded-lg border ${
                form.nomination === n.slug
                  ? 'bg-primary text-white'
                  : 'bg-muted'
              }`}
            >
              {n.title[lang]}
            </button>
          ))}
        </div>

        {/* FILE UPLOAD */}
        <div
          onClick={() => inputRef.current.click()}
          className="cursor-pointer border-2 border-dashed p-8 text-center"
        >
          <Upload className="mx-auto mb-3" />
          {t('profile.form.upload')}
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
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold px-6 py-4 font-medium disabled:opacity-50"
        >
          {loading ? t('profile.form.sending') : t('profile.form.submit')}
        </button>

      </form>
    </div>
  );
}