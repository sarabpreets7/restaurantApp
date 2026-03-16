import React, { PropsWithChildren, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '../lib/api';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    const bootstrap = async () => {
      const existing = localStorage.getItem('customerToken');
      if (existing) {
        api.defaults.headers.common['authorization'] = `Bearer ${existing}`;
        return;
      }
      try {
        const res = await api.post<{ token: string }>('/auth/customer', {
          name: 'guest',
          phone: '000'
        });
        localStorage.setItem('customerToken', res.data.token);
        api.defaults.headers.common['authorization'] = `Bearer ${res.data.token}`;
      } catch {
        // ignore; app still works with public GETs
      }
    };
    bootstrap();
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
