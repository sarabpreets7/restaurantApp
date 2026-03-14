import React from 'react';
import { MenuItem } from '../lib/api';
import { useCart } from '../state/cart';
import clsx from 'clsx';

interface Props {
  items: MenuItem[];
}

export const MenuGrid: React.FC<Props> = ({ items }) => {
  const add = useCart((s) => s.add);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
        marginTop: 16
      }}
    >
      {items.map((item) => (
        <div key={item.id} className="glass" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{item.name}</div>
          <div style={{ color: 'var(--muted)', margin: '6px 0' }}>{item.description}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>${item.price.toFixed(2)}</span>
            <span>{item.prepMinutes} min</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {item.dietary.map((d) => (
              <span
                key={d}
                style={{
                  border: '1px solid var(--border)',
                  padding: '4px 8px',
                  borderRadius: 12,
                  fontSize: 12
                }}
              >
                {d}
              </span>
            ))}
          </div>
          <button
            disabled={!item.available || item.stock <= 0}
            onClick={() =>
              add({
                menuItem: item,
                quantity: 1,
                addOnIds: [],
                specialInstructions: ''
              })
            }
            className={clsx('glass')}
            style={{
              border: '1px solid var(--border)',
              padding: '10px 12px',
              width: '100%',
              background: 'linear-gradient(90deg, #f4b400, #ffcf66)',
              color: '#0b0c10',
              fontWeight: 700
            }}
          >
            {item.available ? 'Add to cart' : 'Unavailable'}
          </button>
        </div>
      ))}
    </div>
  );
};
