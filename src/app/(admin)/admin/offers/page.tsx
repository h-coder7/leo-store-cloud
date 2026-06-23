import React from 'react';
import Link from 'next/link';
import { getAllOffers } from '@/app/actions/offers';
import { Plus, Tag } from 'lucide-react';
import OfferActions from './OfferActions';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage() {
    const offers = await getAllOffers();

    return (
        <div className="p-6 md:p-10" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة العروض</h1>
                    <p className="text-slate-500 mt-1">إضافة وتعديل عروض المتجر الخاصة بك</p>
                </div>
                <Link
                    href="/admin/offers/add"
                    className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    إضافة عرض جديد
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <div key={offer.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 group">
                        {/* Preview */}
                        <div className="relative aspect-video">
                            <img
                                src={offer.image_url}
                                alt={offer.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-red-500 text-white font-black px-3 py-1 rounded-full shadow">
                                {offer.discount_label}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                                <h3 className="font-black text-xl mb-1">{offer.title}</h3>
                                <p className="text-sm text-slate-200 line-clamp-2">{offer.description}</p>
                                {offer.is_free_shipping && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md shadow-sm">شحن مجاني</span>
                                    </div>
                                )}
                                {!offer.is_active && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        معطل
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <OfferActions id={offer.id} isActive={offer.is_active} />
                    </div>
                ))}

                {offers.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                        <Tag className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">لا يوجد عروض مضافة حالياً</p>
                        <p className="text-sm">قم بإضافة عروضك الأولى لتظهر في الصفحة الرئيسية</p>
                    </div>
                )}
            </div>
        </div>
    );
}
