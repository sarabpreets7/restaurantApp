import React from 'react';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  dietary: string;
  onDietary: (value: string) => void;
}

const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];
const diets = ['vegetarian', 'vegan', 'gluten-free'];

export const FilterBar: React.FC<Props> = ({
  search,
  onSearch,
  category,
  onCategory,
  dietary,
  onDietary
}) => {
  return (
    <div className="glass" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <input
        placeholder="Search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        style={{ flex: 1, padding: 10, borderRadius: 12, border: '1px solid var(--border)' }}
      />
      <select value={category} onChange={(e) => onCategory(e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={dietary} onChange={(e) => onDietary(e.target.value)}>
        <option value="">Any diet</option>
        {diets.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
};
