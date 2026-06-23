import React from 'react';
import { getProducts, getSections } from '@/app/actions/products';
import ProductCard from '@/components/store/ProductCard';
import OffersSlider from '@/components/store/OffersSlider';
import { getOffers } from '@/app/actions/offers';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ section?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const sectionId = resolvedParams.section ? parseInt(resolvedParams.section, 10) : undefined;

    const [products, sections, offers] = await Promise.all([
        getProducts(sectionId, 200),
        getSections(),
        getOffers(),
    ]);

    const currentSection = sectionId ? sections.find(s => s.id === sectionId) : null;

    return (

        <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:hover:text-primary text-sm mb-4 transition-colors font-semibold"
                    >
                        ← العودة للرئيسية
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        {currentSection ? `منتجات قسم: ${currentSection.name}` : 'جميع المنتجات'}
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm font-semibold">
                        استعرض التشكيلة المميزة من منتجاتنا
                    </p>
                </div>

                {/* Filters / Section Links */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-4">
                    <Link
                        href="/products"
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${!sectionId
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                            }`}
                    >
                        الكل
                    </Link>

                    {sections.map(section => (
                        <Link
                            key={section.id}
                            href={`/products?section=${section.id}`}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${sectionId === section.id
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {section.name}
                        </Link>
                    ))}
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-bold">لا توجد منتجات في هذا القسم بعد</p>
                    </div>
                )}

                {/* ── Offers ── */}
                <OffersSlider offers={offers} />

            </div>
        </div>

    );
}
