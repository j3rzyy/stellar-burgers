import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './constructorSlice';

describe('Редьюсер burgerConstructor (constructorSlice)', () => {
  const ingredient1 = {
    id: '1',
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  };

  const ingredient2 = {
    id: '2',
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    __v: 0
  };

  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null
  };

  test('добавляет ингредиент в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(ingredient1));

    expect(state.constructorItems.ingredients).toEqual([ingredient1]);
  });

  test('удаляет ингредиент из конструктора', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient('1')
    );

    expect(state.constructorItems.ingredients).toEqual([ingredient2]);
  });

  test('перемещает ингредиент вверх', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientUp(1));

    expect(state.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
  });

  test('не перемещает ингредиент вверх, если он первый в списке', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientUp(0));

    expect(state.constructorItems.ingredients).toEqual([
      ingredient1,
      ingredient2
    ]);
  });

  test('перемещает ингредиент вниз', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const state = constructorReducer(
      stateWithIngredients,
      moveIngredientDown(0)
    );

    expect(state.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
  });

  test('не перемещает ингредиент вниз, если он последний в списке', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const state = constructorReducer(
      stateWithIngredients,
      moveIngredientDown(1)
    );

    expect(state.constructorItems.ingredients).toEqual([
      ingredient1,
      ingredient2
    ]);
  });
});
