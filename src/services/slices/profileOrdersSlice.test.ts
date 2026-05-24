import { profileOrdersReducer, fetchUserOrders } from './profileOrdersSlice';
import { logoutUser } from './authSlice';

describe('profileOrders reducer', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  const mockOrder = [
    {
      _id: '6a12bcfea64177001b336509',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Био-марсианский флюоресцентный бургер',
      createdAt: '2026-05-24T08:55:26.953Z',
      updatedAt: '2026-05-24T08:55:27.019Z',
      number: 105625
    }
  ];

  test('pending включает загрузку', () => {
    const state = profileOrdersReducer(
      initialState,
      fetchUserOrders.pending('', undefined)
    );

    expect(state.loading).toBe(true);
  });

  test('fulfilled записывает заказы', () => {
    const state = profileOrdersReducer(
      initialState,
      fetchUserOrders.fulfilled(mockOrder, '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrder);
  });

  test('rejected сохраняет ошибку', () => {
    const state = profileOrdersReducer(
      initialState,
      fetchUserOrders.rejected(null, '', undefined, 'error')
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Rejected');
  });

  test('logout очищает заказы', () => {
    const stateWithOrders = {
      ...initialState,
      order: mockOrder
    };

    const state = profileOrdersReducer(
      stateWithOrders,
      logoutUser.fulfilled(undefined, '', undefined)
    );

    expect(state.orders).toEqual([]);
  });
});
