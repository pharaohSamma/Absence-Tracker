export interface User {
  id: number;
  firstName: string,
  lastName: string,
  username: string;
  email?: string;
  name?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  type?: string;
}
