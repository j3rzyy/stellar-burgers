import {
  orderReducer,
  fetchOrderByNumber,
  clearCurrentOrder
} from './orderSlice';

describe('Редьюсер order', () => {
  const initialState = {
    currentOrder: null,
    loading: false,
    error: null
  };

  const mockOrder = {
    _id: '6a133f41a64177001b3366a0',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2026-05-24T18:11:13.311Z',
    updatedAt: '2026-05-24T18:11:13.409Z',
    number: 105692
  };

  test('pending включает загрузку и очищает данные заказа', () => {
    const state = orderReducer(
      initialState,
      fetchOrderByNumber.pending('', 105692)
    );

    expect(state.loading).toBe(true);
    expect(state.currentOrder).toBeNull();
    expect(state.error).toBeNull();
  });

  test('fulfilled сохраняет полученный заказ в store', () => {
    const state = orderReducer(
      initialState,
      fetchOrderByNumber.fulfilled(mockOrder, '', 105692)
    );

    expect(state.loading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  test('rejected сохраняет ошибку при неудачной загрузке заказа', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: {
        message: 'Rejected'
      }
    };

    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Rejected');
  });

  test('clearCurrentOrder очищает текущий заказ', () => {
    const stateWithOrder = {
      ...initialState,
      currentOrder: mockOrder
    };

    const state = orderReducer(stateWithOrder, clearCurrentOrder());

    expect(state.currentOrder).toBeNull();
  });
});
