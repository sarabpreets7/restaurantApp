import React, { useState } from 'react';
import { useCart } from '../state/cart';
import { createOrder } from '../lib/api';
import { formatINR } from '../lib/money';

interface Props {
  onOrderCreated: (id: string) => void;
}

export const CartDrawer: React.FC<Props> = ({ onOrderCreated }) => {
  const { lines, updateQuantity, remove, total, clear } = useCart();
  const [customer, setCustomer] = useState({ name: '', phone: '', table: '' });
  const [paymentMode, setPaymentMode] = useState<'normal' | 'force-success' | 'force-fail'>(
    'normal'
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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
        mockPaymentIntent: paymentMode === 'normal' ? undefined : paymentMode
      });
      clear();
      onOrderCreated(order.id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to place order');
    } finally {
      setBusy(false);
    }
  };

  if (!lines.length) {
    return (
      <div className="glass" style={{ padding: 16, marginTop: 20 }}>
        Cart is empty
      </div>
    );
  }

  return (
    <div className="glass" style={{ padding: 16, marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Cart</h3>
        <span>{lines.length} items</span>
      </div>
      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {lines.map((line) => (
          <div
            key={line.menuItem.id}
            style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8 }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{line.menuItem.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                ${line.menuItem.price.toFixed(2)} each
              </div>
            </div>
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateQuantity(line.menuItem.id, Number(e.target.value))}
              style={{ width: 64 }}
            />
            <button onClick={() => remove(line.menuItem.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <input
          placeholder="Customer name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          style={{ width: '100%', padding: 10, marginBottom: 8 }}
        />
        <input
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          style={{ width: '100%', padding: 10, marginBottom: 8 }}
        />
        <input
          placeholder="Table (optional)"
          value={customer.table}
          onChange={(e) => setCustomer({ ...customer, table: e.target.value })}
          style={{ width: '100%', padding: 10 }}
        />
      </div>
      <div style={{ margin: '12px 0' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Mock payment</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { value: 'normal', label: 'Normal (random)' },
            { value: 'force-success', label: 'Force success' },
            { value: 'force-fail', label: 'Force fail' }
          ].map((opt) => (
            <label key={opt.value} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="radio"
                name="paymentMode"
                value={opt.value}
                checked={paymentMode === opt.value}
                onChange={(e) => setPaymentMode(e.target.value as any)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
        <span>Total</span>
        <strong>{formatINR(total())}</strong>
      </div>
      {error && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
      <button
        onClick={placeOrder}
        disabled={busy}
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
        {busy ? 'Submitting...' : 'Place order'}
      </button>
    </div>
  );
};
