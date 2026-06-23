"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Snowflake, Sparkles } from 'lucide-react';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';
import OffersSlider from '@/components/store/OffersSlider';
import type { Product, Offer } from '@/lib/supabase/types';

interface Props {
    product: Product;
    whatsappNumber?: string;
    offers: Offer[];
}

const seasonBadge: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    صيف: { label: 'صيفي', cls: 'bg-amber-100 text-amber-700', icon: <Sun className="w-3.5 h-3.5" /> },
    شتاء: { label: 'شتوي', cls: 'bg-[#FCD201]/10 text-[#997500]', icon: <Snowflake className="w-3.5 h-3.5" /> },
    'كل الموسم': { label: 'كل الموسم', cls: 'bg-emerald-100 text-emerald-700', icon: <Sparkles className="w-3.5 h-3.5" /> },
};

export default function ProductClientLayout({ product, whatsappNumber, offers }: Props) {
    const badge = product.season ? seasonBadge[product.season] : null;
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");

    return (
        <>
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-[#997500] dark:hover:text-[#FCD201] text-sm mb-8 transition-colors"
            >
                ← العودة للمتجر
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images */}
                <ProductGallery images={product.images} productName={product.name} />

                {/* Details */}
                <div className="flex flex-col gap-5">
                    {/* Season & name */}
                    {badge && (
                        <span className={`self-start text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm ${badge.cls}`}>
                            {badge.icon}
                            {badge.label}
                        </span>
                    )}
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="text-4xl font-black text-[#997500] dark:text-[#FCD201]">
                        {product.price.toLocaleString('ar-EG')} <span className="text-xl font-bold">ج.م</span>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-700" />

                    <div id="product-order-form">
                        <ProductActions
                            product={product}
                            whatsappNumber={whatsappNumber}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                        />
                    </div>
                </div>
            </div>

            {/* Description Section */}
            {product.description && (
                <div className="mt-12 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 border-r-4 border-[#FCD201] pr-3">
                        وصف المنتج
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-line text-base">
                        {product.description}
                    </p>
                </div>
            )}

            {/* ── Offers ── */}
            <div className="mt-20">
                <OffersSlider offers={offers} />
            </div>
        </>
    );
}
