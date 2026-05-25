import { authReducer } from './slices/authSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { orderReducer } from './slices/orderSlice';
import { profileOrdersReducer } from './slices/profileOrdersSlice';
import { rootReducer } from './store';

describe('rootReducer', () => {
  it('initializes the state correctly', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),

      burgerConstructor: constructorReducer(undefined, initAction),

      auth: authReducer(undefined, initAction),

      feed: feedReducer(undefined, initAction),

      profileOrders: profileOrdersReducer(undefined, initAction),

      order: orderReducer(undefined, initAction)
    });
  });

  it('handles unknown action correctly', () => {
    const fakeAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, fakeAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, fakeAction),

      burgerConstructor: constructorReducer(undefined, fakeAction),

      auth: authReducer(undefined, fakeAction),

      feed: feedReducer(undefined, fakeAction),

      profileOrders: profileOrdersReducer(undefined, fakeAction),

      order: orderReducer(undefined, fakeAction)
    });
  });
});
