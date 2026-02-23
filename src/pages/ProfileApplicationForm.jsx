import { useState, useEffect, useRef } from 'react';


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
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nomination = params.get('nomination');
    if (nomination) {
      setForm(f => ({ ...f, nomination }));
    }
  }, []);
  
  useEffect(() => {
    const fetchNominations = async () => {
      try {
        const res = await api.get('/api/nominations');
        setNominations(res.data);
      } catch (err) {
        console.error('Failed to load nominations', err);
      }
    };
    fetchNominations();
  }, []);

  const validate = () => {
    if (!form.fullName || form.fullName.length < 5) return false;
    if (!form.education) return false;
    if (!form.driveLink || !form.driveLink.includes('drive.google.com')) return false;
    if (!form.nomination) return false;
    if (!form.works.length) return false;
    return true;
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    if (files.length + form.works.length > 10) {
      setError('Max 10 files allowed');
      return;
    }
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/tiff'].includes(file.type)) {
        setError('Only JPEG, PNG, TIFF allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Max 10MB per file');
        return;
      }
    }
    setForm(f => ({ ...f, works: [...f.works, ...files] }));
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    setError('');
  };

  const removeFile = idx => {
    setForm(f => ({ ...f, works: f.works.filter((_, i) => i !== idx) }));
    setPreviews(p => p.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleDrop = e => {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProgress(0);
    try {
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('education', form.education);
      data.append('driveLink', form.driveLink);
      data.append('nomination', form.nomination);
      form.works.forEach(f => data.append('works', f));
      const res = await api.post('/api/submissions', data, {
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100))
      });
      setSuccess(true);
      setStatus(res.data.status);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-green-500 text-6xl mb-4">✔</div>
        <div className="text-xl font-semibold mb-2">Application Submitted</div>
        <span className="inline-block px-4 py-1 rounded-full bg-gray-200 uppercase tracking-widest text-xs font-bold">
          {status === 'pending' ? 'Pending Review' : status}
        </span>
      </div>
    );
  }

  return (
    <form
      className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 flex flex-col gap-6"
      onSubmit={handleSubmit}
      style={{ background: '#f8f9fa' }}
    >
      <div className="text-2xl font-bold tracking-widest text-center mb-2">SUBMISSION</div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-lg focus:outline-none focus:border-black"
            minLength={5}
            required
            autoComplete="off"
            placeholder=" "
          />
          <label className="absolute left-0 top-2 text-xs uppercase tracking-widest text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-black">
            FULL NAME
          </label>
        </div>
        <div className="relative">
          <input
            name="education"
            value={form.education}
            onChange={handleChange}
            className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-lg focus:outline-none focus:border-black"
            required
            autoComplete="off"
            placeholder=" "
          />
          <label className="absolute left-0 top-2 text-xs uppercase tracking-widest text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-black">
            EDUCATION
          </label>
        </div>
        <div className="relative">
          <input
            name="driveLink"
            value={form.driveLink}
            onChange={handleChange}
            className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-lg focus:outline-none focus:border-black"
            required
            autoComplete="off"
            placeholder=" "
          />
          <label className="absolute left-0 top-2 text-xs uppercase tracking-widest text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-black">
            GOOGLE DRIVE LINK
          </label>
        </div>
        <div className="relative">
        <select
        name="nomination"
        value={form.nomination}
        onChange={handleChange}
        required
        className="
            peer w-full
            border-b border-gray-300
            bg-transparent
            pt-6 pb-2
            text-lg
            leading-[1.25]
            h-[44px]
            focus:outline-none
            focus:border-black
            appearance-none
        "
        >
            <option value="" hidden></option>
            {nominations?.map(n => (
            <option key={n._id} value={n.slug}>
                {n.title}
            </option>
            ))}
        </select>

        <label
        className="
            absolute left-0
            text-xs uppercase tracking-widest
            text-gray-400
            transition-all duration-200
            top-3
            peer-focus:top-3
            peer-focus:text-xs
            peer-focus:text-black
        "
        >
        NOMINATION
        </label>

        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">
        </div>
        </div>
        <div
          className="border border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current.click()}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/tiff"
            multiple
            hidden
            ref={inputRef}
            onChange={handleFileChange}
          />
          <div className="uppercase text-xs tracking-widest mb-2">Drag & Drop or Click to Upload</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt="" className="w-20 h-20 object-cover rounded shadow" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
                  onClick={e => { e.stopPropagation(); removeFile(i); }}
                >✕</button>
              </div>
            ))}
          </div>
        </div>
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-full bg-black text-white font-bold tracking-widest uppercase mt-4 disabled:opacity-50"
        disabled={!validate() || loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
