"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '../../state/cart';
import { createOrder } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { Providers } from '../providers';
import { formatINR } from '../../lib/money';

const CartPageInner: React.FC = () => {
  const router = useRouter();
  const { lines, updateQuantity, remove, clear, total } = useCart();
  const expired = useCart((s) => s.expired);
  const resetExpiry = useCart((s) => s.resetExpiry);
  const [mounted, setMounted] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', table: '' });
  const [paymentMode, setPaymentMode] = useState<'normal' | 'force-success' | 'force-fail'>(
    'normal'
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const placeOrder = async () => {
    setBusy(true);
    setError('');
    try {
      const order = await createOrder({
        lines: lines.map((l) => ({
          menuItemId: l.menuItem.id,
          quantity: l.quantity,
          addOnIds: l.addOnIds,
          specialInstructions: l.specialInstructions
        })),
        customer,
        mockPaymentIntent: paymentMode === 'normal' ? undefined : paymentMode,
        // send last known prices to allow server-side drift detection
        clientPrices: lines.map((l) => ({
          id: l.menuItem.id,
          price: l.menuItem.price,
          stock: l.menuItem.stock,
          addOns: l.menuItem.addOns ?? []
        }))
      });
      clear();
      router.push(`/track/${order.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to place order';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  if (!lines.length && !expired) {
    return <div style={{ marginTop: 40 }}>Your cart is empty.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
      <h2 style={{ margin: 0 }}>Your cart</h2>
      {expired ? (
        <div style={{ background: '#fff3cd', color: '#6c5300', padding: 12, borderRadius: 10 }}>
          Session expired after 60 minutes of inactivity. Please review and re-submit your order.
          <button
            style={{ marginLeft: 10, padding: '6px 10px', borderRadius: 8, border: 'none', fontWeight: 700 }}
            onClick={() => resetExpiry()}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      {lines.map((line) => (
        <div
          key={line.menuItem.id}
          className="glass"
          style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12 }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{line.menuItem.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              {formatINR(line.menuItem.price)} each
            </div>
            {line.addOnIds?.length ? (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Add-ons:{' '}
                {line.addOnIds
                  .map((id) => line.menuItem.addOns?.find((a) => a.id === id)?.label ?? id)
                  .join(', ')}
              </div>
            ) : null}
            {line.specialInstructions ? (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{line.specialInstructions}</div>
            ) : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => updateQuantity(line.menuItem.id, Math.max(1, line.quantity - 1))}
          aria-label={`Decrease quantity of ${line.menuItem.name}`}
          style={{
            width: 32,
            height: 32,
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                fontWeight: 700
              }}
            >
              −
            </button>
            <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{line.quantity}</span>
        <button
          onClick={() => updateQuantity(line.menuItem.id, line.quantity + 1)}
          aria-label={`Increase quantity of ${line.menuItem.name}`}
          style={{
            width: 32,
            height: 32,
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                fontWeight: 700
              }}
            >
              +
            </button>
          </div>
          <button onClick={() => remove(line.menuItem.id)}>Remove</button>
        </div>
      ))}

      <div className="glass" style={{ padding: 16, display: 'grid', gap: 10 }}>
        <input
          placeholder="Customer name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          style={{ width: '100%', padding: 10 }}
        />
        <input
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          style={{ width: '100%', padding: 10 }}
        />
        <input
          placeholder="Table (optional)"
          value={customer.table}
          onChange={(e) => setCustomer({ ...customer, table: e.target.value })}
          style={{ width: '100%', padding: 10 }}
        />
        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Mock payment</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { value: 'normal', label: 'Normal (random)' },
              { value: 'force-success', label: 'Force success' },
              { value: 'force-fail', label: 'Force fail' }
            ].map((opt) => (
              <label key={opt.value} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMode === opt.value}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Total</span>
          <span>{formatINR(total())}</span>
        </div>
        {error && (
          <div style={{ color: '#ff6b6b', display: 'flex', gap: 8, alignItems: 'center' }}>
            {error}
            {error.toLowerCase().includes('menu changed') ? (
              <button
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)' }}
                onClick={() => window.location.reload()}
              >
                Refresh menu
              </button>
            ) : null}
          </div>
        )}
        <button
          onClick={placeOrder}
          disabled={busy}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(90deg, #06c167, #0bd17d)',
            color: '#0b0c10',
            fontWeight: 800
          }}
        >
          {busy ? 'Placing…' : 'Place order'}
        </button>
      </div>
    </div>
  );
};

export default function CartPage() {
  return (
    <Providers>
      <CartPageInner />
    </Providers>
  );
}
