"use client";

import React, { useState, useRef } from 'react';
import { addProduct } from '@/app/actions/products';
import Link from 'next/link';
import { ImageIcon, AlertCircle, Save, Ruler, Tag, Plus, Trash2, X } from 'lucide-react';
import type { ProductOffer, Section } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { compressImage, compressImages } from '@/lib/image/compress';

import { isRedirectError } from 'next/dist/client/components/redirect-error';

const SIZES = [
    '1 شهر', '3 شهور', '6 شهور', '9 شهور', '12 شهر', '18 شهر', '24 شهر',
    'سنتين', '3 سنوات', '4 سنوات', '5 سنوات', '6 سنوات',
    '7 سنوات', '8 سنوات', '9 سنوات', '10 سنوات', '12 سنة',
    '14 سنة', '16 سنة', '18 سنة', '20 سنة'
];
const COLORS = [
    { label: 'اسود', value: 'اسود', hex: '#000000' },
    { label: 'ابيض', value: 'ابيض', hex: '#ffffff' },
    { label: 'اوف وايت', value: 'اوف وايت', hex: '#fdf5e6' },
    { label: 'بيج', value: 'بيج', hex: '#d4b896' },
    { label: 'بني', value: 'بني', hex: '#4b2c20' },
    { label: 'بينك', value: 'بينك', hex: '#ffc0cb' },
    { label: 'فوشيا', value: 'فوشيا', hex: '#F11EA9' },
    { label: 'تركواز', value: 'تركواز', hex: '#32B4B2' },
    { label: 'اورنج', value: 'اورنج', hex: '#ff8c00' },
    { label: 'احمر', value: 'احمر', hex: '#ff0000' },
    { label: 'موف', value: 'موف', hex: '#9370db' },
    { label: 'اخضر', value: 'اخضر', hex: '#008000' },
    { label: 'لبني', value: 'لبني', hex: '#add8e6' },
    { label: 'ازرق', value: 'ازرق', hex: '#0000ff' },
    { label: 'برجندي', value: 'برجندي', hex: '#800020' },
    { label: 'زيتي', value: 'زيتي', hex: '#556b2f' },
    { label: 'رمادي', value: 'رمادي', hex: '#808080' },
];

export default function AddProductClient({ sections }: { sections: Section[] }) {
    const [fileError, setFileError] = useState<string | null>(null);
    const [selectedFilesCount, setSelectedFilesCount] = useState(0);
    const [sizeChartFile, setSizeChartFile] = useState<File | null>(null);
    const [showOffer, setShowOffer] = useState(false);
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    const [colorSizes, setColorSizes] = useState<Record<string, string[]>>({});
    const [activeColorForSizes, setActiveColorForSizes] = useState<{ label: string; value: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setFileError(null);
        setSelectedFilesCount(files?.length ?? 0);
    };

    const handleSubmit = async (formData: FormData) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setLocalSubmitting(true);

        const data = new FormData();
        formData.forEach((value, key) => {
            if (key !== 'colors' && key !== 'sizes' && key !== 'images' && key !== 'size_chart_image') {
                data.append(key, value);
            }
        });

        // Compress product images to WebP before upload (less Supabase data).
        const rawImages = (formData.getAll('images') as File[]).filter(
            (f) => f instanceof File && f.size > 0
        );
        const compressedImages = await compressImages(rawImages, { maxWidth: 1280, quality: 0.8 });
        for (const img of compressedImages) data.append('images', img);

        // Compress the size-chart image too (kept a bit sharper for readability).
        const chart = formData.get('size_chart_image');
        if (chart instanceof File && chart.size > 0) {
            const compressedChart = await compressImage(chart, { maxWidth: 1400, quality: 0.85 });
            data.append('size_chart_image', compressedChart);
        }

        data.append('color_sizes', JSON.stringify(colorSizes));

        try {
            await addProduct(data);
            toast.success("تم إضافة المنتج بنجاح");
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }
            toast.error("حدث خطأ أثناء حفظ المنتج");
        } finally {
            isSubmittingRef.current = false;
            setLocalSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">إضافة منتج جديد</h1>
                    <p className="text-slate-500 mt-1">أدخل بيانات المنتج ليُضاف إلى المتجر</p>
                </div>
                <Link
                    href="/admin/products"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold flex items-center gap-1 transition-colors"
                >
                    ← العودة للمنتجات
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow p-8">
                <form action={handleSubmit} className="space-y-8">

                    {/* Name + Price + Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                                اسم المنتج <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                                placeholder="مثال: قميص صيفي قطني"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                                وصف المنتج
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold resize-none"
                                placeholder="أدخل وصفاً تفصيلياً للمنتج..."
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                                السعر (ج.م) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                step="0.01"
                                min="0"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="section_id" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                                القسم
                            </label>
                            <select
                                id="section_id"
                                name="section_id"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                            >
                                <option value="">— بدون قسم —</option>
                                {sections.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Season */}
                    <div>
                        <p className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 mr-1">الموسم</p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { val: '', label: 'غير محدد' },
                                { val: 'صيف', label: '☀️ صيف' },
                                { val: 'شتاء', label: '❄️ شتاء' },
                                { val: 'كل الموسم', label: '🌀 كل الموسم' },
                            ].map(({ val, label }) => (
                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="season" value={val} defaultChecked={val === ''} className="accent-primary" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* الألوان والمقاسات المرتبطة */}
                    <div>
                        <p className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 mr-1">الألوان المتاحة</p>
                        <p className="block text-xs text-slate-400 mb-4 mr-1">اضغط على اللون لتحديد المقاسات المتاحة له</p>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map(({ label, value, hex }) => {
                                const selectedSizes = colorSizes[value] || [];
                                const isSelected = selectedSizes.length > 0;
                                return (
                                    <div
                                        key={value}
                                        onClick={() => setActiveColorForSizes({ label, value })}
                                        className={`cursor-pointer flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 transition-all select-none min-w-[140px] relative
                                            ${isSelected 
                                                ? 'border-primary bg-primary/5 text-primary dark:border-primary' 
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0"
                                                style={{ backgroundColor: hex }}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black">{label}</span>
                                                {isSelected && (
                                                    <span className="text-[10px] opacity-80 font-bold mt-0.5">
                                                        {selectedSizes.length} مقاسات
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newColorSizes = { ...colorSizes };
                                                    delete newColorSizes[value];
                                                    setColorSizes(newColorSizes);
                                                }}
                                                className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors shrink-0"
                                                title="إلغاء هذا اللون"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label htmlFor="images" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                            صور المنتج
                        </label>
                        <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${fileError ? 'border-red-300 bg-red-50' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <ImageIcon className={`w-10 h-10 mx-auto mb-2 ${fileError ? 'text-red-400' : 'text-slate-300'}`} />
                            <p className={`text-sm font-bold ${fileError ? 'text-red-600' : 'text-slate-500'}`}>
                                {selectedFilesCount > 0 ? `تم اختيار ${selectedFilesCount} صور` : (fileError ? fileError : "اسحب الصور أو اضغط هنا للاختيار")}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">تستطيع اختيار أكثر من صورة — سيتم ضغط الصور تلقائياً قبل الرفع</p>
                        </div>
                        {fileError && (
                            <div className="flex items-center gap-2 text-red-600 text-xs font-bold mt-2 px-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{fileError}</span>
                            </div>
                        )}
                    </div>

                    {/* Size Chart Image */}
                    <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/10">
                        <label htmlFor="size_chart_image" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                            صورة جدول المقاسات (اختياري)
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="file"
                                    id="size_chart_image"
                                    name="size_chart_image"
                                    accept="image/*"
                                    onChange={(e) => setSizeChartFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 font-bold">
                                    <Ruler className="w-5 h-5 text-primary" />
                                    <span>{sizeChartFile ? sizeChartFile.name : "اختر صورة جدول المقاسات"}</span>
                                </div>
                            </div>
                            {sizeChartFile && (
                                <button
                                    type="button"
                                    onClick={() => setSizeChartFile(null)}
                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                    حذف
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">هذه الصورة ستظهر عند الضغط على زر - جدول المقاسات - في صفحة المنتج</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <Link
                            href="/admin/products"
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            إلغاء
                        </Link>
                        <button
                            type="submit"
                            disabled={!!fileError || localSubmitting}
                            className="bg-primary hover:opacity-90 text-primary-foreground font-black py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {localSubmitting ? (
                                <>
                                    <span className="inline-block animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    حفظ المنتج
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {activeColorForSizes && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setActiveColorForSizes(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>مقاسات اللون:</span>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">{activeColorForSizes.label}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setActiveColorForSizes(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6 max-h-[40vh] overflow-y-auto p-1">
                            {SIZES.map((size) => {
                                const isSelected = colorSizes[activeColorForSizes.value]?.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            const currentSizes = colorSizes[activeColorForSizes.value] || [];
                                            const newSizes = currentSizes.includes(size)
                                                ? currentSizes.filter(s => s !== size)
                                                : [...currentSizes, size];
                                            setColorSizes(prev => ({
                                                ...prev,
                                                [activeColorForSizes.value]: newSizes
                                            }));
                                        }}
                                        className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all select-none text-center
                                            ${isSelected 
                                                ? 'border-primary bg-primary/10 text-primary' 
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const newColorSizes = { ...colorSizes };
                                    delete newColorSizes[activeColorForSizes.value];
                                    setColorSizes(newColorSizes);
                                    setActiveColorForSizes(null);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                                إزالة اللون
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveColorForSizes(null)}
                                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs transition-all hover:scale-105 active:scale-95 shadow"
                            >
                                تأكيد
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
