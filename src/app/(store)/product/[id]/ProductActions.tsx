"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, Ruler, X, Truck, ShieldCheck, CreditCard } from "lucide-react";
import Image from 'next/image';
import type { Product } from "@/lib/supabase/types";
import { addToCart } from "@/app/actions/cart";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart";
import { formatWhatsAppNumber } from "@/lib/utils";

interface ProductActionsProps {
    product: Product;
    whatsappNumber?: string;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}

export default function ProductActions({ 
    product, 
    whatsappNumber,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor
}: ProductActionsProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [isBuyNowPending, setIsBuyNowPending] = useState(false);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    // This updates local UI immediately (Navbar count)
    const addLocalItem = useCartStore(state => state.addItem);

    const handleAddToCart = async () => {
        if (product.sizes?.length && !selectedSize) {
            toast.error("يرجى اختيار المقاس");
            return;
        }

        if (product.colors?.length && !selectedColor) {
            toast.error("يرجى اختيار اللون");
            return;
        }

        try {
            setIsPending(true);

            // Add to local Zustand for immediate UI update
            addLocalItem({
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
                image: product.images?.[0] || ""
            });

            // Persist to Supabase
            await addToCart(product.id, 1, selectedSize, selectedColor);

            toast.success("تم إضافة المنتج للسلة بنجاح!");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء الإضافة للسلة");
        } finally {
            setIsPending(false);
        }
    };

    const handleBuyNow = async () => {
        if (product.sizes?.length && !selectedSize) {
            toast.error("يرجى اختيار المقاس");
            return;
        }

        if (product.colors?.length && !selectedColor) {
            toast.error("يرجى اختيار اللون");
            return;
        }

        try {
            setIsBuyNowPending(true);

            // Add to local Zustand for immediate UI update
            addLocalItem({
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
                image: product.images?.[0] || ""
            });

            // Persist to Supabase
            await addToCart(product.id, 1, selectedSize, selectedColor);

            // Go to checkout
            router.push("/checkout");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء الشراء");
        } finally {
            setIsBuyNowPending(false);
        }
    };


    return (
        <div className="flex flex-col gap-5">
            {/* Size Chart Button - Only visible if size chart image exists */}
            {product.size_chart_image && (
                <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="self-start flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.25rem] text-sm font-black text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                >
                    <Ruler className="w-4 h-4 text-primary" />
                    <span>جدول المقاسات</span>
                </button>
            )}



            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
                <div id="colors-section">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        الألوان المتاحة
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {product.colors.map((c) => (
                            <span
                                key={c}
                                onClick={() => {
                                    setSelectedColor(c);
                                    // Reset size selection if it's not available for the new color
                                    const colorSizes = (product.color_sizes as Record<string, string[]>) || {};
                                    const availableForNewColor = colorSizes[c] || [];
                                    if (selectedSize && !availableForNewColor.includes(selectedSize)) {
                                        setSelectedSize("");
                                    }
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-2
                  ${selectedColor === c
                                        ? "border-primary text-primary bg-primary/10 dark:border-primary dark:text-primary dark:bg-primary/20"
                                        : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary/50"}
                `}
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
                <div id="sizes-section">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            المقاسات المتاحة
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {product.sizes.map((s) => {
                            // Check if size is available for the selected color
                            const colorSizes = (product.color_sizes as Record<string, string[]>) || {};
                            const isAvailable = selectedColor 
                                ? (colorSizes[selectedColor] || []).includes(s)
                                : true; // If no color selected, show all as available

                            const isSelected = selectedSize === s;

                            if (!isAvailable) {
                                return (
                                    <span
                                        key={s}
                                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 text-sm font-bold cursor-not-allowed select-none min-w-[80px] line-through bg-slate-50/50 dark:bg-slate-900/30"
                                        title="غير متوفر لهذا اللون"
                                    >
                                        {s}
                                    </span>
                                );
                            }

                            return (
                                <span
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-colors cursor-pointer min-w-[80px]
                      ${isSelected
                                            ? "border-primary text-primary dark:border-primary dark:text-primary"
                                            : "border-slate-200 text-slate-700 dark:border-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"}
                    `}
                                >
                                    {s}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Buy Now button */}
                    <button
                        onClick={handleBuyNow}
                        disabled={isPending || isBuyNowPending}
                        className="flex-1 py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 active:scale-95 text-white dark:text-slate-900 font-black text-lg rounded-2xl shadow transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        {isBuyNowPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>جاري الشراء...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-6 h-6" />
                                <span>اشترى الآن</span>
                            </>
                        )}
                    </button>

                    {/* Add to cart button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending || isBuyNowPending}
                        className="flex-1 py-4 bg-[#FCD201] hover:bg-[#ebd201] disabled:opacity-50 active:scale-95 text-[#1a1a1a] font-black text-lg rounded-2xl shadow shadow-[#FCD201]/30 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>جاري الإضافة...</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-6 h-6" />
                                <span>أضف إلى السلة</span>
                            </>
                        )}
                    </button>
                </div>

                {/* WhatsApp button */}
                {whatsappNumber && (
                    <button
                        onClick={() => {
                            const message = `مرحباً، أود الاستفسار عن منتج: ${window.location.href}`;
                            const url = `https://wa.me/${formatWhatsAppNumber(whatsappNumber)}?text=${encodeURIComponent(message)}`;
                            window.open(url, "_blank");
                        }}
                        className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-lg rounded-2xl shadow shadow-[#25D366]/30 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>اطلب واتساب</span>
                    </button>
                )}
            </div>

            {/* Delivery Info */}
            <div className="flex flex-col gap-3 mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">توصيل سريع</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">توصيل الطلب من ثلاث اى خمسة ايام عمل</p>
                    </div>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700" />
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">حق المعاينة</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">جوده نثق بها - عاينى شحنتك قبل ماتستلميها</p>
                    </div>
                </div>
            </div>


            {/* Size Chart Modal */}
            {isSizeChartOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsSizeChartOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">جدول المقاسات</h3>
                            </div>
                            <button
                                onClick={() => setIsSizeChartOpen(false)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-900 dark:text-white transition-all active:scale-95"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Image Content */}
                        <div className="relative flex-1 p-4 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 min-h-[400px]">
                            <Image
                                src={product.size_chart_image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"}
                                alt="جدول المقاسات"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-contain p-4 rounded-2xl"
                            />
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm font-bold text-slate-500">يرجى التأكد من المقاسات قبل إتمام الطلب</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
