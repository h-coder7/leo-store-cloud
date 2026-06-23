"use client";

import React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import { ShoppingBag, Sparkles, Sun, Snowflake } from 'lucide-react';
import Image from 'next/image';

const seasonBadge: Record<string, { label: string; icon: React.ReactNode; bg: string; color: string }> = {
    صيف: { label: 'صيفي', icon: <Sun className="w-3.5 h-3.5" />, bg: '#FFF3E0', color: '#E65100' },
    شتاء: { label: 'شتوي', icon: <Snowflake className="w-3.5 h-3.5" />, bg: '#E3F2FD', color: '#1565C0' },
    'كل الموسم': { label: 'كل الموسم', icon: <Sparkles className="w-3.5 h-3.5" />, bg: '#F9FBE7', color: '#558B2F' },
};

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const mainImage = product.images?.[0] ?? null;
    const badge = product.season ? seasonBadge[product.season] : null;

    return (
        <Link
            href={`/product/${product.id}`}
            className="group flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 relative"
            style={{
                background: '#fff',
                boxShadow: '5px 5px 30px #0001',
                border: '2px solid #9993',
            }}
        >
            {/* Hover glow border */}
            <div
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: '0 0 0 2.5px #FCD201, 0 8px 40px rgba(252,210,1,0.22)' }}
            />

            {/* ── Image ── */}
            <div className="relative w-full aspect-[4/4] overflow-hidden rounded-t-[2rem]" style={{ background: '#FFFDE7' }}>
                {mainImage ? (
                    <>
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            quality={65}
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#FCD201]">
                        <ShoppingBag className="w-16 h-16 mb-2 opacity-40" />
                        <span className="text-xs font-bold text-slate-400">لا توجد صورة</span>
                    </div>
                )}

                {/* Season badge */}
                {badge && (
                    <span
                        className="absolute top-3 right-3 text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md"
                        style={{ background: badge.bg, color: badge.color }}
                    >
                        {badge.icon}
                        {badge.label}
                    </span>
                )}

                {/* Multi-image count */}
                {/* {product.images && product.images.length > 1 && (
                    <span
                        className="absolute bottom-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm"
                        style={{ background: 'rgba(252,210,1,0.95)', color: '#1a1a1a' }}
                    >
                        +{product.images.length - 1} صور
                    </span>
                )} */}
            </div>

            {/* ── Info ── */}
            <div className="p-5 flex flex-col gap-3 flex-1 relative bg-white">

                {/* Floating price badge */}
                <div
                    className="absolute -top-5 left-5 px-4 py-2 rounded-2xl shadow font-black text-base flex items-center gap-1.5 transition-transform duration-500 group-hover:-translate-y-1"
                    style={{
                        background: 'linear-gradient(135deg, #FCD201, #FFA000)',
                        color: '#1a1a1a',
                        boxShadow: '0 4px 18px rgba(252,210,1,0.45)',
                    }}
                >
                    <Sparkles className="w-3.5 h-3.5 opacity-70" />
                    <span dir="ltr">{product.price.toLocaleString('ar-EG')} <span className="text-xs font-bold">ج.م</span></span>
                </div>

                {/* Name */}
                <h3
                    className="font-black text-slate-800 line-clamp-2 text-sm leading-snug transition-colors duration-300 mt-2 group-hover:text-yellow-700"
                >
                    {product.name}
                </h3>

                {/* Attributes */}
                <div className="flex flex-col gap-2 mt-auto">
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="lg:flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">المقاس</span>
                            <div className="flex flex-wrap gap-1">
                                {product.sizes.slice(0, 3).map((s) => (
                                    <span
                                        key={s}
                                        className="px-2 py-0.5 rounded-lg text-[10px] font-black"
                                        style={{ background: 'rgba(252,210,1,0.15)', color: '#996600' }}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Add to Cart Button (Flat) */}
                <div className="pt-2">
                    <div
                        className="w-full py-3 bg-[#f5f5f5] text-[#1a1a1a] font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-[#1a1a1a] group-hover:text-white"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>عرض المنتج</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
