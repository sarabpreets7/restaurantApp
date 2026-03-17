import React from 'react';
import { render } from '@testing-library/react';
import AdminPage from '../app/admin/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => ({ get: () => null })
}));

jest.mock('../lib/api', () => {
  const actual = jest.requireActual('../lib/api');
  return {
    ...actual,
    api: {
      post: jest.fn().mockResolvedValue({ data: { token: 'mock-admin' } }),
      defaults: { headers: { common: {} } }
    }
  };
});

describe('AdminPage', () => {
  it('shows login form when no token', () => {
    const { getByText, getByRole } = render(<AdminPage />);
    expect(getByText(/Admin access/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });
});
