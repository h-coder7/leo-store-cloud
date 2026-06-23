"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Truck, Smartphone, Wallet, CheckCircle2, Upload, Phone, ChevronDown, PartyPopper, ShoppingBag, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { useLeadCapture } from '@/hooks/useLeadCapture';

export type OfferInfo = {
    title?: string;
    type?: string;
    discount?: number;
    quantity?: number;
    min_quantity?: number;
    global?: boolean;
    is_free_shipping?: boolean;
};

type CheckoutItem = {
    id: number;
    quantity: number;
    size: string;
    color: string;
    product: {
        id: number;
        name: string;
        price: number;
        images: string[] | null;
    };
    offer_info?: OfferInfo;
};

import { createOrder } from '@/app/actions/orders';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/app/actions/settings';

import { egyptGovernorates } from '@/lib/data/egypt-regions';

const governoratePrices: Record<string, number> = {
    "القاهرة": 90, "اسكندرية": 90, "الجيزة": 90, "السويس": 90, "الاسماعيلية": 90, "الدقهلية": 90, "بورسعيد": 90, "المنوفية": 90, "كفر الشيخ": 90, "البحيرة": 90, "الغربية": 90, "الشرقية": 90, "القليوبية": 90,
    "الفيوم": 125, "بني سويف": 125, "المنيا": 125, "اسيوط": 125, "سوهاج": 125, "قنا": 125, "الاقصر": 125, "اسوان": 125,
    "البحر الاحمر": 160, "الغردقة": 160, "الوادي الجديد": 160,
    "الجونة": 170, "الساحل الشمالي": 170, "شرم الشيخ": 170, "دهب": 170, "مرسي علم": 170, "سفاجا": 170,
    "راس غارب": 180, "حلايب وشلاتين": 200
};

const governorateRegions: Record<string, Record<string, number>> = {
    "دمياط": { "دمياط الجديدة": 35, "كفر البطيخ": 50, "دمياط القديمة": 50, "راس البر": 50, "عزبة البرج": 55, "مركز فارسكور": 60, "الزرقاء وضواحيها": 70, "كفر سعد وضواحيها": 70, "جمصة": 75, "جامعة الدلتا": 75, "المنصورة الجديدة": 80 },
    ...Object.entries(egyptGovernorates).reduce((acc, [gov, regions]) => {
        if (gov === "دمياط") return acc;
        acc[gov] = regions.reduce((regAcc, reg) => {
            regAcc[reg] = governoratePrices[gov] || 90;
            return regAcc;
        }, {} as Record<string, number>);
        return acc;
    }, {} as Record<string, Record<string, number>>)
};

export default function CheckoutClient({ initialItems, settings }: { initialItems: CheckoutItem[], settings: SiteSettings | null }) {
    const router = useRouter();
    const clearCart = useCartStore((state) => state.clearCart);
    const { autoSave, markAsCompleted } = useLeadCapture();

    const [isMounted, setIsMounted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vodafone' | 'instapay'>('cod');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        governorate: '',
        region: '',
        transferNumber: '',
    });
    const [transferImage, setTransferImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const subtotal = initialItems.reduce((acc, item) => {
        const price = Number(item.product?.price) || 0;
        const quantity = Number(item.quantity) || 1;
        let itemPrice = price;

        if (item.offer_info) {
            if (item.offer_info.type === 'percentage') {
                const discount = Number(item.offer_info.discount) || 0;
                itemPrice = price * (1 - (discount / 100));
            } else if (item.offer_info.type === 'fixed_amount') {
                const discount = Number(item.offer_info.discount) || 0;
                itemPrice = Math.max(0, price - discount);
            }
        }
        return acc + (itemPrice * quantity);
    }, 0);

    const hasFreeShipping = initialItems.some(item =>
        item.offer_info?.type === 'free_shipping' ||
        item.offer_info?.is_free_shipping === true ||
        (Number(item.quantity) >= 2 && item.offer_info && !item.offer_info.global)
    );

    const shippingFee = (formData.governorate && formData.region && !hasFreeShipping)
        ? (governorateRegions[formData.governorate]?.[formData.region] || 0)
        : 0;
    const total = subtotal + shippingFee;

    const governorates = Object.keys(governorateRegions);

    if (!isMounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.phone || !formData.governorate || !formData.region) {
            toast.error("يرجى ملأ جميع الحقول المطلوبة");
            return;
        }

        setIsLoading(true);

        try {
            let transfer_image_url = '';

            if (transferImage && (paymentMethod === 'vodafone' || paymentMethod === 'instapay')) {
                setUploading(true);
                const supabase = createClient();
                const fileExt = transferImage.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `transfers/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('images')
                    .upload(filePath, transferImage);

                if (uploadError) {
                    throw new Error("فشل رفع صورة التحويل");
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                transfer_image_url = publicUrl;
                setUploading(false);
            }

            const orderData = {
                customer_name: formData.name,
                phone: formData.phone,
                address: formData.address,
                governorate: `${formData.governorate} - ${formData.region}`,
                payment_method: paymentMethod,
                total: total,
                transfer_number: formData.transferNumber,
                transfer_image_url: transfer_image_url,
                items: initialItems.map(item => ({
                    product_id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: item.product.images?.[0] || ""
                }))
            };

            const result = await createOrder(orderData);

            if (result.success) {
                await markAsCompleted();
                clearCart();
                setIsSuccess(true);
                toast.success("تم إرسال طلبك بنجاح!");
            } else {
                toast.error(result.error || "حدث خطأ أثناء إتمام الطلب");
            }
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 sm:p-20 shadow border border-slate-100 dark:border-slate-700 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 justify-center">
                        تم إرسال طلبك بنجاح!
                        <PartyPopper className="w-8 h-8 text-[#FCD201]" />
                    </h2>
                    <p className="text-lg sm:text-xl font-bold text-slate-500 leading-relaxed max-w-md mx-auto">
                        نشكرك لثقتك بنا. سيتم التواصل معك خلال وقت قصير لتأكيد تفاصيل الأوردر وموعد التوصيل.
                    </p>
                </div>
                <div className="pt-8">
                    <button
                        onClick={() => router.push('/')}
                        className="px-10 py-4 bg-[#FCD201] hover:bg-[#ebd201] text-[#1a1a1a] font-black text-lg rounded-2xl transition-all shadow shadow-[#FCD201]/20 active:scale-95"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── 1. Customer Info ── */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow border border-slate-100 dark:border-slate-700 space-y-8">
                <h3 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 bg-[#FCD201] text-[#1a1a1a] rounded-full flex items-center justify-center text-sm">1</span>
                    بيانات الشحن
                </h3>

                {/* Name Input */}
                <div className="space-y-3">
                    <label className="text-sm font-black text-slate-800 dark:text-slate-200 mr-2 flex items-center gap-2">
                        <span>الاسم بالكامل</span>
                        <span className="text-[#FCD201]">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="الاسم بالكامل"
                        value={formData.name}
                        onChange={(e) => {
                            const newName = e.target.value;
                            setFormData({ ...formData, name: newName });
                            autoSave(newName, formData.phone);
                        }}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-[#FCD201] outline-none transition-all font-bold"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Governorate Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800 dark:text-slate-200 mr-2 flex items-center gap-2">
                            <span>المحافظة</span>
                            <span className="text-[#FCD201]">*</span>
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={formData.governorate}
                                onChange={(e) => {
                                    const selectedGov = e.target.value;
                                    const regions = Object.keys(governorateRegions[selectedGov] || {});
                                    const defaultRegion = regions.length === 1 ? regions[0] : '';
                                    setFormData({ ...formData, governorate: selectedGov, region: defaultRegion });
                                }}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-[#FCD201] outline-none transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="">اختر المحافظة</option>
                                {governorates.map((gov) => (
                                    <option key={gov} value={gov}>{gov}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>

                    {/* Region Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800 dark:text-slate-200 mr-2 flex items-center gap-2">
                            <span>المنطقة</span>
                            <span className="text-[#FCD201]">*</span>
                        </label>
                        <div className="relative">
                            <select
                                required
                                disabled={!formData.governorate}
                                value={formData.region}
                                onChange={(e) => {
                                    const selectedRegion = e.target.value;
                                    setFormData({ ...formData, region: selectedRegion });
                                }}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-[#FCD201] outline-none transition-all font-bold appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">اختر المنطقة</option>
                                {Object.keys(governorateRegions[formData.governorate] || {}).map((region) => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Address Input */}
                <div className="space-y-3">
                    <label className="text-sm font-black text-slate-800 dark:text-slate-200 mr-2 flex items-center gap-2">
                        <span>العنوان بالتفصيل</span>
                        <span className="text-[#FCD201]">*</span>
                    </label>
                    <textarea
                        required
                        rows={2}
                        placeholder="العنوان بالتفصيل (اسم الشارع / رقم العمارة / علامة مميزة)"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-[#FCD201] outline-none transition-all font-bold resize-none"
                    ></textarea>
                </div>

                {/* Phone Input */}
                <div className="space-y-3">
                    <label className="text-sm font-black text-slate-800 dark:text-slate-200 mr-2 flex items-center gap-2">
                        <span>رقم الهاتف (واتساب)</span>
                        <span className="text-[#FCD201]">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            required
                            placeholder="رقم الهاتف (واتساب)"
                            value={formData.phone}
                            onChange={(e) => {
                                const newPhone = e.target.value;
                                setFormData({ ...formData, phone: newPhone });
                                autoSave(formData.name, newPhone);
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-[#FCD201] outline-none transition-all font-bold pl-12"
                        />
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                    <p className="text-[10px] text-slate-400 mr-2 italic">
                        * سيتم حفظ بياناتك تلقائياً لمساعدتك في إكمال الطلب لاحقاً.
                    </p>
                </div>
            </div>

            {/* ── 2. Product Summary & Totals ── */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow border border-slate-100 dark:border-slate-700 overflow-hidden">
                <h3 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-3 p-8 pb-4">
                    <span className="w-8 h-8 bg-[#FCD201] text-[#1a1a1a] rounded-full flex items-center justify-center text-sm">2</span>
                    ملخص المنتجات
                </h3>

                {/* Desktop Header (Hidden on Mobile) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-5 bg-[#FCD201]/10 text-[#1a1a1a] dark:text-[#FCD201] font-black text-xs uppercase tracking-wider">
                    <div className="col-span-6 pr-4">المنتج</div>
                    <div className="col-span-2 text-center">المقاس / اللون</div>
                    <div className="col-span-2 text-center">الكمية</div>
                    <div className="col-span-2 text-center">السعر</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {initialItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-6 sm:p-5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                            {/* Product Info */}
                            <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                                <div className="relative w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden border-2 border-slate-100 dark:border-slate-700 shrink-0">
                                    {item.product.images?.[0] ? (
                                        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="64px" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base line-clamp-2 leading-snug">
                                        {item.product.name}
                                    </span>
                                    {item.offer_info && (
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-lg">
                                                {item.offer_info.title}
                                            </span>
                                        </div>
                                    )}
                                    {/* Mobile-only badges */}
                                    <div className="sm:hidden flex gap-2 mt-1">
                                        {item.size && <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-500">مقاس: {item.size}</span>}
                                        {item.color && <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-500">لون: {item.color}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Attributes (Desktop) */}
                            <div className="hidden sm:col-span-2 sm:flex flex-col items-center gap-1">
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                                    {item.size || '-'} / {item.color || '-'}
                                </span>
                            </div>

                            {/* Quantity */}
                            <div className="col-span-1 sm:col-span-2 flex sm:justify-center items-center gap-3">
                                <span className="sm:hidden text-xs font-bold text-slate-400">الكمية:</span>
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-700 dark:text-slate-300">
                                    {item.quantity}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="col-span-1 sm:col-span-2 flex sm:justify-center items-center gap-3">
                                <span className="sm:hidden text-xs font-bold text-slate-400">السعر:</span>
                                <div className="flex flex-col sm:items-center">
                                    <span className={`font-black text-sm sm:text-base ${item.offer_info?.type === 'percentage' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1a1a1a] dark:text-[#FCD201]'}`}>
                                        {(() => {
                                            const price = Number(item.product?.price) || 0;
                                            const quantity = Number(item.quantity) || 1;
                                            let finalPrice = price;
                                            if (item.offer_info) {
                                                if (item.offer_info.type === 'percentage') {
                                                    const discount = Number(item.offer_info.discount) || 0;
                                                    finalPrice = price * (1 - (discount / 100));
                                                } else if (item.offer_info.type === 'fixed_amount') {
                                                    const discount = Number(item.offer_info.discount) || 0;
                                                    finalPrice = Math.max(0, price - discount);
                                                }
                                            }
                                            return (finalPrice * quantity).toLocaleString();
                                        })()} <span className="text-[10px] sm:text-xs">ج.م</span>
                                    </span>
                                    {(item.offer_info?.type === 'percentage' || item.offer_info?.type === 'fixed_amount') && (
                                        <span className="text-[10px] text-slate-400 line-through">
                                            {(Number(item.product?.price || 0) * Number(item.quantity || 1)).toLocaleString()} ج.م
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 space-y-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center text-slate-500 font-bold">
                        <span className="text-sm">الإجمالي الفرعي</span>
                        <span>{subtotal.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">مصاريف الشحن</span>
                        {hasFreeShipping ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">مجاناً (ضمن العرض)</span>
                                <span className="text-sm font-bold text-slate-300 line-through">{governorateRegions[formData.governorate]?.[formData.region] || 0} ج.م</span>
                            </div>
                        ) : shippingFee > 0 ? (
                            <span className="font-black text-emerald-600 dark:text-emerald-400">{shippingFee} ج.م</span>
                        ) : (
                            <span className="text-xs font-bold text-slate-400 italic">يتم حسابه عند اختيار المنطقة</span>
                        )}
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-black text-slate-800 dark:text-white uppercase tracking-widest">الإجمالي النهائي</span>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-[#1a1a1a] dark:text-[#FCD201]">{total.toLocaleString()}</span>
                            <span className="text-sm font-bold text-slate-400">ج.م</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3. Payment Methods ── */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow border border-slate-100 dark:border-slate-700 space-y-6">
                <h3 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 bg-[#FCD201] text-[#1a1a1a] rounded-full flex items-center justify-center text-sm">3</span>
                    وسيلة الدفع
                </h3>

                <div className="grid grid-cols-1 gap-4 mt-6">
                    {/* COD */}
                    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#FCD201] bg-[#FCD201]/10' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                            <Truck className={paymentMethod === 'cod' ? 'text-yellow-600' : 'text-slate-400'} />
                            <span className="font-bold">الدفع عند الاستلام</span>
                        </div>
                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-yellow-600' : 'border-slate-300'}`}>
                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-yellow-600"></div>}
                        </div>
                    </label>

                    {/* Vodafone Cash */}
                    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'vodafone' ? 'border-[#FCD201] bg-[#FCD201]/10' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                            <Wallet className={paymentMethod === 'vodafone' ? 'text-yellow-600' : 'text-slate-400'} />
                            <span className="font-bold">فودافون كاش</span>
                        </div>
                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'vodafone'} onChange={() => setPaymentMethod('vodafone')} />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vodafone' ? 'border-yellow-600' : 'border-slate-300'}`}>
                            {paymentMethod === 'vodafone' && <div className="w-2.5 h-2.5 rounded-full bg-yellow-600"></div>}
                        </div>
                    </label>

                    {/* InstaPay */}
                    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'instapay' ? 'border-[#FCD201] bg-[#FCD201]/10' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                            <Smartphone className={paymentMethod === 'instapay' ? 'text-yellow-600' : 'text-slate-400'} />
                            <span className="font-bold">إنستا باي</span>
                        </div>
                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'instapay' ? 'border-yellow-600' : 'border-slate-300'}`}>
                            {paymentMethod === 'instapay' && <div className="w-2.5 h-2.5 rounded-full bg-yellow-600"></div>}
                        </div>
                    </label>
                </div>

                {/* Transfer Extra Details (For Vodafone and InstaPay) */}
                {(paymentMethod === 'instapay' || paymentMethod === 'vodafone') && (
                    <div className="mt-6 p-6 rounded-[2rem] border-2 border-dashed border-[#FCD201]/40 bg-[#FCD201]/5 dark:bg-[#FCD201]/5 space-y-5 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <p className="font-black text-slate-700 dark:text-slate-200 text-sm">
                                <span className="text-lg">📱</span> حول على رقم {paymentMethod === 'instapay' ? 'إنستا باي' : 'فودافون كاش'}: <span className="text-yellow-600 underline">
                                    {paymentMethod === 'instapay' ? settings?.instapay_number : settings?.vodafone_cash}
                                </span>
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 mr-2">رقم المحول منه</label>
                                <input
                                    type="text"
                                    placeholder="رقم المحول منه"
                                    value={formData.transferNumber}
                                    onChange={(e) => setFormData({ ...formData, transferNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#FCD201] transition-all font-bold text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 mr-2">صورة التحويل</label>
                                <div className="relative group">
                                    <div className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-400 group-hover:border-[#FCD201] transition-colors">
                                        <span className="text-xs font-bold truncate">
                                            {transferImage ? transferImage.name : 'اختر الصورة'}
                                        </span>
                                        <Upload className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setTransferImage(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── 4. Submit Button ── */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#FCD201] hover:bg-[#ebd201] text-[#1a1a1a] font-black text-xl rounded-2xl shadow shadow-[#FCD201]/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
            >
                {isLoading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-bold">
                            {uploading ? 'جاري رفع صورة التحويل...' : 'جاري تأكيد طلبك...'}
                        </span>
                    </div>
                ) : (
                    <>
                        <span>تأكيد الطلب</span>
                        <CheckCircle2 className="w-6 h-6" />
                    </>
                )}
            </button>

        </form>
    );
}
