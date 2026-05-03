import { fetchUserOrders } from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.profileOrders);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, orders.length]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
