"use client";

import React, { useState } from 'react';
import { LeadData, deleteLead } from '@/app/actions/leads';
import {
    Phone,
    User,
    Calendar,
    Trash2,
    Search,
    Filter,
    MessageCircle,
    CheckCircle2,
    Clock,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { formatWhatsAppNumber } from '@/lib/utils';

export default function LeadsClient({ initialLeads }: { initialLeads: LeadData[] }) {
    const [leads, setLeads] = useState(initialLeads);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.phone?.includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

        try {
            await deleteLead(id);
            setLeads(leads.filter(l => l.id !== id));
            toast.success('تم حذف العميل بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء الحذف');
        }
    };

    const stats = {
        total: initialLeads.length,
        pending: initialLeads.filter(l => l.status === 'pending').length,
        completed: initialLeads.filter(l => l.status === 'completed').length,
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto" dir="rtl">
            {/* Header & Stats */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">قائمة المهتمين (Leads)</h1>
                        <p className="text-slate-500 font-bold mt-1">تابع العملاء الذين لم يكملوا طلباتهم بعد</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">إجمالي الزوار</p>
                                <p className="text-2xl font-black">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">بانتظار الإكمال (Pending)</p>
                                <p className="text-2xl font-black">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">اكتمل الطلب (Completed)</p>
                                <p className="text-2xl font-black">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow border border-slate-100 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="بحث بالاسم أو رقم الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-slate-400 w-5 h-5" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-3 px-6 font-bold outline-none cursor-pointer"
                    >
                        <option value="all">كل الحالات</option>
                        <option value="pending">بانتظار الإكمال</option>
                        <option value="completed">مكتمل</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold text-sm">
                            <tr>
                                <th className="px-6 py-4">العميل</th>
                                <th className="px-6 py-4">رقم الهاتف</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">التاريخ</th>
                                <th className="px-6 py-4 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <span className="font-black text-slate-900 dark:text-white">
                                                {lead.name || 'عميل مجهول'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-600 dark:text-slate-400" dir="ltr">
                                        {lead.phone || '-'}
                                    </td>
                                    <td className="px-6 py-5">
                                        {lead.status === 'completed' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 text-xs font-black">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                مكتمل
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 text-xs font-black">
                                                <Clock className="w-3.5 h-3.5" />
                                                بانتظار الإكمال
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString('ar-EG') : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            {lead.phone && (
                                                <a
                                                    href={`https://wa.me/${formatWhatsAppNumber(lead.phone)}`}
                                                    target="_blank"
                                                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all hover:scale-110 shadow shadow-emerald-500/20"
                                                    title="تواصل واتساب"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold">
                                        لا يوجد عملاء مطابقين للبحث
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
