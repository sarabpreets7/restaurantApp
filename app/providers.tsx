import React, { PropsWithChildren, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '../lib/api';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      // Do not override admin Authorization header with customer token
      return;
    }
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

    const handleRoute = () => {
      if (window.location.pathname.startsWith('/admin')) {
        // clear customer auth when entering admin to avoid leaking
        delete api.defaults.headers.common['authorization'];
      } else {
        const existing = localStorage.getItem('customerToken');
        if (existing) {
          api.defaults.headers.common['authorization'] = `Bearer ${existing}`;
        }
      }
    };
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('pushstate', handleRoute as any);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('pushstate', handleRoute as any);
    };
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
