import { feedReducer, fetchOrders, TFeedState } from './feedSlice';

describe('feed reducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  const mockFeedResponse = {
    success: true,
    orders: [
      {
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
      }
    ],
    total: 100,
    totalToday: 5
  };

  test('pending включает загрузку', () => {
    const state = feedReducer(initialState, fetchOrders.pending('', undefined));

    expect(state.loading).toBe(true);
  });

  test('fulfilled записывает feed данные', () => {
    const state = feedReducer(
      initialState,
      fetchOrders.fulfilled(mockFeedResponse, '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockFeedResponse.orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(5);
  });

  test('rejected сохраняет ошибку', () => {
    const state = feedReducer(
      initialState,
      fetchOrders.rejected(null, '', undefined, 'error')
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Rejected');
  });
});
