import { useAuth } from '@/context/AuthContext';
import ParticipantProfileView from './profile/views/ParticipantProfileView';
import JuryProfileView from './profile/views/JuryProfileView';
import AdminProfileView from './profile/views/AdminProfileView';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'participant':
      return <ParticipantProfileView />;

    case 'jury':
      return <JuryProfileView />;

    case 'admin':
      return <AdminProfileView />;

    default:
      return null;
  }
}