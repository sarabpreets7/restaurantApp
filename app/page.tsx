"use client";

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../lib/api';
import { Providers } from './providers';
import { FilterBar } from '../components/FilterBar';
import { MenuGrid } from '../components/MenuGrid';
import { useRouter } from 'next/navigation';
import { CartFab } from '../components/CartFab';

const CustomerPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [dietary, setDietary] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50);

  const { data: menu } = useQuery({
    queryKey: ['menu', { search, category, dietary, minPrice, maxPrice }],
    queryFn: () => fetchMenu({ search, category, dietary, minPrice, maxPrice })
  });

  const filtered = useMemo(() => {
    if (!menu) return [];
    return menu.filter((m) => {
      const matchesSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || m.category === category;
      const matchesDiet = !dietary || m.dietary.includes(dietary);
      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [menu, search, category, dietary]);

  return (
    <>
      <h1 style={{ margin: '0 0 8px 0' }}>Realtime Restaurant</h1>
      <p style={{ marginTop: 0, color: 'var(--muted)' }}>
        Browse the menu, customize, and track your order live.
      </p>
      <FilterBar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        dietary={dietary}
        onDietary={setDietary}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPrice={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
      />
      {menu ? <MenuGrid items={filtered} /> : <div>Loading menu...</div>}
      <CartFab />
    </>
  );
};

export default function Page() {
  return (
    <Providers>
      <CustomerPage />
    </Providers>
  );
}
