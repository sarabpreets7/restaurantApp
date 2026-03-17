import React from 'react';
import { render } from '@testing-library/react';
import CartPage from '../app/cart/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() })
}));

jest.mock('../lib/api', () => {
  const actual = jest.requireActual('../lib/api');
  return {
    ...actual,
    api: {
      post: jest.fn().mockResolvedValue({ data: { token: 'mock-token' } }),
      defaults: { headers: { common: {} } }
    }
  };
});

describe('CartPage', () => {
  it('renders empty cart state', () => {
    const { getByText } = render(<CartPage />);
    expect(getByText(/Your cart is empty/i)).toBeInTheDocument();
  });
});
