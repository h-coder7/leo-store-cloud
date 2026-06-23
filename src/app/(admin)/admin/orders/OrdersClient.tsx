"use client";

import React, { useState, useTransition } from 'react';
import { updateOrderStatus, deleteOrder } from '@/app/actions/orders';
import { toast } from 'sonner';
import {
    Eye,
    Trash2,
    CheckCircle,
    Clock,
    Truck,
    XCircle,
    MoreVertical,
    User,
    Phone,
    MapPin,
    Calendar,
    ChevronDown,
    ShoppingBag
} from 'lucide-react';

type OrderItemRow = {
    name: string;
    image?: string;
    price: number;
    quantity?: number;
    size?: string;
    color?: string;
};

type Order = {
    id: number;
    customer_name: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    items: OrderItemRow[];
    created_at: string;
    payment_method?: string;
    transfer_number?: string;
    transfer_image_url?: string;
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [isMounted, setIsMounted] = React.useState(false);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        startTransition(async () => {
            try {
                await updateOrderStatus(id, newStatus);
                setOrders(current =>
                    current.map(o => o.id === id ? { ...o, status: newStatus } : o)
                );
                toast.success("تم تحديث حالة الطلب");
            } catch (error) {
                toast.error("فشل تحديث الحالة");
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

        startTransition(async () => {
            try {
                await deleteOrder(id);
                setOrders(current => current.filter(o => o.id !== id));
                toast.success("تم حذف الطلب");
            } catch (error) {
                toast.error("فشل حذف الطلب");
            }
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'جديد': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'تم الشحن': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'تم التسليم': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'ملغي': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'جديد': return <Clock className="w-3.5 h-3.5" />;
            case 'تم الشحن': return <Truck className="w-3.5 h-3.5" />;
            case 'تم التسليم': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'ملغي': return <XCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-black text-slate-400">#{order.id}</span>
                                    <h3 className="font-black text-slate-900 dark:text-white text-lg">{order.customer_name}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold mt-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                                    </div>
                                </div>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${getStatusStyle(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" />
                                    {order.phone}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                <div className="font-black text-[#997500] dark:text-[#FCD201] text-lg">
                                    {order.total.toLocaleString()} ج.م
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-[#FCD201] hover:text-[#1a1a1a] transition-all shadow-sm"
                                        title="عرض التفاصيل"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                                            className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm"
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                        <div className={`absolute left-0 bottom-full mb-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-100 dark:border-slate-700 py-2 z-50 transition-all ${activeDropdown === order.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                            <button onClick={() => { handleStatusUpdate(order.id, 'جديد'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-amber-50 text-amber-600">جديد</button>
                                            <button onClick={() => { handleStatusUpdate(order.id, 'تم الشحن'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-blue-50 text-blue-600">تم الشحن</button>
                                            <button onClick={() => { handleStatusUpdate(order.id, 'تم التسليم'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-emerald-50 text-emerald-600">تم التسليم</button>
                                            <button onClick={() => { handleStatusUpdate(order.id, 'ملغي'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-red-50 text-red-600 border-t border-slate-100 dark:border-slate-700 mt-1">إلغاء</button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="حذف الطلب"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="font-bold text-slate-500">لا توجد طلبات حالياً</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700">
                <div className="">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">رقم الطلب</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">العميل</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">التاريخ</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">الحالة</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">الإجمالي</th>
                                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors">
                                    <td className="p-4 font-black text-slate-900 dark:text-white whitespace-nowrap">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col min-w-[150px]">
                                            <span className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{order.customer_name}</span>
                                            <span className="text-xs text-slate-500 font-semibold">{order.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <span className="font-black text-[#997500] dark:text-[#FCD201]">
                                            {order.total.toLocaleString()} ج.م
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-[#FCD201] hover:text-[#1a1a1a] transition-all shadow-sm"
                                                title="عرض التفاصيل"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                                                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm"
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                                <div className={`absolute left-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-100 dark:border-slate-700 py-2 z-50 transition-all ${activeDropdown === order.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                                    <button onClick={() => { handleStatusUpdate(order.id, 'جديد'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-amber-50 text-amber-600">جديد</button>
                                                    <button onClick={() => { handleStatusUpdate(order.id, 'تم الشحن'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-blue-50 text-blue-600">تم الشحن</button>
                                                    <button onClick={() => { handleStatusUpdate(order.id, 'تم التسليم'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-emerald-50 text-emerald-600">تم التسليم</button>
                                                    <button onClick={() => { handleStatusUpdate(order.id, 'ملغي'); setActiveDropdown(null); }} className="w-full text-right px-4 py-2 text-sm font-bold hover:bg-red-50 text-red-600 border-t border-slate-100 dark:border-slate-700 mt-1">إلغاء الطلب</button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="حذف الطلب"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow animate-in zoom-in-95 duration-300">
                        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">تفاصيل الطلب #{selectedOrder.id}</h2>
                                <p className="text-slate-500 text-sm font-bold mt-0.5">تاريخ الطلب: {new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-5 md:p-8 space-y-8 md:space-y-10">
                            {/* Customer Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">بيانات العميل</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#FCD201]/10 text-[#997500] flex items-center justify-center"><User className="w-5 h-5" /></div>
                                            <span className="font-black text-slate-800 dark:text-white">{selectedOrder.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Phone className="w-5 h-5" /></div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{selectedOrder.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{selectedOrder.address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">ملخص الحساب</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-slate-500">حالة الطلب</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusStyle(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-lg text-slate-800 dark:text-white">الإجمالي</span>
                                            <span className="font-black text-2xl text-[#997500]">{selectedOrder.total.toLocaleString()} ج.م</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transfer Info (If applicable) */}
                            {(selectedOrder.payment_method === 'vodafone' || selectedOrder.payment_method === 'instapay') && (
                                <div className="p-6 rounded-[2.5rem] bg-amber-50/50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 dark:border-amber-800/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest text-sm">تفاصيل التحويل ({selectedOrder.payment_method})</h3>
                                        {selectedOrder.transfer_number && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-amber-100 dark:border-amber-900/50">
                                                <span className="text-xs font-bold text-slate-500">رقم المحول:</span>
                                                <span className="font-black text-amber-600">{selectedOrder.transfer_number}</span>
                                            </div>
                                        )}
                                    </div>

                                    {selectedOrder.transfer_image_url ? (
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold text-slate-500 block">إيصال التحويل:</span>
                                            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow group">
                                                <img
                                                    src={selectedOrder.transfer_image_url}
                                                    alt="إيصال التحويل"
                                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-110"
                                                    onClick={() => window.open(selectedOrder.transfer_image_url, '_blank')}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <Eye className="text-white w-10 h-10" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
                                            <p className="text-sm font-bold text-amber-600/70 italic">لم يتم رفع صورة إيصال</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="space-y-4">
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">المنتجات ({selectedOrder.items.length})</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                        <ShoppingBag className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-800 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                                                <div className="flex gap-4 mt-1">
                                                    <span className="text-xs font-bold text-slate-500">المقاس: {item.size || '-'}</span>
                                                    <span className="text-xs font-bold text-slate-500">اللون: {item.color || '-'}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-[#997500]">{item.price.toLocaleString()} ج.م</div>
                                                <div className="text-xs font-bold text-slate-400">الكمية: {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-10 py-4 bg-slate-900 dark:bg-slate-700 text-white font-black rounded-2xl hover:bg-slate-800 transition-all"
                            >
                                إغلاق التفاصيل
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
