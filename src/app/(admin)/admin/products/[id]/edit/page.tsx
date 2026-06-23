import React from 'react';
import { getProduct, getSections } from '@/app/actions/products';
import { notFound } from 'next/navigation';
import EditProductClient from './EditProductClient';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) notFound();

    const [product, sections] = await Promise.all([
        getProduct(productId),
        getSections()
    ]);

    if (!product) notFound();

    return <EditProductClient product={product} sections={sections} />;
}
