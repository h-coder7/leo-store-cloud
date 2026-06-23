import React from 'react';
import { getTestimonials } from '@/app/actions/testimonials';
import Link from 'next/link';
import { Plus, Star, User, MessageSquare } from 'lucide-react';
import DeleteTestimonialButton from '@/components/admin/DeleteTestimonialButton';

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="p-8 max-w-7xl mx-auto" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة آراء العملاء</h1>
                    <p className="text-slate-500 mt-1">عرض وإدارة جميع آراء العملاء المعروضة في المتجر</p>
                </div>
                <Link
                    href="/admin/testimonials/add"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all hover:scale-105 shadow shadow-primary/20 w-fit"
                >
                    <Plus className="w-5 h-5" />
                    إضافة رأي جديد
                </Link>
            </div>

            {testimonials.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">لا يوجد آراء حالياً</h3>
                    <p className="text-slate-500 mb-6">ابدأ بإضافة أول رأي لعملائك ليظهر في الصفحة الرئيسية</p>
                    <Link
                        href="/admin/testimonials/add"
                        className="text-primary font-bold hover:underline"
                    >
                        إضافة رأي جديد الآن
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full group hover:shadow transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                                        {testimonial.avatar_url ? (
                                            <img src={testimonial.avatar_url} alt={testimonial.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{testimonial.name}</h3>
                                        <p className="text-xs text-slate-500">{testimonial.role || 'عميل'}</p>
                                    </div>
                                </div>
                                <DeleteTestimonialButton id={testimonial.id} name={testimonial.name} />
                            </div>

                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < testimonial.rating ? "fill-primary text-primary" : "text-slate-200 dark:text-slate-600"}
                                    />
                                ))}
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-grow italic">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-[10px] text-slate-400">
                                <span>تم الإضافة في: {new Date(testimonial.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
