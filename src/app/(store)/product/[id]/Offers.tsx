"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tag, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductOffer } from "@/lib/supabase/types";

interface ProductOffersProps {
    product: Product;
    selectedSize: string;
    selectedColor: string;
}

export function Offers({ product, selectedSize, selectedColor }: ProductOffersProps) {
    const router = useRouter();

    const handleGetOffer = (offer: ProductOffer) => {
        if (product.sizes?.length && !selectedSize) {
            toast.error("يرجى اختيار المقاس أولاً");
            const el = document.getElementById('sizes-section');
            el?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (product.colors?.length && !selectedColor) {
            toast.error("يرجى اختيار اللون أولاً");
            const el = document.getElementById('colors-section');
            el?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Redirect to checkout with offer params
        const params = new URLSearchParams();
        params.set('p_id', product.id.toString());
        params.set('offer_id', offer.id);
        if (selectedSize) params.set('size', selectedSize);
        if (selectedColor) params.set('color', selectedColor);

        router.push(`/checkout?${params.toString()}`);
    };

    const activeOffers = product.offers?.filter(o => o.is_active) || [];
    // Fallback to legacy fields if no new offers exist
    if (activeOffers.length === 0 && (product.offer_title || product.offer_discount)) {
        activeOffers.push({
            id: 'legacy',
            title: product.offer_title || '',
            discount: product.offer_discount || 0,
            is_active: true,
            type: product.offer_discount ? 'percentage' : 'free_shipping',
            show_button: true,
            button_text: 'احصل على العرض الآن',
            quantity: Number(product.offer_title?.match(/(\d+)/)?.[1]) || 1
        });
    }

    if (activeOffers.length === 0) return null;

    return (
        <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">عروض خاصة متاحة</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {activeOffers.map((offer) => (
                    <div
                        key={offer.id}
                        className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-amber-100 dark:border-amber-900/50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <div className="flex flex-col gap-5">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center shrink-0">
                                    {offer.type === 'free_shipping' ? (
                                        <ShoppingBag className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                                    ) : (
                                        <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                        {offer.title}
                                    </h4>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                            {offer.type === 'free_shipping' ? 'شحن مجاني' : `خصم ${offer.discount}%`}
                                        </span>
                                        {offer.is_free_shipping && (
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                                                + شحن مجاني
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            لعدد {offer.quantity} قطعة
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {offer.show_button && (
                                <button
                                    onClick={() => handleGetOffer(offer)}
                                    className="w-full mt-2 py-3.5 bg-amber-400 hover:bg-amber-500 text-black font-black text-base rounded-2xl shadow-lg shadow-amber-400/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {offer.button_text || 'احصل على العرض الآن'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
