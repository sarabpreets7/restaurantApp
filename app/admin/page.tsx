"use client";

import React from 'react';
import { Providers } from '../providers';
import { AdminOrders } from '../../components/AdminOrders';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function AdminPage() {
  const params = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = params.get('token');
  const required = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
  const [token, setToken] = React.useState<string>(
    () => (typeof window !== 'undefined' && localStorage.getItem('adminToken')) || tokenFromUrl || ''
  );
  const [error, setError] = React.useState<string>('');
  React.useEffect(() => {
    if (tokenFromUrl) {
      if (required && tokenFromUrl !== required) {
        setError('Invalid token');
        localStorage.removeItem('adminToken');
        api.defaults.headers.common['x-admin-token'] = '';
      } else {
        localStorage.setItem('adminToken', tokenFromUrl);
        api.defaults.headers.common['x-admin-token'] = tokenFromUrl;
        setToken(tokenFromUrl);
      }
      router.replace('/admin');
    }
  }, [tokenFromUrl, router, required]);

  React.useEffect(() => {
    if (required && token === required) {
      api.defaults.headers.common['x-admin-token'] = token;
      setError('');
    } else {
      api.defaults.headers.common['x-admin-token'] = '';
      localStorage.removeItem('adminToken');
    }
  }, [token, required]);

  if (required && token !== required) {
    return (
      <div style={{ maxWidth: 420, margin: '80px auto' }}>
        <h2>Admin access</h2>
        <p style={{ color: 'var(--muted)' }}>Enter the admin token to view orders.</p>
        {error && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }}
        />
        <button
          onClick={() => {
            if (required && token !== required) {
              setError('Invalid token');
              localStorage.removeItem('adminToken');
              return;
            }
            setError('');
            localStorage.setItem('adminToken', token);
            api.defaults.headers.common['x-admin-token'] = token;
            router.refresh();
          }}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(90deg, #07c8f9, #00c2a8)',
            color: '#0b0c10',
            fontWeight: 800
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <Providers>
      <AdminOrders />
    </Providers>
  );
}
