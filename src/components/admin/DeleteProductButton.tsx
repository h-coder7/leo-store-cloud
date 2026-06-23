"use client";

import React, { useState } from 'react';
import { deleteProduct } from '@/app/actions/products';

interface DeleteProductButtonProps {
    productId: number;
    productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف المنتج "${productName}"؟`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteProduct(productId);
        } catch (error) {
            alert('حدث خطأ أثناء حذف المنتج');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
            title="حذف"
        >
            {isDeleting ? (
                <span className="inline-block animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            )}
        </button>
    );
}
