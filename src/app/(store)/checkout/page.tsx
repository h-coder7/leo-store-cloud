import React from 'react';
import { getCartItems } from '@/app/actions/cart';
import CheckoutClient from './CheckoutClient';
import { redirect } from 'next/navigation';
import { getSettings } from '@/app/actions/settings';
import { createClient } from '@/lib/supabase/server';
import type { OfferInfo } from './CheckoutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'إتمام الطلب',
    robots: { index: false, follow: false },
};

interface Props {
    searchParams: Promise<{ 
        p_id?: string; 
        offer_id?: string; 
        items?: string;
        size?: string; 
        color?: string; 
    }>;
}

type CheckoutPageItem = {
    id: number;
    quantity: number;
    size: string;
    color: string;
    offer_info?: OfferInfo;
    product: {
        id: number;
        name: string;
        price: number;
        images: string[] | null;
    };
};

interface RawSelectedItem {
    p_id: number;
    size?: string;
    color?: string;
}

export default async function CheckoutPage({ searchParams }: Props) {
    const params = await searchParams;
    const settings = await getSettings();
    let items: CheckoutPageItem[] = [];
    // If global multi-product offer checkout
    if (params.offer_id && params.items) {
        const supabase = await createClient();
        const { data: offer } = await supabase
            .from('offers')
            .select('*')
            .eq('id', parseInt(params.offer_id))
            .single();

        if (offer) {
            try {
                const selectedItemsRaw = JSON.parse(params.items) as RawSelectedItem[];
                const productIds = selectedItemsRaw.map((i) => i.p_id);

                const { data: products } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', productIds);

                if (products) {
                    items = selectedItemsRaw.map((raw, idx): CheckoutPageItem | null => {
                        const p = products.find((p) => p.id === raw.p_id);
                        if (!p) return null;
                        return {
                            id: idx,
                            quantity: 1,
                            size: raw.size || '',
                            color: raw.color || '',
                            offer_info: {
                                title: offer.title,
                                type: offer.type,
                                discount: offer.discount_value,
                                global: true,
                                min_quantity: offer.min_quantity,
                                is_free_shipping: offer.is_free_shipping
                            },
                            product: {
                                id: p.id,
                                name: p.name,
                                price: Number(p.price) || 0,
                                images: p.images
                            }
                        };
                    }).filter((x): x is CheckoutPageItem => x !== null);
                }
            } catch (e) {
                console.error("Error parsing global offer items", e);
            }
        }
    } else if (params.p_id && params.offer_id) {
        const supabase = await createClient();
        const { data: p } = await supabase
            .from('products')
            .select('*')
            .eq('id', parseInt(params.p_id))
            .single();

        if (p) {
            let offer_info = null;

            if (params.offer_id === 'legacy') {
                offer_info = {
                    title: p.offer_title || '',
                    type: p.offer_discount ? 'percentage' : 'free_shipping',
                    discount: p.offer_discount || 0,
                    quantity: Number(p.offer_title?.match(/(\d+)/)?.[1]) || 1
                };
            } else {
                // Check in product.offers array
                const offer = p.offers?.find((o: { id: string }) => o.id === params.offer_id);
                if (offer) {
                    offer_info = {
                        title: offer.title,
                        type: offer.type,
                        discount: offer.discount,
                        quantity: offer.quantity,
                        is_free_shipping: offer.is_free_shipping
                    };
                }
            }

            if (offer_info) {
                items = [{
                    id: p.id,
                    quantity: offer_info.quantity || 1,
                    size: params.size || '',
                    color: params.color || '',
                    offer_info,
                    product: {
                        id: p.id,
                        name: p.name,
                        price: Number(p.price) || 0,
                        images: p.images
                    }
                }];
            }
        }
    }



    // Fallback to normal cart if no direct offer
    if (items.length === 0) {
        items = await getCartItems();
    }

    if (items.length === 0) {
        redirect('/cart');
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">إتمام الطلب</h1>
                    <p className="text-slate-500 font-bold">يرجى تعبئة البيانات لتأكيد طلبك</p>
                </div>
                
                <CheckoutClient initialItems={items} settings={settings} />
            </div>
        </div>
    );
}
