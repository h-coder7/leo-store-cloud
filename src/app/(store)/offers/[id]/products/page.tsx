import React from 'react';
import Image from 'next/image';
import { getOfferById } from '@/app/actions/offers';
import { getProducts } from '@/app/actions/products';
import OfferProductsClient from './OfferProductsClient';
import { notFound } from 'next/navigation';

export default async function OfferProductsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const offerId = parseInt(id);
    if (isNaN(offerId)) notFound();

    const [offer, products] = await Promise.all([
        getOfferById(offerId),
        getProducts()
    ]);

    if (!offer) notFound();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20" dir="rtl">
            {/* Offer Header */}
            <div className="relative bg-[#1a1a1a] text-white py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image src={offer.image_url} alt="" fill sizes="100vw" className="object-cover blur-sm" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-black font-black text-xs mb-6 shadow-xl shadow-amber-400/20">
                        <span>{offer.discount_label}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">{offer.title}</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
                        {offer.description}
                    </p>
                    
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                            <span className="block text-xs text-slate-400 mb-0.5">الحد الأدنى</span>
                            <span className="text-xl font-black">{offer.min_quantity} قطع</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                            <span className="block text-xs text-slate-400 mb-0.5">نوع العرض</span>
                            <span className="text-xl font-black">
                                {offer.type === 'free_shipping' ? 'شحن مجاني' : offer.type === 'percentage' ? `خصم ${offer.discount_value}%` : `خصم ${offer.discount_value} ج.م`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <OfferProductsClient offer={offer} products={products} />
            </div>
        </div>
    );
}
