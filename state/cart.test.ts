import { act } from '@testing-library/react';
import { useCart } from './cart';

describe('cart store', () => {
  beforeEach(() => {
    useCart.setState({ lines: [] });
  });

  it('calculates total with add-ons', () => {
    const item = {
      id: '1',
      name: 'Test',
      description: '',
      category: 'Main',
      price: 10,
      dietary: [],
      imageUrl: '',
      prepMinutes: 0,
      available: true,
      stock: 10,
      addOns: [{ id: 'a', label: 'Extra', price: 2 }]
    };
    act(() => {
      useCart.getState().add({ menuItem: item, quantity: 2, addOnIds: ['a'] });
    });
    expect(useCart.getState().total()).toBe(24);
  });
});
