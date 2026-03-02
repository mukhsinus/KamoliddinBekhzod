import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileShell from '@/components/profile/ProfileShell';

export default function AdminProfileView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <ProfileShell
      title="Профиль администратора"
      subtitle="Управление конкурсом и пользователями"
      containerWidth="md"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {user.email}
            </p>
          </div>

          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            ADMIN
          </span>
        </div>

        <button
          onClick={() => navigate('/admin')}
          className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:opacity-90 transition"
        >
          Перейти в админ-панель
        </button>

      </div>
    </ProfileShell>
  );
}