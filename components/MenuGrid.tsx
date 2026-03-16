import React from 'react';
import { MenuItem } from '../lib/api';
import { useCart } from '../state/cart';
import clsx from 'clsx';
import { formatINR } from '../lib/money';

interface Props {
  items: MenuItem[];
}

export const MenuGrid: React.FC<Props> = ({ items }) => {
  const add = useCart((s) => s.add);
  const [selected, setSelected] = React.useState<MenuItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);
  const [size, setSize] = React.useState<'Regular' | 'Large'>('Regular');
  const [notes, setNotes] = React.useState('');

  const resetSelections = () => {
    setSelectedAddOns([]);
    setSize('Regular');
    setNotes('');
  };
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
          <div
            style={{ fontWeight: 700, fontSize: 18, cursor: 'pointer' }}
            onClick={() => setSelected(item)}
          >
            {item.name}
          </div>
          <div style={{ color: 'var(--muted)', margin: '6px 0' }}>
            {item.description.slice(0, 80)}
            {item.description.length > 80 ? '…' : ''}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>{formatINR(item.price)}</span>
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
      {selected && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass"
            style={{ padding: 24, maxWidth: 480, width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{selected.name}</h3>
              <button
                onClick={() => {
                  setSelected(null);
                  resetSelections();
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ color: 'var(--muted)' }}>{selected.description}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span>Prep: {selected.prepMinutes} min</span>
              <span>Stock: {selected.stock}</span>
              <span>Availability: {selected.available ? 'Available' : 'Unavailable'}</span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ fontWeight: 600 }}>Size</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['Regular', 'Large'] as const).map((s) => (
                  <label key={s} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      checked={size === s}
                      onChange={() => setSize(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {selected.addOns?.length ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Add-ons</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {selected.addOns.map((a) => (
                    <label key={a.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(a.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedAddOns((prev) =>
                            checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)
                          );
                        }}
                      />
                      {a.label} (+{formatINR(a.price)})
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Special instructions</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}
                placeholder="E.g., extra spicy, no onions"
              />
            </div>
            <button
              disabled={!selected.available || selected.stock <= 0}
              onClick={() => {
                add({
                  menuItem: selected,
                  quantity: 1,
                  addOnIds: selectedAddOns,
                  specialInstructions: `Size: ${size}${notes ? ' | ' + notes : ''}`
                });
                setSelected(null);
                resetSelections();
              }}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(90deg, #f4b400, #ffcf66)',
                color: '#0b0c10',
                fontWeight: 800
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
