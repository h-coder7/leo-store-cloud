import React from 'react';
import { addSection } from '@/app/actions/products';
import Link from 'next/link';
import SectionSubmitButton from '@/components/admin/SectionSubmitButton';
import CompressedImageInput from '@/components/admin/CompressedImageInput';

export default function AddSectionPage() {
    return (
        <div className="p-8 max-w-2xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">إضافة قسم جديد</h1>
                    <p className="text-slate-500 mt-1">أدخل بيانات القسم لإضافته إلى المتجر</p>
                </div>
                <Link
                    href="/admin/sections"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm flex items-center gap-1 transition-colors"
                >
                    ← العودة للأقسام
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow p-8">
                <form action={addSection} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            اسم القسم <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                            placeholder="مثال: قمصان — بناطيل — فساتين"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            صورة القسم (اختياري)
                        </label>
                        <CompressedImageInput
                            id="image"
                            name="image"
                            accept="image/*"
                            compressOptions={{ maxWidth: 1000, quality: 0.8 }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">سيتم ضغط الصورة تلقائياً قبل الرفع</p>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 flex justify-end gap-4">
                        <Link
                            href="/admin/sections"
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            إلغاء
                        </Link>
                        <SectionSubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
