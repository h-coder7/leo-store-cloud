"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ArrowRight, FolderOpen, Image as ImageIcon, Tag, Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navLinks = [
        { name: 'لوحة التحكم', icon: LayoutDashboard, href: '/admin' },
        { name: 'البنرات', icon: ImageIcon, href: '/admin/banners' },
        { name: 'الأقسام', icon: FolderOpen, href: '/admin/sections' },
        { name: 'المنتجات', icon: Package, href: '/admin/products' },
        { name: 'الطلبات', icon: ShoppingBag, href: '/admin/orders' },
        { name: 'المهتمين', icon: User, href: '/admin/leads' },
        { name: 'العروض', icon: Tag, href: '/admin/offers' },
        { name: 'الآراء', icon: Settings, href: '/admin/testimonials' },
        { name: 'الإعدادات', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between p-4 shadow-sm h-16">
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Leo Store" width={40} height={40} className="rounded-lg" style={{ width: 'auto', height: 'auto' }} />
                    <span className="font-bold text-lg">التحكم</span>
                </div>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 right-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col shadow lg:shadow-none",
                isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            )}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <Image src="/logo.png" alt="Leo Store" width={80} height={80} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navLinks.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all group relative overflow-hidden",
                                    isActive
                                        ? "text-primary-foreground bg-primary shadow-md shadow-primary/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4 transition-transform duration-300",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                {item.name}

                                {isActive && (
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white/20 rounded-l-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#997500] dark:text-[#FCD201] hover:bg-[#FCD201]/10 rounded-xl transition-all"
                    >
                        <ArrowRight className="w-4 h-4" />
                        العودة للمتجر
                    </Link>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
