import React from 'react';
import { getProducts, getSections } from '@/app/actions/products';
import Link from 'next/link';
import type { Product, Section } from '@/lib/supabase/types';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

const seasonColors: Record<string, string> = {
    صيف: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    شتاء: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'كل الموسم': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export default async function ProductsAdminPage() {
    const [products, sections] = await Promise.all([getProducts(), getSections()]);

    const sectionMap = Object.fromEntries(sections.map((s: Section) => [s.id, s.name]));

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">إدارة المنتجات</h1>
                    <p className="text-slate-500 mt-1 font-bold">
                        {products.length > 0 ? `${products.length} منتج مسجّل` : 'لا توجد منتجات بعد'}
                    </p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="w-full sm:w-auto bg-primary hover:opacity-90 text-primary-foreground font-black py-3 md:py-4 px-6 md:px-8 rounded-2xl transition-all shadow-md hover:shadow flex items-center justify-center gap-2 active:scale-95"
                >
                    <span className="text-2xl leading-none">+</span>
                    إضافة منتج جديد
                </Link>
            </div>

            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.length > 0 ? (
                    products.map((product: Product) => (
                        <div key={product.id} className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                            <div className="flex gap-4">
                                {product.images && product.images.length > 0 ? (
                                    <div
                                        className="w-20 h-20 rounded-2xl bg-cover bg-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm"
                                        style={{ backgroundImage: `url(${product.images[0]})` }}
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 shrink-0 flex items-center justify-center text-slate-400">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-slate-900 dark:text-white text-lg truncate mb-1">{product.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">{product.price} ج.م</span>
                                        {product.season && (
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${seasonColors[product.season] ?? 'bg-slate-100 text-slate-600'}`}>
                                                {product.season}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold mt-1">
                                        {product.section_id && sectionMap[product.section_id] ? sectionMap[product.section_id] : 'بدون قسم'}
                                    </p>
                                </div>
                            </div>

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {product.sizes.map((s) => (
                                        <span key={s} className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-[10px] font-black text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-bold">
                                    {new Date(product.created_at).toLocaleDateString('ar-EG')}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-[#997500] dark:text-primary rounded-xl font-black text-sm hover:bg-primary/20 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        تعديل
                                    </Link>
                                    <DeleteProductButton productId={product.id} productName={product.name} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="font-bold text-slate-500">لا توجد منتجات حالياً</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-800 rounded-3xl shadow overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">المنتج</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">القسم</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">السعر</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">الموسم</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">المقاسات</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">تاريخ الإضافة</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product: Product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors"
                                    >
                                        {/* Product name + image */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3 min-w-[220px]">
                                                {product.images && product.images.length > 0 ? (
                                                    <div
                                                        className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0 border border-slate-200 dark:border-slate-700"
                                                        style={{ backgroundImage: `url(${product.images[0]})` }}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 flex items-center justify-center text-slate-400">
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                                        {product.name}
                                                    </div>
                                                    {/* Color dots */}
                                                    {product.colors && product.colors.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {product.colors.slice(0, 5).map((c) => (
                                                                <span key={c} className="text-xs text-slate-400">
                                                                    {c}
                                                                </span>
                                                            ))}
                                                            {product.colors.length > 5 && (
                                                                <span className="text-xs text-slate-400">+{product.colors.length - 5}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Section */}
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {product.section_id && sectionMap[product.section_id]
                                                ? sectionMap[product.section_id]
                                                : <span className="text-slate-400">—</span>}
                                        </td>

                                        {/* Price */}
                                        <td className="p-4 text-emerald-600 dark:text-emerald-400 font-black whitespace-nowrap">
                                            {product.price} ج.م
                                        </td>

                                        {/* Season */}
                                        <td className="p-4">
                                            {product.season ? (
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${seasonColors[product.season] ?? 'bg-slate-100 text-slate-600'
                                                        }`}
                                                >
                                                    {product.season}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">—</span>
                                            )}
                                        </td>

                                        {/* Sizes */}
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {product.sizes && product.sizes.length > 0 ? (
                                                    product.sizes.map((s) => (
                                                        <span
                                                            key={s}
                                                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-sm">—</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="p-4 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                                            {new Date(product.created_at).toLocaleDateString('ar-EG', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-[#997500] hover:text-[#7a5e00] dark:text-primary dark:hover:text-primary/80 transition-colors p-2 rounded-lg hover:bg-primary/10"
                                                    title="تعديل"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </Link>
                                                <DeleteProductButton productId={product.id} productName={product.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                            </div>
                                        </div>
                                        <div className="font-bold text-lg mb-2">لا توجد منتجات حالياً</div>
                                        <div className="text-sm">ابدأ بإضافة منتجك الأول!</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
