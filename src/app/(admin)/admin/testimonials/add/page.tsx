import React from 'react';
import { addTestimonial } from '@/app/actions/testimonials';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export default function AddTestimonialPage() {
    return (
        <div className="p-8 max-w-2xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">إضافة رأي جديد</h1>
                    <p className="text-slate-500 mt-1">أدخل بيانات العميل ورأيه ليظهر في المتجر</p>
                </div>
                <Link
                    href="/admin/testimonials"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm flex items-center gap-1 transition-colors"
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة للقائمة
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow p-8 border border-slate-100 dark:border-slate-700">
                <form action={addTestimonial} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                اسم العميل <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="مثال: أحمد محمد"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                المسمى الوظيفي (اختياري)
                            </label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="مثال: عميل دائم"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="rating" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            التقييم (1-5)
                        </label>
                        <div className="flex items-center gap-4">
                            <select
                                id="rating"
                                name="rating"
                                defaultValue="5"
                                className="w-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            >
                                <option value="5">5 نجوم</option>
                                <option value="4">4 نجوم</option>
                                <option value="3">3 نجوم</option>
                                <option value="2">2 نجوم</option>
                                <option value="1">نجمة واحدة</option>
                            </select>
                            <div className="flex gap-1 text-primary">
                                <Star size={20} className="fill-primary" />
                                <Star size={20} className="fill-primary" />
                                <Star size={20} className="fill-primary" />
                                <Star size={20} className="fill-primary" />
                                <Star size={20} className="fill-primary" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            نص الرأي <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="أدخل رأي العميل هنا..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-xl transition-all hover:scale-[1.02] shadow shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            ✓ حفظ ونشر الرأي
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
