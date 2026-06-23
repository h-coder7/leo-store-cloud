'use client';

import { useEffect } from 'react';
import { getCartItems } from '@/app/actions/cart';
import { useCartStore } from '@/lib/store/cart';
import { toCartStoreItems } from '@/lib/cart/sync';

/** Keeps the navbar badge in sync with the Supabase cart (source of truth). */
export default function CartSync() {
    const replaceItems = useCartStore((state) => state.replaceItems);

    useEffect(() => {
        let cancelled = false;

        getCartItems()
            .then((items) => {
                if (!cancelled) {
                    replaceItems(toCartStoreItems(items));
                }
            })
            .catch(() => {
                if (!cancelled) {
                    replaceItems([]);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [replaceItems]);

    return null;
}
