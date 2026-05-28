import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';

describe('Редьюсер ingredients', () => {
  const initialState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 40,
      price: 100,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      __v: 0
    }
  ];

  test('pending включает загрузку ингредиентов и очищает ошибку', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled сохраняет полученные ингредиенты в store', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('rejected сохраняет ошибку при неудачной загрузке ингредиентов', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {
        message: 'Rejected'
      }
    };

    const state = ingredientsReducer(initialState, action);

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe('Rejected');
  });
});
