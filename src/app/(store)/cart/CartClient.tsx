"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { removeFromCart, updateCartItemQuantity } from "@/app/actions/cart";
import { refreshCartFromServer } from "@/lib/cart/refresh";
import { toCartStoreItems, type ServerCartItem } from "@/lib/cart/sync";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

type CartClientItem = ServerCartItem & {
    product: NonNullable<ServerCartItem['product']>;
};

function toClientItems(items: ServerCartItem[]): CartClientItem[] {
    return items.filter((item): item is CartClientItem => item.product != null);
}

export default function CartClient({ initialItems }: { initialItems: CartClientItem[] }) {
    const [items, setItems] = useState<CartClientItem[]>(initialItems);
    const [isPending, startTransition] = useTransition();
    const replaceItems = useCartStore((state) => state.replaceItems);

    useEffect(() => {
        setItems(initialItems);
        replaceItems(toCartStoreItems(initialItems));
    }, [initialItems, replaceItems]);

    const applyServerCart = async () => {
        const fresh = toClientItems(await refreshCartFromServer());
        setItems(fresh);
        return fresh;
    };

    const handleUpdateQuantity = async (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const itemToUpdate = items.find((i) => i.id === id);
        if (!itemToUpdate) return;

        const previousItems = items;
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );

        startTransition(async () => {
            try {
                await updateCartItemQuantity(id, newQuantity);
                await applyServerCart();
            } catch {
                toast.error("فشل في تحديث الكمية");
                setItems(previousItems);
                await applyServerCart();
            }
        });
    };

    const handleRemove = async (id: number) => {
        const itemToRemove = items.find((i) => i.id === id);
        if (!itemToRemove) return;

        const previousItems = items;
        setItems((current) => current.filter((item) => item.id !== id));

        startTransition(async () => {
            try {
                await removeFromCart(id);
                await applyServerCart();
                toast.success("تم إزالة المنتج من السلة");
            } catch {
                toast.error("فشل في إزالة المنتج");
                setItems(previousItems);
                await applyServerCart();
            }
        });
    };

    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const total = subtotal;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-24 h-24 rounded-full bg-[#FCD201]/10 flex items-center justify-center text-[#997500]">
                    <ShoppingBag className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">السلة فارغة حالياً</h2>
                <p className="text-slate-500 font-bold mb-2">اكتشف أحدث صيحات الموضة للأطفال الآن!</p>
                <Link href="/" className="px-10 py-3 bg-[#FCD201] text-[#1a1a1a] font-black rounded-xl hover:scale-105 transition-all shadow shadow-[#FCD201]/20">
                    تصفح المنتجات
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                            {item.product.images?.[0] ? (
                                <Image src={item.product.images[0]} alt={item.product.name} fill quality={50} sizes="96px" className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col flex-1 gap-2">
                            <div className="flex justify-between items-start">
                                <Link href={`/product/${item.product.id}`} className="font-bold text-lg text-slate-800 dark:text-white hover:text-primary transition-colors">
                                    {item.product.name}
                                </Link>
                                <div className="font-black text-primary dark:text-primary whitespace-nowrap mr-4">
                                    {item.product.price.toLocaleString("ar-EG")} <span className="text-sm">ج.م</span>
                                </div>
                            </div>

                            <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
                                {item.size && <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">المقاس: {item.size}</span>}
                                {item.color && <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">اللون: {item.color}</span>}
                            </div>

                            <div className="flex justify-between items-center mt-auto">
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        disabled={isPending}
                                        className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300 disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-6 text-center text-slate-800 dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || isPending}
                                        className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300 disabled:opacity-50 cursor-pointer"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemove(item.id)}
                                    disabled={isPending}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                                    title="إزالة المنتج"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit sticky top-24">
                <h3 className="font-black text-xl text-slate-800 dark:text-white">ملخص الطلب</h3>
                <div className="flex flex-col gap-3 text-slate-600 dark:text-slate-300 font-semibold">
                    <div className="flex justify-between">
                        <span>المجموع الفرعي ({items.length} منتجات)</span>
                        <span>{subtotal.toLocaleString("ar-EG")} ج.م</span>
                    </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-700" />

                <div className="flex justify-between font-black text-xl text-slate-800 dark:text-white">
                    <span>الإجمالي</span>
                    <span className="text-[#997500] dark:text-[#FCD201]">{total.toLocaleString("ar-EG")} ج.م</span>
                </div>

                <Link
                    href="/checkout"
                    className="w-full py-4 bg-[#FCD201] hover:bg-[#ebd201] active:scale-95 text-[#1a1a1a] font-black text-lg rounded-xl shadow shadow-[#FCD201]/30 transition-all duration-200 mt-2 flex items-center justify-center"
                >
                    إتمام الطلب
                </Link>
            </div>
        </div>
    );
}
