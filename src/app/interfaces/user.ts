export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  type?: string;
}
