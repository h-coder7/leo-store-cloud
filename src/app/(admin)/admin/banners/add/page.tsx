"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { addBanner } from '@/app/actions/banners';
import { ArrowLeft, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { compressImage } from '@/lib/image/compress';

export default function AddBannerPage() {
    const [fileError, setFileError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
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
        // Banner is a wide hero image → allow a larger width.
        if (file instanceof File && file.size > 0) {
            const compressed = await compressImage(file, { maxWidth: 1920, quality: 0.8 });
            formData.set('image', compressed);
        }

        isSubmitting.current = true;
        setIsPending(true);
        try {
            const result = await addBanner(formData);
            if (result?.success) {
                toast.success("تم إضافة البنر بنجاح");
                window.location.href = '/admin/banners';
            } else {
                throw new Error("فشل إضافة البنر");
            }
        } catch (error) {
            console.error("Add banner error:", error);
            const message = error instanceof Error ? error.message : "";
            toast.error(message ? `حدث خطأ أثناء إضافة البنر: ${message}` : "حدث خطأ أثناء إضافة البنر");
            setIsPending(false);
            isSubmitting.current = false;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto" dir="rtl">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">إضافة بنر جديد</h1>
                    <p className="text-slate-500 mt-1 text-sm">قم بتعبئة بيانات العرض ليظهر في واجهة المتجر</p>
                </div>
                <Link
                    href="/admin/banners"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    رجوع
                </Link>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow border border-slate-100 dark:border-slate-700">

                    {/* Hidden default fields */}
                    <input type="hidden" name="title" value="Banner" />
                    <input type="hidden" name="description" value="" />
                    <input type="hidden" name="button_text" value="تسوق الآن" />
                    <input type="hidden" name="link_url" value="/products" />
                    <input type="hidden" name="color" value="" />

                    <div className="space-y-4">
                        <label className="text-lg font-black text-slate-700 dark:text-slate-300 px-1">صورة البنر</label>
                        <div className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${fileError ? 'border-red-300 bg-red-50' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <ImageIcon className={`w-16 h-16 mx-auto mb-4 ${fileError ? 'text-red-400' : 'text-slate-300'}`} />
                            <p className={`text-lg font-black ${fileError ? 'text-red-600' : 'text-slate-500'}`}>
                                {fileName || (fileError ? fileError : "اسحب الصورة أو اضغط هنا للاختيار")}
                            </p>
                            <p className="text-sm text-slate-400 mt-2 font-bold">سيتم ضغط الصورة تلقائياً قبل الرفع</p>
                        </div>
                        {fileError && (
                            <div className="flex items-center gap-2 text-red-600 text-sm font-bold mt-2 px-1">
                                <AlertCircle className="w-5 h-5" />
                                <span>{fileError}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={!!fileError || isPending}
                        className={`px-8 py-3 rounded-xl font-black transition-all shadow-md flex items-center gap-2 active:scale-95 ${fileError || isPending ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-primary hover:opacity-90 text-primary-foreground shadow-primary/20'}`}
                    >
                        {isPending ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                حفظ ونشر البنر
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
