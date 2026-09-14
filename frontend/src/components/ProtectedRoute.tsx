import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, UserRole } from '../services/auth';

interface ProtectedRouteProps { children: ReactNode; role?: UserRole; }

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace />;
  return children;
}