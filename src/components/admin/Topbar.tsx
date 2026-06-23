"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

const routeTitles: Record<string, string> = {
    '/admin': 'لوحة التحكم',
    '/admin/banners': 'إدارة البنرات',
    '/admin/banners/add': 'إضافة بنر جديد',
    '/admin/sections': 'إدارة الأقسام',
    '/admin/sections/add': 'إضافة قسم جديد',
    '/admin/products': 'إدارة المنتجات',
    '/admin/products/add': 'إضافة منتج جديد',
    '/admin/orders': 'إدارة الطلبات',
    '/admin/offers': 'إدارة العروض',
    '/admin/offers/add': 'إضافة عرض جديد',
    '/admin/testimonials': 'آراء العملاء',
    '/admin/settings': 'الإعدادات',
};

export default function AdminTopbar() {
    const pathname = usePathname();

    let title = 'لوحة التحكم';

    // محاولة مطابقة المسار تماماً
    if (routeTitles[pathname]) {
        title = routeTitles[pathname];
    }
    // محاولة اكتشاف مسارات التعديل
    else if (pathname.includes('/edit')) {
        title = 'تعديل البيانات';
    }
    // محاولة اكتشاف المسار الأساسي
    else {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
            const baseRoute = `/${parts[0]}/${parts[1]}`;
            if (routeTitles[baseRoute]) {
                title = routeTitles[baseRoute];
            }
        }
    }

    return (
        <header className="hidden lg:flex sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 items-center justify-between px-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="بحث في لوحة التحكم..."
                        className="pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-64"
                    />
                </div>
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900"></span>
                </button>
            </div>
        </header>
    );
}
