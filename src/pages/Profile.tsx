import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import ProfileApplicationForm from './ProfileApplicationForm';

type Tab = 'profile' | 'applications' | 'diplomas';

export default function Profile() {
  const [tab, setTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [diplomas, setDiplomas] = useState<any[]>([]);
  const [appForm, setAppForm] = useState({ fullName: '', education: '', photos: [], driveLink: '', modelParams: '', category: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [edit, setEdit] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/api/auth/me').then(res => {
      setUser(res.data);
      setForm(res.data);
      setAvatarPreview(res.data.avatar || '/default-avatar.png');
    });
    api.get('/api/applications/my').then(res => setApps(res.data));
    api.get('/api/diplomas/my').then(res => setDiplomas(res.data));
  }, []);

  const handleProfileSave = async () => {
    setError(''); setSuccess('');
    try {
      setUploading(true);
      let updatedUser = null;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const res = await api.put('/api/auth/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedUser = res.data;
        setAvatarFile(null);
        setAvatarPreview(res.data.avatar);
      }
      // Update other fields if changed
      const res2 = await api.put('/api/auth/me', { ...form, avatar: updatedUser ? updatedUser.avatar : form.avatar });
      setUser(res2.data); setForm(res2.data); setSuccess('Profile updated'); setEdit(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    setError(''); setSuccess('');
    if (!passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setError('New password fields required'); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setError('New passwords do not match'); return;
    }
    try {
      await api.put('/api/auth/change-password', passwordForm);
      setSuccess('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
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
          <div className="rounded border p-4 mb-6">
            <div className="mb-4 flex flex-col items-center">
              <div className="relative">
                <img
                  src={avatarFile ? (avatarPreview || '/default-avatar.png') : (form?.avatar || '/default-avatar.png')}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border mb-2 cursor-pointer"
                  onClick={() => edit && fileInputRef.current?.click()}
                  style={{ opacity: uploading ? 0.5 : 1 }}
                />
                {edit && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <span className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center text-xs text-white bg-black bg-opacity-50 rounded-full pointer-events-none">Upload</span>
                  </>
                )}
              </div>
              {avatarFile && <div className="text-xs text-muted-foreground mb-2">Previewing new avatar</div>}
            </div>
            <div className="mb-2 font-semibold">Personal Information</div>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
              <input
                className="flex-1 border rounded px-2 py-1 mb-2 sm:mb-0"
                value={form?.firstName || ''}
                disabled={!edit}
                onChange={e => setForm((prev: any) => ({ ...prev, firstName: e.target.value }))}
                placeholder="First Name"
              />
              <input
                className="flex-1 border rounded px-2 py-1 mb-2 sm:mb-0"
                value={form?.lastName || ''}
                disabled={!edit}
                onChange={e => setForm((prev: any) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last Name"
              />
            </div>
            <div className="mb-2 flex flex-col sm:flex-row sm:gap-4">
              <input className="flex-1 border rounded px-2 py-1 mb-2 sm:mb-0" value={form?.age || ''} disabled={!edit} onChange={e => setForm((prev: any) => ({ ...prev, age: Number(e.target.value) }))} placeholder="Age" type="number" />
              <input className="flex-1 border rounded px-2 py-1 mb-2 sm:mb-0" value={form?.city || ''} disabled={!edit} onChange={e => setForm((prev: any) => ({ ...prev, city: e.target.value }))} placeholder="City" />
            </div>
            <div className="mb-2 flex flex-col sm:flex-row sm:gap-4">
              <input className="flex-1 border rounded px-2 py-1 mb-2 sm:mb-0" value={form?.phone || ''} disabled={!edit} onChange={e => setForm((prev: any) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" />
              <input className="flex-1 border rounded px-2 py-1 mb-2 bg-gray-100" value={form?.email || ''} readOnly placeholder="Email (read-only)" />
            </div>
            <button className="border px-4 py-2 rounded mb-4" onClick={() => edit ? handleProfileSave() : setEdit(true)} disabled={uploading}>
              {uploading ? 'Saving...' : (edit ? 'Save' : 'Edit')}
            </button>
          </div>
          <div className="rounded border p-4 mt-6">
            <div className="mb-2 font-semibold">Change Password</div>
            {!showPasswordForm ? (
              <button className="border px-4 py-2 rounded" onClick={() => setShowPasswordForm(true)}>
                Change Password
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <input value={passwordForm.currentPassword} onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} placeholder="Current Password" className="w-full border rounded px-2 py-1" type="password" />
                <input value={passwordForm.newPassword} onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="New Password" className="w-full border rounded px-2 py-1" type="password" />
                <input value={passwordForm.confirmNewPassword} onChange={e => setPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))} placeholder="Confirm New Password" className="w-full border rounded px-2 py-1" type="password" />
                <div className="flex gap-2 mt-2">
                  <button className="border px-4 py-2 rounded" onClick={handlePasswordChange}>Save Password</button>
                  <button className="border px-4 py-2 rounded" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {tab === 'applications' && (
        <ProfileApplicationForm />
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
