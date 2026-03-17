import React from 'react';
import { MenuItem } from '../lib/api';
import { useCart } from '../state/cart';
import clsx from 'clsx';
import { formatINR } from '../lib/money';
import { useVirtualizer } from '@tanstack/react-virtual';

const imageMap: Record<string, string> = {
  'Truffle Fries':
    'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80',
  'Crispy Calamari':
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
  'Smoked Tofu Bowl':
    'https://images.unsplash.com/photo-1522184216315-dc618e9fbb52?auto=format&fit=crop&w=600&q=80',
  'Ribeye Steak':
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=600&q=80',
  'Molten Chocolate Cake':
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  'Cold Brew':
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
  'Burrata Plate':
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  'Margherita Pizza':
    'https://images.unsplash.com/photo-1548365328-8c6db3220c8e?auto=format&fit=crop&w=600&q=80',
  'Grilled Salmon':
    'https://images.unsplash.com/photo-1514516345957-556ca7d90aaf?auto=format&fit=crop&w=600&q=80',
  'Mushroom Risotto':
    'https://images.unsplash.com/photo-1612874472278-5c1ef021b6b9?auto=format&fit=crop&w=600&q=80',
  'Paneer Tikka Wrap':
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
  'Mango Panna Cotta':
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  'Tiramisu Jar':
    'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=80',
  'Hibiscus Iced Tea':
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  'Matcha Latte':
    'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&w=600&q=80'
};

interface Props {
  items: MenuItem[];
}

export const MenuGrid: React.FC<Props> = ({ items }) => {
  const add = useCart((s) => s.add);
  const [selected, setSelected] = React.useState<MenuItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);
  const [size, setSize] = React.useState<'Regular' | 'Large'>('Regular');
  const [notes, setNotes] = React.useState('');
  const scrollParentRef = React.useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = React.useState(1);

  React.useEffect(() => {
    const el = scrollParentRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const colCount = Math.max(1, Math.floor(width / 260));
      setColumns(colCount);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rowCount = Math.ceil(items.length / columns);
  const rowVirtualizer = useVirtualizer({
    count: rowCount || 1,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 360,
    overscan: 5
  });

  const resetSelections = () => {
    setSelectedAddOns([]);
    setSize('Regular');
    setNotes('');
  };
  const renderCard = (item: MenuItem) => (
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
      <img
        src={
          item.imageUrl && item.imageUrl.startsWith('http')
            ? item.imageUrl
            : imageMap[item.name] ?? '/placeholder.png'
        }
        alt={item.name}
        loading="lazy"
        style={{
          height: 120,
          width: '100%',
          objectFit: 'cover',
          borderRadius: 12,
          marginBottom: 10,
          background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)'
        }}
      />
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
  );

  return (
    <>
      <div
        ref={scrollParentRef}
        style={{
          height: '75vh',
          overflow: 'auto',
          marginTop: 16,
          position: 'relative'
        }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const startIndex = virtualRow.index * columns;
            const rowItems = items.slice(startIndex, startIndex + columns);
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: virtualRow.start,
                  left: 0,
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(240px, 1fr))`,
                  gap: 16,
                  paddingRight: 8
                }}
              >
                {rowItems.map(renderCard)}
              </div>
            );
          })}
          {!items.length && (
            <div style={{ padding: 16, color: 'var(--muted)' }}>No items found.</div>
          )}
        </div>
      </div>

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
                aria-label="Close item modal"
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
                {(['Regular', 'Large'] as const).map((s) => {
                  const multiplier = s === 'Regular' ? 1 : 1.25;
                  return (
                    <label key={s} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="radio"
                        name="size"
                        value={s}
                        checked={size === s}
                        onChange={() => setSize(s)}
                      />
                      {s} ({formatINR(selected.price * multiplier)})
                    </label>
                  );
                })}
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
                      {a.label} (+{formatINR(a.price)}) — {size === 'Large' ? 'applies to large too' : 'regular size'}
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
    </>
  );
};
