import React from 'react';
import { getSections } from '@/app/actions/products';
import Link from 'next/link';
import type { Section } from '@/lib/supabase/types';
import DeleteSectionButton from '@/components/admin/DeleteSectionButton';

export const dynamic = 'force-dynamic';

const parentLabels: Record<string, string> = {
    boy: '👦 أولاد',
    girl: '👧 بنات',
    offers: '🏷️ عروض',
};

export default async function SectionsAdminPage() {
    const sections = await getSections();

    return (
        <div className="p-8 max-w-7xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">إدارة الأقسام</h1>
                    <p className="text-slate-500 mt-1">
                        {sections.length > 0 ? `${sections.length} قسم مسجّل` : 'لا توجد أقسام بعد'}
                    </p>
                </div>
                <Link
                    href="/admin/sections/add"
                    className="bg-primary hover:opacity-90 text-primary-foreground font-black py-3 px-6 rounded-2xl transition-all shadow-md hover:shadow flex items-center justify-center gap-2 active:scale-95"
                >
                    <span className="text-xl leading-none">+</span>
                    إضافة قسم جديد
                </Link>
            </div>

            {/* Grid */}
            {sections.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {sections.map((section: Section) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group flex flex-col"
                        >
                            {/* Image */}
                            <div className="w-full aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                                {section.image_url ? (
                                    <img
                                        src={section.image_url}
                                        alt={section.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">📂</div>
                                )}

                                {section.parent && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[10px] font-black text-slate-700 dark:text-slate-300 shadow-sm">
                                            {parentLabels[section.parent] ?? section.parent}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Info */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="mb-4">
                                    <h3 className="font-black text-slate-900 dark:text-white text-lg">{section.name}</h3>
                                    <p className="text-slate-400 text-xs font-bold mt-1">
                                        ID: #{section.id}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-end gap-2">
                                    <Link
                                        href={`/admin/sections/${section.id}/edit`}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-[#997500] dark:text-primary rounded-xl font-black text-sm hover:bg-primary/20 transition-colors"
                                        title="تعديل"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        تعديل
                                    </Link>
                                    <DeleteSectionButton sectionId={section.id} sectionName={section.name} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600 text-center">
                    <span className="text-6xl mb-4">📂</span>
                    <p className="text-lg font-bold">لا توجد أقسام حالياً</p>
                    <p className="text-sm mt-1">أضف قسمك الأول لتنظيم المنتجات!</p>
                </div>
            )}
        </div>
    );
}
