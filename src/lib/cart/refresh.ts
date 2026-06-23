'use client';

import { getCartItems } from '@/app/actions/cart';
import { useCartStore } from '@/lib/store/cart';
import { toCartStoreItems, type ServerCartItem } from '@/lib/cart/sync';

export async function refreshCartFromServer(): Promise<ServerCartItem[]> {
    const items = await getCartItems();
    useCartStore.getState().replaceItems(toCartStoreItems(items));
    return items;
}
