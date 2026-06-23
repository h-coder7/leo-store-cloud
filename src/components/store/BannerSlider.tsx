"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Star, Truck } from 'lucide-react';

import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
    color: string; // kept in interface for DB compatibility, not used visually
    link_url: string;
    button_text: string;
}

interface BannerSliderProps {
    banners: Banner[];
}

/* Decorative floating shapes — rendered per slide */
function FloatingShapes() {
    return (
        <>
            {/* Big soft circle top-left */}
            <div
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(252,210,1,0.22) 0%, transparent 70%)' }}
            />
            {/* Small circle bottom-right */}
            <div
                className="absolute bottom-10 right-10 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
            />
            {/* Sparkle dots */}
            <Star className="absolute top-16 left-1/3 w-5 h-5 text-yellow-300 opacity-60 animate-pulse" style={{ animationDuration: '2.4s' }} />
            <Star className="absolute top-28 right-1/4 w-3 h-3 text-yellow-200 opacity-50 animate-pulse" style={{ animationDuration: '3.1s' }} />
            <Sparkles className="absolute bottom-20 left-1/4 w-5 h-5 text-yellow-300 opacity-40 animate-pulse" style={{ animationDuration: '2s' }} />
            {/* Wavy bottom edge */}
            <svg
                className="absolute bottom-0 left-0 w-full pointer-events-none"
                viewBox="0 0 1440 60"
                preserveAspectRatio="none"
                style={{ height: 60 }}
            >
                <path
                    d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
                    fill="rgba(255,253,231,0.95)"
                />
            </svg>
        </>
    );
}

export default function BannerSlider({ banners }: BannerSliderProps) {
    if (!banners || banners.length === 0) return null;

    return (
        <div className="w-full relative mb-0 overflow-hidden" dir="rtl">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                speed={1000}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) =>
                        `<span class="${className} hero-bullet"></span>`,
                }}
                navigation={{
                    nextEl: '.hero-btn-next',
                    prevEl: '.hero-btn-prev',
                }}
                className="w-full hero-swiper"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="overflow-hidden">
                        <div className="relative w-full">
                            {/* ── Banner Image ── */}
                            <Link href={banner.link_url || '#'} className="block w-full">
                                <Image
                                    src={banner.image_url}
                                    alt={banner.title}
                                    width={1920}
                                    height={600}
                                    sizes="100vw"
                                    priority
                                    className="w-full h-auto block"
                                />
                            </Link>

                            {/* ── Decorative layer ── */}
                            <FloatingShapes />
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom nav buttons */}
                <div className="absolute bottom-12 left-8 z-20 hidden md:flex gap-3">
                    <button className="hero-btn-next w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg,#FCD201,#FFA000)', color: '#1a1a1a', boxShadow: '0 4px 18px rgba(252,210,1,0.5)' }}>
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <button className="hero-btn-prev w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg,#FCD201,#FFA000)', color: '#1a1a1a', boxShadow: '0 4px 18px rgba(252,210,1,0.5)' }}>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
            </Swiper>

            <style jsx global>{`
                .hero-swiper .swiper-pagination {
                    bottom: 24px !important;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    align-items: center;
                }
                .hero-bullet {
                    width: 36px;
                    height: 4px;
                    background: rgba(255,255,255,0.35);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    display: inline-block;
                }
                .hero-bullet.swiper-pagination-bullet-active {
                    background: #FCD201;
                    width: 72px;
                    box-shadow: 0 0 12px rgba(252,210,1,0.6);
                }
                @media (max-width: 640px) {
                    .hero-bullet { width: 18px; }
                    .hero-bullet.swiper-pagination-bullet-active { width: 36px; }
                }
            `}</style>
        </div>
    );
}
