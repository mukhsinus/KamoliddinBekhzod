// Auth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    nameOrPhone: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await api.post('/api/auth/login', {
          email: form.nameOrPhone,
          password: form.password,
        });
      } else {
        res = await api.post('/api/auth/register', {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.nameOrPhone,
          password: form.password,
        });
      }
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6faff]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-semibold mr-2 ${mode === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setMode('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-semibold ${mode === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setMode('register')}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1 font-medium">{mode === 'login' ? 'Email' : 'Email'}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </span>
              <input
                type={mode === 'login' ? 'text' : 'email'}
                name="nameOrPhone"
                placeholder={mode === 'login' ? 'Email' : 'Email'}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-blue-400"
                value={form.nameOrPhone}
                onChange={handleChange}
                required
              />
            </div>
            {mode === 'login' && <div className="text-xs text-gray-400 mt-1">Password must be at least 6 characters.</div>}
          </div>
          {mode === 'register' && (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:border-blue-400"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22M12 4.5c-4.5 0-8.5 3.5-8.5 7.5s4 7.5 8.5 7.5 8.5-3.5 8.5-7.5-4-7.5-8.5-7.5z"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5c-4.5 0-8.5 3.5-8.5 7.5s4 7.5 8.5 7.5 8.5-3.5 8.5-7.5-4-7.5-8.5-7.5z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span></span>
            {mode === 'login' && <a href="#" className="text-blue-500 text-sm hover:underline">Forgot Password?</a>}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition" disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-8 text-center text-gray-500">
          {mode === 'login' ? (
            <>Don't have an account? <button className="text-blue-500 hover:underline" onClick={() => setMode('register')}>Sign Up</button></>
          ) : (
            <>Already have an account? <button className="text-blue-500 hover:underline" onClick={() => setMode('login')}>Log In</button></>
          )}
        </div>
      </div>
    </div>
  );
}
