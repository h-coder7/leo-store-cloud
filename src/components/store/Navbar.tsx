"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useCartStore } from '@/lib/store/cart';
import Image from 'next/image';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const cartCount = useCartStore((state) => state.count());

    // Badge reads from Zustand, synced from Supabase on each page via CartSync.
    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: 'الرئيسية', href: '/' },
        { name: 'المنتجات', href: '/products' },
        { name: 'أتصل بنا', href: '/contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Section (Right side for RTL) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Leo Kids" width={100} height={80} priority style={{ color: 'transparent', width: 'auto', height: '80px', padding: '10px 0' }} />
                        </Link>
                    </div>

                    {/* Desktop Navigation Links (Middle) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Icons (Left side for RTL) */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/cart" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative flex items-center gap-2 border px-5">
                            <ShoppingCart className="w-5 h-5" /> <span className='text-sm font-bold text-slate-600 dark:text-slate-300'>السلة</span>
                            {mounted && cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                                    {cartCount > 9 ? '+9' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={cn(
                "md:hidden absolute w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden shadow",
                isMenuOpen ? "max-h-96 py-4" : "max-h-0"
            )}>
                <div className="px-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around">
                        <button className="flex items-center gap-2 p-3 text-slate-600 dark:text-slate-400 font-bold">
                            <Search className="w-5 h-5" /> بحث
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
