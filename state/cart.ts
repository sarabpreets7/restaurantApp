import { create } from 'zustand';
import { MenuItem } from '../lib/api';

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
  addOnIds?: string[];
  specialInstructions?: string;
}

interface CartState {
  lines: CartLine[];
  add(line: CartLine): void;
  updateQuantity(id: string, quantity: number): void;
  remove(id: string): void;
  clear(): void;
  total(): number;
}

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  add: (line) =>
    set((state) => {
      const existing = state.lines.find((l) => l.menuItem.id === line.menuItem.id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.menuItem.id === line.menuItem.id
              ? { ...l, quantity: l.quantity + line.quantity, addOnIds: line.addOnIds }
              : l
          )
        };
      }
      return { lines: [...state.lines, line] };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      lines: state.lines.map((l) => (l.menuItem.id === id ? { ...l, quantity } : l))
    })),
  remove: (id) => set((state) => ({ lines: state.lines.filter((l) => l.menuItem.id !== id) })),
  clear: () => set({ lines: [] }),
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
