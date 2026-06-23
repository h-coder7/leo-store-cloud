"use client";

import React, { useState } from 'react';
import { compressImage, type CompressImageOptions } from '@/lib/image/compress';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    compressOptions?: CompressImageOptions;
    /** Called with the compressed files after processing (e.g. to show a name). */
    onFilesReady?: (files: File[]) => void;
}

/**
 * A file input that transparently compresses selected images to WebP (in the
 * browser) and writes them back into the input's `files`, so a native
 * `<form action={...}>` submits the already-compressed files to Supabase.
 */
export default function CompressedImageInput({
    compressOptions,
    onFilesReady,
    onChange,
    ...props
}: Props) {
    const [, setBusy] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const files = input.files ? Array.from(input.files) : [];
        if (files.length === 0) return;

        setBusy(true);
        try {
            const compressed = await Promise.all(
                files.map((f) => compressImage(f, compressOptions))
            );

            // Write the compressed files back so the form submits them.
            const dt = new DataTransfer();
            compressed.forEach((f) => dt.items.add(f));
            input.files = dt.files;

            onFilesReady?.(compressed);
        } finally {
            setBusy(false);
        }

        onChange?.(e);
    };

    return <input type="file" onChange={handleChange} {...props} />;
}
