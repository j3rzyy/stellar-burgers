import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

// INGREDIENTS

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

type TIngredientsState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialIngredientsState: TIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Ошибка';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

// CONSTRUCTOR

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: any | null;
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientsIds: string[]) => {
    const data = await orderBurgerApi(ingredientsIds);
    return data.order;
  }
);
const initialConstructorState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },

    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      if (i === 0) return;

      const arr = state.constructorItems.ingredients;
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      const arr = state.constructorItems.ingredients;

      if (i === arr.length - 1) return;

      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    },

    resetOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const constructorReducer = constructorSlice.reducer;

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetOrder
} = constructorSlice.actions;

// AUTH

type TUser = {
  email: string;
  name: string;
};

type TAuthState = {
  user: TUser | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

const initialAuthState: TAuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }) => {
    const res = await registerUserApi(data);

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password?: string }) => {
    const res = await updateUserApi(data);

    if (res?.success) {
      return res.user;
    }

    return Promise.reject(res);
  }
);

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const res = await getUserApi();

  if (res?.success) {
    return res.user;
  }

  return Promise.reject(res);
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();

  deleteCookie('accessToken');

  localStorage.removeItem('refreshToken');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setInitialized: (state) => {
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    // register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      });

    // login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      });

    // update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка обновления';
      });

    // get user
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })

      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.initialized = true;
      });

    // logout user

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.initialized = true;
    });
  }
});

export const authReducer = authSlice.reducer;
export const { setInitialized } = authSlice.actions;

// FEED
export const fetchOrders = createAsyncThunk('feed/fetchOrders', async () => {
  const data = await getFeedsApi();

  if (data?.success) return data;
  return Promise.reject(data);
});

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;

        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка';
      });
  }
});

export const feedReducer = feedSlice.reducer;

// ORDERS

export const fetchUserOrders = createAsyncThunk(
  'profileOrders/fetch',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

type TProfileOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialOrderState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState: initialOrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка';
      });
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
