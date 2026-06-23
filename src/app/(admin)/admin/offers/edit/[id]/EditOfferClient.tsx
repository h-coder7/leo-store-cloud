"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { updateOffer } from '@/app/actions/offers';
import { ArrowLeft, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Offer } from '@/lib/supabase/types';
import { compressImage } from '@/lib/image/compress';

interface Props {
    offer: Offer;
}

export default function EditOfferClient({ offer }: Props) {
    const [fileError, setFileError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [offerType, setOfferType] = useState<string>(offer.type || 'free_shipping');
    const [isPending, setIsPending] = useState(false);
    const isSubmitting = useRef(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError(null);
        setFileName(null);

        if (file) {
            setFileName(file.name);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (isSubmitting.current) return;

        const file = formData.get('image');
        if (file instanceof File && file.size > 0) {
            const compressed = await compressImage(file, { maxWidth: 1280, quality: 0.8 });
            formData.set('image', compressed);
        }

        isSubmitting.current = true;
        setIsPending(true);
        try {
            const result = await updateOffer(offer.id, formData);
            if (result?.success) {
                toast.success("تم تحديث العرض بنجاح");
                window.location.href = '/admin/offers';
            } else {
                throw new Error("فشل تحديث العرض");
            }
        } catch (error) {
            console.error("Update offer error:", error);
            const message = error instanceof Error ? error.message : "";
            toast.error("حدث خطأ أثناء تحديث العرض: " + message);
            setIsPending(false);
            isSubmitting.current = false;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto" dir="rtl">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">تعديل العرض</h1>
                    <p className="text-slate-500 mt-1 text-sm">تعديل بيانات العرض الحالي</p>
                </div>
                <Link
                    href="/admin/offers"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    رجوع
                </Link>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="current_image_url" value={offer.image_url} />
                
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">عنوان العرض</label>
                            <input
                                name="title"
                                type="text"
                                defaultValue={offer.title}
                                placeholder="مثال: عروض الشتوى"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">علامة الخصم (Label)</label>
                            <input
                                name="discount_label"
                                type="text"
                                defaultValue={offer.discount_label}
                                placeholder="مثال: خصم 10%"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">نوع العرض</label>
                            <select
                                name="type"
                                value={offerType}
                                onChange={(e) => setOfferType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all font-bold"
                            >
                                <option value="free_shipping">شحن مجاني</option>
                                <option value="percentage">خصم نسبة مئوية (%)</option>
                                <option value="fixed_amount">خصم مبلغ ثابت</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">الحد الأدنى للكمية</label>
                            <input
                                name="min_quantity"
                                type="number"
                                min="1"
                                defaultValue={offer.min_quantity}
                                placeholder="مثال: 2"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>

                        {offerType !== 'free_shipping' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">قيمة الخصم</label>
                                <input
                                    name="discount_value"
                                    type="number"
                                    step="0.01"
                                    defaultValue={offer.discount_value || 0}
                                    placeholder={offerType === 'percentage' ? "مثال: 10" : "مثال: 50"}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all font-bold"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    name="is_free_shipping"
                                    type="checkbox"
                                    value="true"
                                    disabled={offerType === 'free_shipping'}
                                    defaultChecked={offer.is_free_shipping || offerType === 'free_shipping'}
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 transition-all checked:bg-primary checked:border-primary disabled:opacity-50"
                                />
                                <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-black transition-colors ${offerType === 'free_shipping' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-primary'}`}>إلغاء مصاريف الشحن</span>
                                <span className="text-[11px] text-slate-500 font-bold">تفعيل الشحن المجاني لهذا العرض</span>
                            </div>
                        </label>
                    </div>

                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">نص العرض البسيط</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={offer.description}
                            placeholder="مثال: الحق العروض على الملابس الشتوى قبل انتهاء الموسم"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">تغيير الصورة (اختياري)</label>
                            <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${fileError ? 'border-red-300 bg-red-50' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <ImageIcon className={`w-8 h-8 mx-auto mb-2 ${fileError ? 'text-red-400' : 'text-slate-300'}`} />
                                <p className={`text-xs font-bold ${fileError ? 'text-red-600' : 'text-slate-500'}`}>
                                    {fileName || (fileError ? fileError : "اضغط لتغيير الصورة")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1 text-center block">الصورة الحالية</label>
                            <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <img src={offer.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={!!fileError || isPending}
                        className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${fileError || isPending ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-primary hover:opacity-90 text-primary-foreground'}`}
                    >
                        {isPending ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري التحديث...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                تحديث العرض
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
