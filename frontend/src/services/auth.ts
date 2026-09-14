export type UserRole = 'admin' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse { user: User; token: string; }

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const data = await res.json() as AuthResponse & { error?: string };
  if (!res.ok) throw new Error(data.error || 'Login failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<AuthResponse> => {
  const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, role }) });
  const data = await res.json() as AuthResponse & { error?: string };
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const logout = (): void => { localStorage.removeItem('token'); localStorage.removeItem('user'); };
export const getCurrentUser = (): User | null => { try { const user = localStorage.getItem('user'); return user ? JSON.parse(user) as User : null; } catch { return null; } };
export const isAdmin = (): boolean => getCurrentUser()?.role === 'admin';