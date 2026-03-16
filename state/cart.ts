import { create } from 'zustand';
import { MenuItem } from '../lib/api';

const STORAGE_KEY = 'rt-cart-v1';
const EXPIRY_MS = 60 * 60 * 1000; // 1 hour session window

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
  addOnIds?: string[];
  specialInstructions?: string;
}

interface CartState {
  lines: CartLine[];
  lastSaved?: number;
  add(line: CartLine): void;
  updateQuantity(id: string, quantity: number): void;
  remove(id: string): void;
  clear(): void;
  total(): number;
}

const loadPersisted = (): { lines: CartLine[]; lastSaved?: number } => {
  if (typeof window === 'undefined') return { lines: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [] };
    const parsed = JSON.parse(raw) as { lines: CartLine[]; lastSaved?: number };
    if (parsed.lastSaved && Date.now() - parsed.lastSaved > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return { lines: [] };
    }
    return { lines: parsed.lines ?? [], lastSaved: parsed.lastSaved };
  } catch {
    return { lines: [] };
  }
};

const persist = (lines: CartLine[]) => {
  if (typeof window === 'undefined') return;
  const payload = { lines, lastSaved: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const useCart = create<CartState>((set, get) => ({
  ...loadPersisted(),
  add: (line) =>
    set((state) => {
      const existing = state.lines.find((l) => l.menuItem.id === line.menuItem.id);
      const lines = existing
        ? state.lines.map((l) =>
            l.menuItem.id === line.menuItem.id
              ? { ...l, quantity: l.quantity + line.quantity, addOnIds: line.addOnIds }
              : l
          )
        : [...state.lines, line];
      persist(lines);
      return { lines, lastSaved: Date.now() };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const lines = state.lines.map((l) => (l.menuItem.id === id ? { ...l, quantity } : l));
      persist(lines);
      return { lines, lastSaved: Date.now() };
    }),
  remove: (id) =>
    set((state) => {
      const lines = state.lines.filter((l) => l.menuItem.id !== id);
      persist(lines);
      return { lines, lastSaved: Date.now() };
    }),
  clear: () => {
    persist([]);
    set({ lines: [], lastSaved: Date.now() });
  },
  total: () => {
    return get().lines.reduce((acc, line) => {
      const addOnTotal =
        line.addOnIds?.reduce((sum, id) => {
          const addOn = line.menuItem.addOns?.find((a) => a.id === id);
          return sum + (addOn?.price ?? 0);
        }, 0) ?? 0;
      return acc + (line.menuItem.price + addOnTotal) * line.quantity;
    }, 0);
  }
}));
