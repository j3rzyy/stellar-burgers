import {rootReducer} from './store';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      },
      auth: {
        user: null,
        loading: false,
        initialized: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        loading: false,
        error: null
      },
      order: {
        currentOrder: null,
        loading: false,
        error: null
      }
    });
  });
});
