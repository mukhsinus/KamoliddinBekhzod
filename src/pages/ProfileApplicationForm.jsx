// ProfileApplicationForm.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

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
  const inputRef = useRef();

  useEffect(() => {
    api.get('/api/nominations').then(res => setNominations(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k,v])=>{
        if(k!=='works') data.append(k,v);
      });
      form.works.forEach(f=>data.append('works',f));
      await api.post('/api/submissions', data);
      setSuccess(true);
    } catch (err) {
      setError('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl text-green-600 mb-4">✓</div>
        <h3 className="font-serif text-2xl">Заявка отправлена</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10">
      <h2 className="text-3xl font-serif text-center mb-10">
        Подача заявки
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        <input
          name="fullName"
          value={form.fullName}
          onChange={e=>setForm({...form, fullName:e.target.value})}
          placeholder="ФИО участника"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          name="education"
          value={form.education}
          onChange={e=>setForm({...form, education:e.target.value})}
          placeholder="Университет и факультет"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          name="driveLink"
          value={form.driveLink}
          onChange={e=>setForm({...form, driveLink:e.target.value})}
          placeholder="Google Drive ссылка"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <div>
          <div className="mb-3 font-semibold">Номинация</div>
          <div className="flex flex-wrap gap-3">
            {nominations.map(n => (
              <button
                key={n._id}
                type="button"
                onClick={()=>setForm({...form, nomination:n.slug})}
                className={`px-4 py-2 rounded-lg border transition
                  ${form.nomination===n.slug
                    ? 'bg-[#1f2f57] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                {n.title}
              </button>
            ))}
          </div>
        </div>

        <div
          onClick={()=>inputRef.current.click()}
          className="border-2 border-dashed border-gray-400 rounded-xl p-10 text-center cursor-pointer"
        >
          <input
            type="file"
            hidden
            multiple
            ref={inputRef}
            onChange={e=>{
              const files=Array.from(e.target.files);
              setForm({...form, works:[...form.works,...files]});
              setPreviews([...previews,...files.map(f=>URL.createObjectURL(f))]);
            }}
          />
          <div className="text-[#1f2f57] font-semibold">
            Загрузить изображения
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {previews.map((src,i)=>(
            <img key={i} src={src} className="w-24 h-24 object-cover rounded-lg shadow"/>
          ))}
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1f2f57] text-white py-4 rounded-lg hover:bg-[#2e4379] transition"
        >
          {loading ? 'Отправка...' : 'Подать заявку'}
        </button>

      </form>
    </div>
  );
}