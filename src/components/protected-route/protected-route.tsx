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
  const user = useSelector((s) => s.auth.user);
  const initialized = useSelector((s) => s.auth.initialized);

  if (!initialized) {
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
