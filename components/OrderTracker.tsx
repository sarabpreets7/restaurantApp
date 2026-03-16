import React, { useEffect, useState } from 'react';
import { Order, fetchOrder } from '../lib/api';
import { connectOrderSocket } from '../lib/socket';
import { formatINR } from '../lib/money';

const steps: Order['status'][] = ['received', 'preparing', 'ready', 'completed'];

export const OrderTracker: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder(orderId).then(setOrder);
    const socket = connectOrderSocket(orderId);
    socket.on('order.updated', (o: Order) => setOrder(o));
    return () => socket.disconnect();
  }, [orderId]);

  if (!order) return <div>Loading order...</div>;

  return (
    <div className="glass" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Order #{order.id.slice(0, 6)}</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        {steps.map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: '1px solid var(--border)',
              background:
                order.status === s || steps.indexOf(order.status) > steps.indexOf(s)
                  ? 'linear-gradient(90deg, #f4b400, #ffcf66)'
                  : 'transparent',
              color:
                order.status === s || steps.indexOf(order.status) > steps.indexOf(s)
                  ? '#0b0c10'
                  : 'var(--text)',
              textAlign: 'center'
            }}
          >
            {s.toUpperCase()}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <div>Updated: {new Date(order.updatedAt).toLocaleTimeString()}</div>
        <div>Total: {formatINR(order.total)}</div>
      </div>
    </div>
  );
};
