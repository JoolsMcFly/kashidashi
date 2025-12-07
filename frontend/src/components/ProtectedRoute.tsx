import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  inventoryOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, inventoryOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isInventoryUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if ((adminOnly && !isAdmin) || (inventoryOnly && !isInventoryUser)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
