// models/user-profile.ts
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  photoUrl?: string;
}