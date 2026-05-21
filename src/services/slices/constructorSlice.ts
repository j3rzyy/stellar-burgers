import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrder } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { logoutUser } from './authSlice';

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientsIds: string[]) => {
    const data = await orderBurgerApi(ingredientsIds);
    return data.order;
  }
);

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
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
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.constructorItems = { bun: null, ingredients: [] };
        state.orderRequest = false;
        state.orderModalData = null;
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
