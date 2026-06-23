import React from 'react';
import Link from 'next/link';
import { getAllBanners } from '@/app/actions/banners';
import { Plus, Image as ImageIcon } from 'lucide-react';
import BannerActions from './BannerActions';

export default async function AdminBannersPage() {
    const banners = await getAllBanners();

    return (
        <div className="p-6 md:p-10" dir="rtl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة البنرات</h1>
                    <p className="text-slate-500 mt-1">التحكم في العروض المتحركة بالصفحة الرئيسية</p>
                </div>
                <Link
                    href="/admin/banners/add"
                    className="flex items-center gap-2 bg-[#FCD201] hover:bg-[#ebd201] text-[#1a1a1a] px-6 py-3 rounded-xl font-bold transition-all shadow shadow-[#FCD201]/20"
                >
                    <Plus className="w-5 h-5" />
                    إضافة بنر جديد
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 group">
                        {/* Preview */}
                        <div className="relative aspect-video">
                            <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                                <h3 className="font-bold text-lg leading-tight line-clamp-1">{banner.title}</h3>
                                {!banner.is_active && (
                                    <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        معطل
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions (Client side) */}
                        <BannerActions id={banner.id} isActive={banner.is_active} />
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">لا يوجد بنرات مضافة حالياً</p>
                        <p className="text-sm">قم بإضافة عروضك الأولى لتظهر في الصفحة الرئيسية</p>
                    </div>
                )}
            </div>
        </div>
    );
}
