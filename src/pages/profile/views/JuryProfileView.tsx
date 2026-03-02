import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileShell from '@/components/profile/ProfileShell';

export default function JuryProfileView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <ProfileShell
      title="Профиль жюри"
      subtitle="Доступ к оценке конкурсных работ"
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

          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
            JURY
          </span>
        </div>

        <button
          onClick={() => navigate('/jury')}
          className="w-full sm:w-auto px-8 py-3 bg-[#1f2f57] text-white rounded-lg hover:bg-[#2e4379] transition"
        >
          Перейти в панель жюри
        </button>

      </div>
    </ProfileShell>
  );
}