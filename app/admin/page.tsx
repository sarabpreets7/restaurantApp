"use client";

import React, { useEffect, useState } from 'react';
import { Providers } from '../providers';
import { AdminOrders } from '../../components/AdminOrders';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import axios from 'axios';

export default function AdminPage() {
  const params = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = params.get('token');
  const [mounted, setMounted] = useState(false);
  const [authToken, setAuthToken] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('adminToken') || '';
  });
  const [inputToken, setInputToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => setMounted(true), []);

  // Apply token from URL once, then clean URL
  useEffect(() => {
    if (tokenFromUrl) {
      localStorage.setItem('adminToken', tokenFromUrl);
      api.defaults.headers.common['authorization'] = `Bearer ${tokenFromUrl}`;
      setAuthToken(tokenFromUrl);
      router.replace('/admin');
    }
  }, [tokenFromUrl, router]);

  // On mount, set axios header if token exists
  useEffect(() => {
    if (authToken) {
      api.defaults.headers.common['authorization'] = `Bearer ${authToken}`;
    } else {
      delete api.defaults.headers.common['authorization'];
    }
  }, [authToken]);

  if (!mounted) return null;

  // If no token, show login form
  if (!authToken) {
    return (
      <div style={{ maxWidth: 420, margin: '80px auto' }}>
        <h2>Admin access</h2>
        <p style={{ color: 'var(--muted)' }}>Enter the admin token to view orders.</p>
        {error && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
        <input
          type="password"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }}
        />
        <button
          onClick={async () => {
            try {
              const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api'}/auth/login`, {
                password: inputToken
              });
              const jwt = res.data.token;
              localStorage.setItem('adminToken', jwt);
              api.defaults.headers.common['authorization'] = `Bearer ${jwt}`;
              setError('');
              setAuthToken(jwt);
              setInputToken('');
              router.refresh();
            } catch (e: any) {
              setError(e?.response?.data?.message ?? 'Invalid token');
              localStorage.removeItem('adminToken');
              delete api.defaults.headers.common['authorization'];
            }
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '12px 0' }}>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            delete api.defaults.headers.common['authorization'];
            setAuthToken('');
            router.refresh();
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'linear-gradient(90deg, #222734, #2f3648)',
            color: '#f7f9fc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}
        >
          Log out
        </button>
      </div>
      <AdminOrders />
    </Providers>
  );
}
