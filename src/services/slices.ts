import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => {
    try {
      const data = await getIngredientsApi();
      console.log('API response:', data);
      return data;
    } catch (err) {
      console.error('API ERROR:', err);
      throw err;
    }
  }
);

type TState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialIngredientsState: TState = {
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

// ===================================================================

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: any | null;
};

const initialBurgerConstructorState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialBurgerConstructorState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    clearConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
    }
  }
});

export const constructorReducer = constructorSlice.reducer;
export const { setBun, addIngredient, clearConstructor } =
  constructorSlice.actions;
