import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BottleSize } from '@/lib/constants';
import type { ProductSlug } from '@/lib/products';
import { getProductBySlug, getPrice } from '@/lib/products';

export interface CartItem {
  slug: ProductSlug;
  size: BottleSize;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (slug: ProductSlug, size: BottleSize, quantity?: number) => void;
  removeItem: (slug: ProductSlug, size: BottleSize) => void;
  updateQuantity: (slug: ProductSlug, size: BottleSize, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  totalEgp: () => number;
}

function findItem(items: CartItem[], slug: ProductSlug, size: BottleSize) {
  return items.findIndex((i) => i.slug === slug && i.size === size);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem(slug, size, quantity = 1) {
        set((state) => {
          const idx = findItem(state.items, slug, size);
          const next = [...state.items];
          if (idx >= 0) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          } else {
            next.push({ slug, size, quantity });
          }
          return { items: next };
        });
      },
      removeItem(slug, size) {
        set((state) => ({
          items: state.items.filter((i) => !(i.slug === slug && i.size === size)),
        }));
      },
      updateQuantity(slug, size, quantity) {
        if (quantity < 1) {
          get().removeItem(slug, size);
          return;
        }
        set((state) => {
          const idx = findItem(state.items, slug, size);
          if (idx < 0) return state;
          const next = [...state.items];
          next[idx] = { ...next[idx], quantity };
          return { items: next };
        });
      },
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      totalEgp: () => {
        const items = get().items;
        return items.reduce((sum, i) => {
          const p = getProductBySlug(i.slug);
          if (!p) return sum;
          return sum + getPrice(p, i.size) * i.quantity;
        }, 0);
      },
    }),
    { name: 'alnaqib-cart' }
  )
);
