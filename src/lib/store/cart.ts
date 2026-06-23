import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/supabase/types'

type CartStore = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (product_id: number, size: string, color: string) => void
    updateQuantity: (product_id: number, size: string, color: string, quantity: number) => void
    clearCart: () => void
    total: () => number
    count: () => number
    setItems: (items: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            setItems: (items) => set({ items }),

            addItem: (item) => {
                const items = get().items
                const existing = items.find(
                    (i) =>
                        i.product_id === item.product_id &&
                        i.size === item.size &&
                        i.color === item.color
                )

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.product_id === item.product_id &&
                                i.size === item.size &&
                                i.color === item.color
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    })
                } else {
                    set({ items: [...items, item] })
                }
            },

            removeItem: (product_id, size, color) => {
                set({
                    items: get().items.filter(
                        (i) =>
                            !(i.product_id === product_id &&
                                i.size === size &&
                                i.color === color)
                    ),
                })
            },

            updateQuantity: (product_id, size, color, quantity) => {
                set({
                    items: get().items.map((i) =>
                        i.product_id === product_id &&
                            i.size === size &&
                            i.color === color
                            ? { ...i, quantity }
                            : i
                    ),
                })
            },

            clearCart: () => set({ items: [] }),

            total: () =>
                get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

            count: () =>
                get().items.reduce((acc, i) => acc + i.quantity, 0),
        }),
        {
            name: 'leo-store-cart',
        }
    )
)