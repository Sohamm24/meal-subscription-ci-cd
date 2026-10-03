import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}