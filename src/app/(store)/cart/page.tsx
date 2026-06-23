import React from "react";
import { getCartItems } from "@/app/actions/cart";
import CartClient from "./CartClient";
import Link from "next/link";

export const metadata = {
    title: "السلة | ليو ستور",
};

export default async function CartPage() {
    const items = await getCartItems();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm mb-4 transition-colors font-semibold"
                    >
                        ← العودة للتسوق
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">سلة المشتريات</h1>
                </div>

                <CartClient initialItems={items} />
            </div>
        </div>
    );
}
