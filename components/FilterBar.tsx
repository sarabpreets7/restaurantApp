import React from 'react';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  dietary: string;
  onDietary: (value: string) => void;
  minPrice: number;
  maxPrice: number;
  onPrice: (min: number, max: number) => void;
  searchAria?: string;
}

const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];
const diets = ['vegetarian', 'vegan', 'gluten-free'];

export const FilterBar: React.FC<Props> = ({
  search,
  onSearch,
  category,
  onCategory,
  dietary,
  onDietary,
  minPrice,
  maxPrice,
  onPrice,
  searchAria
}) => {
  return (
    <div className="glass" style={{ padding: 16, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          aria-label={searchAria ?? 'Search'}
          placeholder="Search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 12, border: '1px solid var(--border)' }}
        />
        <div className="select-wrap">
          <select aria-label="Filter by category" value={category} onChange={(e) => onCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="chevron">▾</span>
        </div>
        <div className="select-wrap">
          <select aria-label="Filter by dietary preference" value={dietary} onChange={(e) => onDietary(e.target.value)}>
            <option value="">Any diet</option>
            {diets.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span className="chevron">▾</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)' }}>Quick filters:</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(category === c ? '' : c)}
            aria-pressed={category === c}
            aria-label={`Filter by ${c}`}
            style={{
              border: '1px solid var(--border)',
              padding: '6px 10px',
              borderRadius: 12,
              background: category === c ? 'var(--accent)' : 'transparent',
              color: category === c ? '#0b0c10' : 'var(--text)'
            }}
          >
            {c}
          </button>
        ))}
        {diets.map((d) => (
          <button
            key={d}
            onClick={() => onDietary(dietary === d ? '' : d)}
            aria-pressed={dietary === d}
            aria-label={`Filter by ${d}`}
            style={{
              border: '1px solid var(--border)',
              padding: '6px 10px',
              borderRadius: 12,
              background: dietary === d ? 'var(--accent)' : 'transparent',
              color: dietary === d ? '#0b0c10' : 'var(--text)'
            }}
          >
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)' }}>Price</span>
        <input
          type="number"
          min={0}
          value={minPrice}
          aria-label="Minimum price"
          onChange={(e) => onPrice(Number(e.target.value || 0), maxPrice)}
          style={{ width: 90, padding: 8 }}
        />
        <span>to</span>
        <input
          type="number"
          min={0}
          value={maxPrice}
          aria-label="Maximum price"
          onChange={(e) => onPrice(minPrice, Number(e.target.value || 0))}
          style={{ width: 90, padding: 8 }}
        />
        <input
          type="range"
          min={0}
          max={50}
          value={maxPrice || 50}
          aria-label="Price slider"
          onChange={(e) => onPrice(minPrice, Number(e.target.value))}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
};
