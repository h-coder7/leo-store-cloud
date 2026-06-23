import React from 'react';
import { getAllOrders } from '@/app/actions/orders';
import OrdersClient from './OrdersClient';
import { Package } from 'lucide-react';

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="p-6 md:p-10" dir="rtl">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة الطلبات</h1>
                <p className="text-slate-500 mt-1">متابعة طلبات العملاء وتغيير حالات التوصيل</p>
            </div>

            {orders.length > 0 ? (
                <OrdersClient initialOrders={orders} />
            ) : (
                <div className="py-20 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 text-center px-6">
                    <Package className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="font-black text-xl text-slate-700 dark:text-slate-300">لا يوجد طلبات حالياً</h3>
                    <p className="text-sm max-w-xs mt-1">عندما يقوم العملاء بطلب منتجات من المتجر ستظهر جميع البيانات هنا</p>
                </div>
            )}
        </div>
    );
}
