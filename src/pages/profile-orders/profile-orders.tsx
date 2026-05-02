import { fetchOrders } from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.feed);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
