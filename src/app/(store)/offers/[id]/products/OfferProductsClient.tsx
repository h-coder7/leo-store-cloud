"use client";

import React, { useState } from 'react';
import { Product, Offer } from '@/lib/supabase/types';
import { ShoppingCart, Check, ShoppingBag, Eye, X, Truck, ShieldCheck, Sun, Snowflake, Sparkles, Plus, Minus, Trash2, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
    offer: Offer;
    products: Product[];
}

interface SelectedItem {
    instanceId: string;
    product: Product;
    size?: string;
    color?: string;
}

const seasonBadge: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    صيف: { label: 'صيفي', cls: 'bg-amber-100 text-amber-700', icon: <Sun className="w-3.5 h-3.5" /> },
    شتاء: { label: 'شتوي', cls: 'bg-[#FCD201]/10 text-[#997500]', icon: <Snowflake className="w-3.5 h-3.5" /> },
    'كل الموسم': { label: 'كل الموسم', cls: 'bg-emerald-100 text-emerald-700', icon: <Sparkles className="w-3.5 h-3.5" /> },
};

export default function OfferProductsClient({ offer, products }: Props) {
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [activeImage, setActiveImage] = useState<number>(0);
    const router = useRouter();

    const handleOpenQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setActiveImage(0);
    };

    const addItem = (product: Product) => {
        const newItem: SelectedItem = {
            instanceId: Math.random().toString(36).substring(7),
            product,
            // Default to first size/color if only one is available
            size: product.sizes?.length === 1 ? product.sizes[0] : undefined,
            color: product.colors?.length === 1 ? product.colors[0] : undefined,
        };
        setSelectedItems([...selectedItems, newItem]);
        toast.success(`تمت إضافة ${product.name} إلى الباقة`);
    };

    const removeItem = (instanceId: string) => {
        setSelectedItems(selectedItems.filter(item => item.instanceId !== instanceId));
    };

    const updateItemOption = (instanceId: string, key: 'size' | 'color', value: string) => {
        setSelectedItems(selectedItems.map(item => 
            item.instanceId === instanceId ? { ...item, [key]: value } : item
        ));
    };

    const handleProceed = () => {
        if (selectedItems.length < offer.min_quantity) {
            toast.error(`يرجى اختيار ${offer.min_quantity} قطع على الأقل للاستفادة من العرض`);
            return;
        }

        // Check if all selected products have sizes/colors if required
        const missingOptions = selectedItems.filter(item =>
            (item.product.sizes?.length && !item.size) ||
            (item.product.colors?.length && !item.color)
        );

        if (missingOptions.length > 0) {
            toast.error("يرجى اختيار المقاس واللون لكل القطع في الباقة", {
                description: "بعض القطع المختارة تحتاج إلى تحديد الخيارات المطلوبة",
            });
            return;
        }

        // Proceed to checkout with offer data
        const params = new URLSearchParams();
        params.set('offer_id', offer.id.toString());
        params.set('items', JSON.stringify(selectedItems.map(item => ({
            p_id: item.product.id,
            size: item.size,
            color: item.color,
            qty: 1
        }))));

        router.push(`/checkout?${params.toString()}`);
    };

    const getProductCount = (productId: number) => {
        return selectedItems.filter(item => item.product.id === productId).length;
    };

    return (
        <div className="space-y-12 pb-32">
            {/* --- 1. Selection Progress & Summary --- */}
            <div className="sticky top-20 z-40 space-y-4">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 w-full lg:w-auto">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-all duration-500 ${selectedItems.length >= offer.min_quantity ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-[#FCD201] text-black shadow-lg shadow-[#FCD201]/30'}`}>
                                {selectedItems.length}
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900 dark:text-white">باقة العرض الخاصة بك</h3>
                                <p className="text-sm font-bold text-slate-500">
                                    {selectedItems.length < offer.min_quantity
                                        ? `تبقّى لك اختيار ${offer.min_quantity - selectedItems.length} قطع إضافية لتفعيل العرض`
                                        : `تم استيفاء الحد الأدنى! يمكنك الآن إتمام الطلب أو إضافة المزيد`
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <button
                                onClick={() => {
                                    const element = document.getElementById('bundle-items');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="hidden md:flex px-6 py-3.5 rounded-2xl font-black text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all items-center gap-2"
                            >
                                عرض تفاصيل الباقة ({selectedItems.length})
                            </button>
                            <button
                                onClick={handleProceed}
                                disabled={selectedItems.length < offer.min_quantity}
                                className={`flex-1 lg:flex-none px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl ${selectedItems.length >= offer.min_quantity
                                    ? 'bg-[#1a1a1a] text-white hover:scale-105 active:scale-95 shadow-slate-400/20'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                إتمام الطلب الآن
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out rounded-full ${selectedItems.length >= offer.min_quantity ? 'bg-emerald-500' : 'bg-[#FCD201]'}`}
                            style={{ width: `${Math.min((selectedItems.length / offer.min_quantity) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* --- 2. Bundle Details (If items selected) --- */}
            {selectedItems.length > 0 && (
                <div id="bundle-items" className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FCD201]/10 rounded-xl flex items-center justify-center text-[#997500]">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">تخصيص القطع المختارة</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {selectedItems.map((item, index) => (
                            <div 
                                key={item.instanceId}
                                className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col gap-5 shadow-sm hover:shadow-md transition-all relative group"
                            >
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
                                        {item.product.images?.[0] && (
                                            <Image src={item.product.images[0]} alt="" fill sizes="80px" className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md mb-1 inline-block">القطعة #{index + 1}</span>
                                            <button 
                                                onClick={() => removeItem(item.instanceId)}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                title="حذف من الباقة"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h5 className="font-black text-slate-800 dark:text-white truncate text-sm">{item.product.name}</h5>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Size Select */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 mr-1">المقاس</label>
                                        <div className="relative">
                                            <select 
                                                value={item.size || ""}
                                                onChange={(e) => updateItemOption(item.instanceId, 'size', e.target.value)}
                                                className={`w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border-2 rounded-xl py-2 px-3 appearance-none cursor-pointer outline-none transition-all ${item.size ? 'border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'border-red-100 dark:border-red-900/30 text-red-500'}`}
                                            >
                                                <option value="">اختر</option>
                                                {item.product.sizes?.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Color Select */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 mr-1">اللون</label>
                                        <div className="relative">
                                            <select 
                                                value={item.color || ""}
                                                onChange={(e) => updateItemOption(item.instanceId, 'color', e.target.value)}
                                                className={`w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border-2 rounded-xl py-2 px-3 appearance-none cursor-pointer outline-none transition-all ${item.color ? 'border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'border-red-100 dark:border-red-900/30 text-red-500'}`}
                                            >
                                                <option value="">اختر</option>
                                                {item.product.colors?.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 3. Products List --- */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">اختر المنتجات لإضافتها للعرض</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-400">يمكنك إضافة نفس المنتج أكثر من مرة بمقاسات وألوان مختلفة</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => {
                        const count = getProductCount(product.id);
                        
                        return (
                            <div
                                key={product.id}
                                className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                            >
                                {/* Quick View Button */}
                                <button
                                    onClick={() => handleOpenQuickView(product)}
                                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-black transition-all shadow-sm"
                                    title="مشاهدة التفاصيل"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>

                                {/* Item Count Badge */}
                                {count > 0 && (
                                    <div className="absolute top-4 left-4 z-20 bg-emerald-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 text-sm animate-in zoom-in-50">
                                        تم اختيار {count}
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="aspect-[4/3] overflow-hidden relative cursor-pointer" onClick={() => addItem(product)}>
                                    {product.images?.[0] && (
                                        <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <div className="bg-white text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <Plus className="w-5 h-5" />
                                            إضافة للباقة
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                                        <span className="text-lg font-black text-primary">{product.price.toLocaleString()} ج.م</span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => addItem(product)}
                                        className={`w-full py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 transition-all ${count > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-primary group-hover:text-black shadow-none group-hover:shadow-lg group-hover:shadow-primary/30'}`}
                                    >
                                        {count > 0 ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                إضافة قطعة أخرى
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                إضافة للباقة
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Empty State */}
            {products.length === 0 && (
                <div className="text-center py-40">
                    <ShoppingBag className="w-20 h-20 mx-auto text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-slate-400">لا توجد منتجات حالياً</h3>
                </div>
            )}

            {/* Quick View Modal */}
            {quickViewProduct && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 md:pt-32">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setQuickViewProduct(null)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 scrollbar-hide border border-slate-100 dark:border-slate-800">
                        <button 
                            onClick={() => setQuickViewProduct(null)}
                            className="absolute top-6 left-6 z-20 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
                            <div className="md:col-span-5 space-y-6">
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-inner">
                                    {quickViewProduct.images?.[activeImage] && (
                                        <Image src={quickViewProduct.images[activeImage]} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition-all duration-500" />
                                    )}
                                </div>
                                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {quickViewProduct.images.map((img, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setActiveImage(i)}
                                                className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="md:col-span-7 space-y-8 text-right" dir="rtl">
                                <div className="space-y-4">
                                    {quickViewProduct.season && seasonBadge[quickViewProduct.season] && (
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${seasonBadge[quickViewProduct.season].cls}`}>
                                            {seasonBadge[quickViewProduct.season].icon}
                                            {seasonBadge[quickViewProduct.season].label}
                                        </span>
                                    )}
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{quickViewProduct.name}</h2>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-[#997500] dark:text-[#FCD201]">{quickViewProduct.price.toLocaleString()}</span>
                                        <span className="text-xl font-bold text-slate-400">ج.م</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        <h4 className="text-lg font-black">وصف المنتج</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                                        {quickViewProduct.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">توصيل سريع</p>
                                            <p className="text-xs font-bold text-slate-500">3-5 أيام عمل</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">حق المعاينة</p>
                                            <p className="text-xs font-bold text-slate-500">عاينى شحنتك قبل الاستلام</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        addItem(quickViewProduct);
                                        setQuickViewProduct(null);
                                    }}
                                    className="w-full py-5 bg-[#1a1a1a] dark:bg-[#FCD201] text-white dark:text-black font-black text-xl rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Plus className="w-6 h-6" />
                                    إضافة للباقة الآن
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
