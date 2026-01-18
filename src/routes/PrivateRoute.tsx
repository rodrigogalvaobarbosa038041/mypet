import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}

export function PrivateRoute({ element }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
}
