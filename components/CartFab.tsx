"use client";

import React from 'react';
import { useCart } from '../state/cart';
import { useRouter } from 'next/navigation';
import { formatINR } from '../lib/money';

export const CartFab: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const lines = useCart((s) => s.lines);
  const total = useCart((s) => s.total());
  const expired = useCart((s) => s.expired);

  React.useEffect(() => setMounted(true), []);
  if (!mounted || (!lines.length && !expired)) return null;

  const count = lines.reduce((acc, l) => acc + l.quantity, 0);
  return (
    <button
      onClick={() => router.push('/cart')}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '14px 20px',
        borderRadius: 999,
        border: 'none',
        background: 'linear-gradient(90deg, #06c167, #0bd17d)',
        color: '#0b0c10',
        fontWeight: 800,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 50
      }}
    >
      {expired ? 'Cart expired — review items' : `View cart • ${count} item${count > 1 ? 's' : ''} • ${formatINR(total)}`}
    </button>
  );
};
