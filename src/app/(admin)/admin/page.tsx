import React from 'react';
import { getTopProducts, getAllOrders } from '@/app/actions/orders';
import { Package, TrendingUp, ShoppingCart, DollarSign, Trophy } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const topProducts = await getTopProducts();
    const allOrders = await getAllOrders();

    // Calculate basic stats - Only count 'تم التسليم' for revenue
    const deliveredOrders = allOrders.filter(o => o.status === 'تم التسليم');
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'جديد' || o.status === 'تم الشحن').length;

    const stats = [
        { title: 'إجمالي المبيعات', value: `${totalRevenue.toLocaleString('ar-EG')} ج.م`, icon: DollarSign, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
        { title: 'إجمالي الطلبات', value: totalOrders, icon: ShoppingCart, color: 'bg-blue-500', bg: 'bg-blue-50' },
        { title: 'طلبات قيد الانتظار', value: pendingOrders, icon: TrendingUp, color: 'bg-amber-500', bg: 'bg-amber-50' },
        { title: 'المنتجات المميزة', value: topProducts.length, icon: Package, color: 'bg-primary', bg: 'bg-primary/10' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-10" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">لوحة التحكم</h1>
                <p className="text-slate-500 font-bold">نظرة عامة على أداء المتجر والطلبات</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5">
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                            <stat.icon className={`w-7 h-7 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Products Section */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">أكثر المنتجات طلباً</h2>
                    </div>
                    <span className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-500">
                        بناءً على {totalOrders} طلب
                    </span>
                </div>

                <div className="space-y-4">
                    {topProducts.length > 0 ? (
                        topProducts.slice(0, 8).map((product, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20"
                            >
                                {/* Rank */}
                                <div className="w-10 h-10 shrink-0 flex items-center justify-center font-black text-lg text-slate-400 group-hover:text-primary transition-colors">
                                    #{index + 1}
                                </div>

                                {/* Image */}
                                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                            <Package className="w-6 h-6 text-slate-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs font-bold text-slate-500">
                                            السعر: {product.price} ج.م
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="text-left flex flex-col items-end gap-1">
                                    <div className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-black shadow-sm group-hover:scale-105 transition-transform">
                                        {product.totalQty} طلبية
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        إجمالي الكمية
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-slate-500 font-bold">لا توجد بيانات مبيعات حتى الآن</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
