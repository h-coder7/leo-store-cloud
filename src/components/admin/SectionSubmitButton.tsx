"use client";

import React from 'react';
import { useFormStatus } from 'react-dom';

interface SectionSubmitButtonProps {
    label?: string;
    loadingLabel?: string;
}

export default function SectionSubmitButton({
    label = "✓ حفظ القسم",
    loadingLabel = "جاري الحفظ..."
}: SectionSubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-primary hover:opacity-90 text-primary-foreground font-black py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {pending ? (
                <>
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    {loadingLabel}
                </>
            ) : (
                label
            )}
        </button>
    );
}
