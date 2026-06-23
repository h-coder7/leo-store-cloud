"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { updateProduct } from '@/app/actions/products';
import { ImageIcon, AlertCircle, Save, ArrowRight, Ruler } from 'lucide-react';
import type { Section, Product } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { compressImage, compressImages } from '@/lib/image/compress';
import ColorSizesEditor from '@/components/admin/ColorSizesEditor';

import { isRedirectError } from 'next/dist/client/components/redirect-error';

export default function EditProductClient({ product, sections }: { product: Product, sections: Section[] }) {
    const [fileError, setFileError] = useState<string | null>(null);
    const [selectedFilesCount, setSelectedFilesCount] = useState(0);
    const [sizeChartFile, setSizeChartFile] = useState<File | null>(null);
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    const [colorSizes, setColorSizes] = useState<Record<string, string[]>>(() => {
        const fromDb = (product.color_sizes as Record<string, string[]>) || {};
        if (Object.keys(fromDb).length > 0) return fromDb;
        if (product.colors?.length) {
            return Object.fromEntries(product.colors.map((c) => [c, product.sizes || []]));
        }
        return {};
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setFileError(null);
        setSelectedFilesCount(files?.length ?? 0);
    };

    const handleSubmit = async (formData: FormData) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setLocalSubmitting(true);

        try {
            const data = new FormData();
            formData.forEach((value, key) => {
                if (key !== 'colors' && key !== 'sizes' && key !== 'images' && key !== 'size_chart_image') {
                    data.append(key, value);
                }
            });

            // Compress newly added product images to WebP before upload.
            const rawImages = (formData.getAll('images') as File[]).filter(
                (f) => f instanceof File && f.size > 0
            );
            const compressedImages = await compressImages(rawImages, { maxWidth: 1280, quality: 0.8 });
            for (const img of compressedImages) data.append('images', img);

            // Compress the size-chart image too.
            const chart = formData.get('size_chart_image');
            if (chart instanceof File && chart.size > 0) {
                const compressedChart = await compressImage(chart, { maxWidth: 1400, quality: 0.85 });
                data.append('size_chart_image', compressedChart);
            }

            data.append('color_sizes', JSON.stringify(colorSizes));

            await updateProduct(product.id, data);
            toast.success("تم تحديث المنتج بنجاح");
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }
            toast.error("حدث خطأ أثناء تحديث المنتج");
        } finally {
            setLocalSubmitting(false);
            isSubmittingRef.current = false;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto" dir="rtl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">تعديل المنتج</h1>
                    <p className="text-slate-500 mt-1">تعديل بيانات {product.name}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                                اسم المنتج <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={product.name}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
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
                                defaultValue={product.description || ''}
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
                                defaultValue={product.price}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                            />
                        </div>

                        <div>
                            <label htmlFor="section_id" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                                القسم
                            </label>
                            <select
                                id="section_id"
                                name="section_id"
                                defaultValue={product.section_id || ''}
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
                                    <input
                                        type="radio"
                                        name="season"
                                        value={val}
                                        defaultChecked={product.season === val || (!product.season && val === '')}
                                        className="accent-primary"
                                    />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <ColorSizesEditor colorSizes={colorSizes} onChange={setColorSizes} />

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 mr-1">
                            صور المنتج الحالية
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {product.images?.map((img: string, idx: number) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <input type="hidden" name="existing_images" value={JSON.stringify(product.images || [])} />

                        <label htmlFor="images" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                            إضافة صور جديدة
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
                                {selectedFilesCount > 0 ? `تم اختيار ${selectedFilesCount} صور جديدة` : (fileError ? fileError : "اسحب الصور أو اضغط هنا للاختيار")}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">سيتم ضغط الصور تلقائياً قبل الرفع</p>
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
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 mr-1">
                            صورة جدول المقاسات
                        </label>

                        {product.size_chart_image && (
                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-500 mb-2 mr-1">الصورة الحالية:</p>
                                <div className="relative w-32 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src={product.size_chart_image} alt="" className="w-full h-full object-contain bg-white" />
                                </div>
                                <input type="hidden" name="current_size_chart_image" value={product.size_chart_image} />
                            </div>
                        )}

                        <label htmlFor="size_chart_image" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">
                            {product.size_chart_image ? "تغيير صورة جدول المقاسات" : "إضافة صورة جدول المقاسات (اختياري)"}
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
                                    حفظ التعديلات
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
