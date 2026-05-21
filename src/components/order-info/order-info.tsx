import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  clearCurrentOrder,
  fetchOrderByNumber
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const { orders: feedOrders } = useSelector((state) => state.feed);
  const { orders: profileOrders } = useSelector((state) => state.profileOrders);
  const { currentOrder, loading } = useSelector((state) => state.order);
  const { ingredients } = useSelector((state) => state.ingredients);

  const orderFromStore = [...feedOrders, ...profileOrders].find(
    (item) => item.number === Number(number)
  );

  const orderData = orderFromStore || currentOrder;

  useEffect(() => {
    if (!orderFromStore && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
