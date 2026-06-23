"use client";

import React, { useTransition } from 'react';
import { toggleBannerStatus, deleteBanner } from '@/app/actions/banners';
import { Power, PowerOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BannerActionsProps {
    id: number;
    isActive: boolean;
}

export default function BannerActions({ id, isActive }: BannerActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const res = await toggleBannerStatus(id, isActive);
            if (res.success) {
                toast.success(isActive ? 'تم تعطيل البنر' : 'تم تفعيل البنر');
            } else {
                toast.error('حدث خطأ أثناء التحديث');
            }
        });
    };

    const handleDelete = () => {
        if (!confirm('هل أنت متأكد من حذف هذا البنر نهائياً؟')) return;

        startTransition(async () => {
            const res = await deleteBanner(id);
            if (res.success) {
                toast.success('تم حذف البنر بنجاح');
            } else {
                toast.error('حدث خطأ أثناء الحذف');
            }
        });
    };

    return (
        <div className="p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`p-2 rounded-xl transition-colors ${
                        isActive
                            ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100'
                            : 'text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100'
                    } disabled:opacity-50`}
                    title={isActive ? "تعطيل" : "تفعيل"}
                >
                    {isActive ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                </button>
            </div>

            <button
                onClick={handleDelete}
                disabled={isPending}
                className="p-2 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                title="حذف"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
