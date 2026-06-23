import React from 'react';
import BannerSlider from '@/components/store/BannerSlider';
import SectionCard from '@/components/store/SectionCard';
import ProductCard from '@/components/store/ProductCard';
import TestimonialsSlider from '@/components/store/TestimonialsSlider';
import OffersSlider from '@/components/store/OffersSlider';
import { getProducts, getSections } from '@/app/actions/products';
import { getBanners } from '@/app/actions/banners';
import { getTestimonials } from '@/app/actions/testimonials';
import { getOffers } from '@/app/actions/offers';
import { Palette, Folder, ShoppingBag } from 'lucide-react';

export const revalidate = 60;

export default async function StorePage() {
    const [products, sections, banners, testimonials, offers] = await Promise.all([
        getProducts(),
        getSections(),
        getBanners(),
        getTestimonials(),
        getOffers()
    ]);

    return (
        <div className="min-h-screen">

            {/* Decorative background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#FCD201' }} />
                <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#FFA000' }} />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#FCD201' }} />
            </div>

            {/* Banner */}
            <div className="relative z-10">
                <BannerSlider banners={banners} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10" dir="rtl">

                {/* ── Sections ── */}
                <section className="mt-12">
                    <div className="flex items-center gap-4 mb-8">
                        {/* Decorative pill */}
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black shadow" style={{ background: 'linear-gradient(135deg, #FCD201, #FFA000)', color: '#1a1a1a' }}>
                            <Palette className="w-4 h-4" />
                            <span>الأقسام</span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #FCD201, transparent)' }} />
                        <p className="text-sm font-semibold" style={{ color: '#b8860b' }}>تصفّح حسب القسم</p>
                    </div>

                    {sections.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                            {sections.map((section) => (
                                <SectionCard key={section.id} section={section} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 rounded-3xl border-2 border-dashed" style={{ background: 'rgba(252,210,1,0.05)', borderColor: '#FCD201' }}>
                            <Folder className="w-12 h-12 mb-3 text-[#FCD201] opacity-40" />
                            <p className="text-base font-black" style={{ color: '#b8860b' }}>لا توجد أقسام حالياً</p>
                        </div>
                    )}
                </section>

                {/* ── Products ── */}
                <section className="mt-20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black shadow" style={{ background: 'linear-gradient(135deg, #FCD201, #FFA000)', color: '#1a1a1a' }}>
                            <ShoppingBag className="w-4 h-4" />
                            <span>أحدث المنتجات</span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #FCD201, transparent)' }} />
                        <p className="text-sm font-semibold" style={{ color: '#b8860b' }}>
                            {products.length > 0 ? `${products.length} منتج متاح` : 'لم يُضف منتجات بعد'}
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-28 rounded-3xl border-2 border-dashed" style={{ background: 'rgba(252,210,1,0.05)', borderColor: '#FCD201' }}>
                            <ShoppingBag className="w-20 h-20 mb-5 text-[#FCD201] opacity-40" />
                            <p className="text-lg font-black" style={{ color: '#b8860b' }}>لا توجد منتجات حالياً</p>
                            <p className="text-sm mt-1 text-slate-500">تابعنا قريباً لمزيد من المنتجات!</p>
                        </div>
                    )}
                </section>

                {/* ── Offers ── */}
                <OffersSlider offers={offers} />

                {/* ── Testimonials ── */}
                <TestimonialsSlider testimonials={testimonials} />
            </div>

        </div>
    );
}
