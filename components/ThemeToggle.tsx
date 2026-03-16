"use client";
import React, { useEffect, useState } from 'react';

const THEME_KEY = 'rt-theme';

const getInitial = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
  if (stored) return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitial);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  if (!mounted) {
    // Avoid hydration mismatch by deferring render to client
    return (
      <button
        style={{
          border: '1px solid var(--border)',
          background: 'var(--card)',
          color: 'var(--text)',
          padding: '6px 12px',
          borderRadius: 12,
          visibility: 'hidden'
        }}
        aria-hidden
      >
        Theme
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{
        border: '1px solid var(--border)',
        background: 'var(--card)',
        color: 'var(--text)',
        padding: '6px 12px',
        borderRadius: 12
      }}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
