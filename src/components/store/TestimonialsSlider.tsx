"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Quote, MessageCircleHeart, ArrowLeft } from 'lucide-react';

import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Testimonial } from '@/lib/supabase/types';

interface TestimonialsSliderProps {
    testimonials: Testimonial[];
}

export default function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="mt-20 mb-8" dir="rtl">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-10">
                <div
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black shadow"
                    style={{ background: 'linear-gradient(135deg, #FCD201, #FFA000)', color: '#1a1a1a' }}
                >
                    <MessageCircleHeart className="w-4 h-4" />
                    <span>آراء عملائنا</span>
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #FCD201, transparent)' }} />
                
                {/* Custom Navigation Buttons */}
                <div className="hidden md:flex gap-2">
                    <button className="testimonials-btn-next w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#FCD201,#FFA000)', color: '#1a1a1a', boxShadow: '0 4px 15px rgba(252,210,1,0.4)' }}>
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <button className="testimonials-btn-prev w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#FCD201,#FFA000)', color: '#1a1a1a', boxShadow: '0 4px 15px rgba(252,210,1,0.4)' }}>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm font-semibold mr-2" style={{ color: '#b8860b' }}>ثقتكم تلهمنا</p>
            </div>

            {/* Sub-heading */}
            <p className="text-center text-slate-500 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                نفتخر بثقة عملائنا ونسعى دائماً لتقديم أفضل تجربة تسوق ممكنة.
            </p>

            <div className="relative">
                <Swiper
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ 
                        clickable: true, 
                        dynamicBullets: true,
                        renderBullet: (index, className) =>
                            `<span class="${className} testimonials-bullet"></span>`,
                    }}
                    navigation={{
                        nextEl: '.testimonials-btn-next',
                        prevEl: '.testimonials-btn-prev',
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="pb-14 testimonials-swiper"
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={item.id}>
                            <div
                                className="p-6 shadow-md m-3 h-full flex flex-col relative group hover:-translate-y-1 transition-all duration-400"
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '2rem',
                                    // border: '3px solid #9993',
                                }}
                            >
                                {/* Corner accent */}
                                <div
                                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] rounded-tr-[2rem] opacity-60"
                                    style={{
                                        background: index % 3 === 0
                                            ? 'linear-gradient(135deg, rgba(252,210,1,0.15), rgba(255,160,0,0.08))'
                                            : index % 3 === 1
                                                ? 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(59,130,246,0.06))'
                                                : 'linear-gradient(135deg, rgba(244,114,182,0.12), rgba(236,72,153,0.06))',
                                    }}
                                />

                                {/* Big quote icon */}
                                <div className="absolute top-5 left-5 opacity-10 group-hover:opacity-20 transition-opacity duration-400">
                                    <Quote size={52} style={{ color: '#FCD201' }} />
                                </div>

                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 mb-5 relative z-10">
                                    <div
                                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                                        style={{
                                            border: '2.5px solid #FCD201',
                                            boxShadow: '0 0 0 3px rgba(252,210,1,0.2)',
                                        }}
                                    >
                                        {item.avatar_url ? (
                                            <Image
                                                src={item.avatar_url}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center font-black text-base"
                                                style={{ background: 'linear-gradient(135deg,#FCD201,#FFA000)', color: '#1a1a1a' }}
                                            >
                                                {item.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm leading-tight">{item.name}</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{item.role || 'عميل'}</p>
                                    </div>
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-4 relative z-10">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-200'}
                                        />
                                    ))}
                                </div>

                                {/* Review text */}
                                <p className="text-slate-600 text-sm leading-relaxed relative z-10 flex-grow italic">
                                    &ldquo;{item.content}&rdquo;
                                </p>

                                {/* Bottom accent bar */}
                                <div
                                    className="mt-5 h-1 w-8 rounded-full group-hover:w-16 transition-all duration-500"
                                    style={{ background: 'linear-gradient(to right, #FCD201, #FFA000)' }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx global>{`
                .testimonials-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(252,210,1,0.3) !important;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-block;
                    margin: 0 4px !important;
                }
                .testimonials-bullet.swiper-pagination-bullet-active {
                    background: #FCD201 !important;
                    transform: scale(1.3);
                    box-shadow: 0 0 8px rgba(252,210,1,0.6);
                }
            `}</style>
        </section>
    );
}
