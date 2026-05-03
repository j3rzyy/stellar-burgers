import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '@slices';
import { getCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
