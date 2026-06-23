import type { CartItem } from '@/lib/supabase/types';

export type ServerCartItem = {
    id: number;
    quantity: number;
    size: string;
    color: string;
    product: {
        id: number;
        name: string;
        price: number;
        images: string[] | null;
    } | null;
};

export function toCartStoreItems(items: ServerCartItem[]): CartItem[] {
    return items
        .filter((item): item is ServerCartItem & { product: NonNullable<ServerCartItem['product']> } =>
            item.product != null
        )
        .map((item) => ({
            product_id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price) || 0,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.product.images?.[0] || '',
        }));
}
