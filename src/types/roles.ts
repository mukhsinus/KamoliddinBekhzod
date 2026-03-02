export type UserRole = 'participant' | 'jury' | 'admin';

export const isAdmin = (role?: string): role is 'admin' =>
  role === 'admin';

export const isJury = (role?: string): role is 'jury' =>
  role === 'jury';

export const isParticipant = (role?: string): role is 'participant' =>
  role === 'participant';