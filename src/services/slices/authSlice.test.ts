import { authReducer, setInitialized } from './authSlice';
import { registerUser, loginUser, getUser, logoutUser } from './authSlice';

describe('auth reducer', () => {
  const initialState = {
    user: null,
    loading: false,
    initialized: false,
    error: null
  };

  const mockUser = {
    email: 'test@mail.com',
    name: 'Test User'
  };

  test('register устанавливает состояние загрузки', () => {
    const state = authReducer(
      initialState,
      registerUser.pending('', { email: '', password: '', name: '' })
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('register сохраняет данные пользователя после успешной регистрации', () => {
    const state = authReducer(
      initialState,
      registerUser.fulfilled(mockUser, '', {
        email: '',
        password: '',
        name: ''
      })
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  test('login fulfilled сохраняет данные пользователя после успешного входа', () => {
    const state = authReducer(
      initialState,
      loginUser.fulfilled(mockUser, '', {
        email: '',
        password: ''
      })
    );

    expect(state.user).toEqual(mockUser);
  });

  test('getUser fulfilled сохраняет пользователя и устанавливает initialized', () => {
    const state = authReducer(
      initialState,
      getUser.fulfilled(mockUser, '', undefined)
    );

    expect(state.user).toEqual(mockUser);
    expect(state.initialized).toBe(true);
  });

  test('getUser rejected при ошибке очищает пользователя и устанавливает initialized', () => {
    const state = authReducer(
      { ...initialState, user: mockUser },
      getUser.rejected(null, '', undefined)
    );

    expect(state.user).toBeNull();
    expect(state.initialized).toBe(true);
  });

  test('logout очищает user', () => {
    const state = authReducer(
      { ...initialState, user: mockUser },
      logoutUser.fulfilled(undefined, '', undefined)
    );

    expect(state.user).toBeNull();
  });

  test('setInitialized устанавливает флаг initialized', () => {
    const state = authReducer(initialState, setInitialized());

    expect(state.initialized).toBe(true);
  });
});
