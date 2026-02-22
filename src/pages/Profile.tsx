import { useEffect, useState } from 'react';
import api from '../services/api';

type Tab = 'profile' | 'applications' | 'diplomas';

export default function Profile() {
  const [tab, setTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [diplomas, setDiplomas] = useState<any[]>([]);
  const [appForm, setAppForm] = useState({ fullName: '', education: '', photos: [], driveLink: '', modelParams: '', category: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/api/auth/me').then(res => {
      setUser(res.data);
      setForm(res.data);
    });
    api.get('/api/applications/my').then(res => setApps(res.data));
    api.get('/api/diplomas/my').then(res => setDiplomas(res.data));
  }, []);

  const handleProfileSave = async () => {
    setError(''); setSuccess('');
    try {
      const res = await api.put('/api/auth/me', form);
      setUser(res.data); setSuccess('Profile updated');
      setEdit(false);
    } catch (err: any) { setError(err.response?.data?.error || 'Update failed'); }
  };

  const handlePasswordChange = async () => {
    setError(''); setSuccess('');
    try {
      await api.put('/api/auth/change-password', passwordForm);
      setSuccess('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) { setError(err.response?.data?.error || 'Password change failed'); }
  };

  const handleAppSubmit = async () => {
    setError(''); setSuccess('');
    try {
      await api.post('/api/applications', appForm);
      setSuccess('Application submitted');
      api.get('/api/applications/my').then(res => setApps(res.data));
    } catch (err: any) { setError(err.response?.data?.error || 'Application failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('profile')} className={tab === 'profile' ? 'font-bold' : ''}>Profile</button>
        <button onClick={() => setTab('applications')} className={tab === 'applications' ? 'font-bold' : ''}>Applications</button>
        <button onClick={() => setTab('diplomas')} className={tab === 'diplomas' ? 'font-bold' : ''}>Diplomas</button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {tab === 'profile' && user && (
        <div>
          <img src={form?.avatar || '/default-avatar.png'} alt="avatar" className="w-24 h-24 rounded mb-4" />
          <input value={form?.avatar || ''} onChange={e => setForm((prev: any) => ({ ...prev, avatar: e.target.value }))} placeholder="Avatar URL" className="mb-2 w-full border rounded px-2 py-1" disabled={!edit} />
          <input value={form?.firstName || ''} onChange={e => setForm((prev: any) => ({ ...prev, firstName: e.target.value }))} placeholder="First Name" className="mb-2 w-full border rounded px-2 py-1" disabled={!edit} />
          <input value={form?.lastName || ''} onChange={e => setForm((prev: any) => ({ ...prev, lastName: e.target.value }))} placeholder="Last Name" className="mb-2 w-full border rounded px-2 py-1" disabled={!edit} />
          <input value={form?.age || ''} onChange={e => setForm((prev: any) => ({ ...prev, age: Number(e.target.value) }))} placeholder="Age" className="mb-2 w-full border rounded px-2 py-1" type="number" disabled={!edit} />
          <input value={form?.city || ''} onChange={e => setForm((prev: any) => ({ ...prev, city: e.target.value }))} placeholder="City" className="mb-2 w-full border rounded px-2 py-1" disabled={!edit} />
          <input value={form?.phone || ''} onChange={e => setForm((prev: any) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="mb-2 w-full border rounded px-2 py-1" disabled={!edit} />
          <input value={form?.email || ''} readOnly className="mb-2 w-full border rounded px-2 py-1 bg-gray-100" placeholder="Email" />
          <button className="border px-4 py-2 rounded mb-4" onClick={() => edit ? handleProfileSave() : setEdit(true)}>{edit ? 'Save' : 'Edit'}</button>
          <div className="mt-6">
            <h3 className="font-bold mb-2">Change Password</h3>
            <input value={passwordForm.currentPassword} onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} placeholder="Current Password" className="mb-2 w-full border rounded px-2 py-1" type="password" />
            <input value={passwordForm.newPassword} onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="New Password" className="mb-2 w-full border rounded px-2 py-1" type="password" />
            <button className="border px-4 py-2 rounded" onClick={handlePasswordChange}>Change Password</button>
          </div>
        </div>
      )}
      {tab === 'applications' && (
        <div>
          <h3 className="font-bold mb-2">Submit Application</h3>
          <input value={appForm.fullName} onChange={e => setAppForm(prev => ({ ...prev, fullName: e.target.value }))} placeholder="Full Name" className="mb-2 w-full border rounded px-2 py-1" />
          <input value={appForm.education} onChange={e => setAppForm(prev => ({ ...prev, education: e.target.value }))} placeholder="Education" className="mb-2 w-full border rounded px-2 py-1" />
          <input value={appForm.driveLink} onChange={e => setAppForm(prev => ({ ...prev, driveLink: e.target.value }))} placeholder="Google Drive Link" className="mb-2 w-full border rounded px-2 py-1" />
          <input value={appForm.modelParams} onChange={e => setAppForm(prev => ({ ...prev, modelParams: e.target.value }))} placeholder="Model Parameters" className="mb-2 w-full border rounded px-2 py-1" />
          <input value={appForm.category} onChange={e => setAppForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="mb-2 w-full border rounded px-2 py-1" />
          <input value={appForm.photos.join(',')} onChange={e => setAppForm(prev => ({ ...prev, photos: e.target.value.split(',') }))} placeholder="Photos (comma separated URLs)" className="mb-2 w-full border rounded px-2 py-1" />
          <button className="border px-4 py-2 rounded mb-4" onClick={handleAppSubmit}>Submit</button>
          <h3 className="font-bold mt-6 mb-2">My Applications</h3>
          <div>
            <b>Active:</b>
            {apps.filter(a => a.status === 'approved').map(a => <div key={a._id}>{a.fullName} ({a.category})</div>)}
            <b>Pending:</b>
            {apps.filter(a => a.status === 'pending').map(a => <div key={a._id}>{a.fullName} ({a.category})</div>)}
            <b>Rejected:</b>
            {apps.filter(a => a.status === 'rejected').map(a => <div key={a._id}>{a.fullName} ({a.category})</div>)}
          </div>
        </div>
      )}
      {tab === 'diplomas' && (
        <div>
          <h3 className="font-bold mb-2">My Diplomas</h3>
          {diplomas.map(d => (
            <div key={d._id} className="mb-2">
              <b>{d.title}</b> ({new Date(d.issueDate).toLocaleDateString()}) <a href={d.fileUrl} target="_blank" rel="noopener noreferrer">Download</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
