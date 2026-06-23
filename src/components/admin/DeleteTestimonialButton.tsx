"use client";

import React, { useState } from 'react';
import { deleteTestimonial } from '@/app/actions/testimonials';
import { Trash2 } from 'lucide-react';

interface DeleteTestimonialButtonProps {
    id: number;
    name: string;
}

export default function DeleteTestimonialButton({ id, name }: DeleteTestimonialButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف رأي "${name}"؟`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteTestimonial(id);
        } catch (error) {
            alert('حدث خطأ أثناء حذف الرأي');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
            title="حذف"
        >
            {isDeleting ? (
                <span className="inline-block animate-spin h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full" />
            ) : (
                <Trash2 className="w-5 h-5" />
            )}
        </button>
    );
}
