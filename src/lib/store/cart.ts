import { create } from 'zustand';
import type { CartItem } from '@/lib/supabase/types';

type CartStore = {
    items: CartItem[];
    replaceItems: (items: CartItem[]) => void;
    clearCart: () => void;
    count: () => number;
};

export const useCartStore = create<CartStore>()((set, get) => ({
    items: [],

    replaceItems: (items) => set({ items }),

    clearCart: () => set({ items: [] }),

    count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
}));
