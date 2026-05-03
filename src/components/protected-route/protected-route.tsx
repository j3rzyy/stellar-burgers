import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const { user, initialized, loading } = useSelector((s) => s.auth);

  if (!initialized || loading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }

  return children;
};
