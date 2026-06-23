"use client";
 
import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[] | null;
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner flex items-center justify-center text-slate-300 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-700">
                <ShoppingBag className="w-20 h-20" />
            </div>
        );
    }

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Display */}
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800 shadow group border-4 border-white dark:border-slate-700">
                <Image
                    src={images[activeIndex]}
                    alt={`${productName} - صورة ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={activeIndex === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Navigation Arrows (Only if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 transform ${activeIndex === i
                                ? "border-primary scale-105 shadow-md shadow-primary/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${productName} thumbnail ${i + 1}`}
                                fill
                                quality={50}
                                sizes="80px"
                                className={`object-cover transition-opacity ${activeIndex === i ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
