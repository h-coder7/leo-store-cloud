import type { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { getSupabaseStatic, isSupabaseConfigured } from '@/lib/supabase/static';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import type { Product } from '@/lib/supabase/types';
import { getSettings } from '@/app/actions/settings';
import { getOffers } from '@/app/actions/offers';
import ProductClientLayout from '@/app/(store)/product/[id]/ProductClientLayout';

interface Props {
    params: Promise<{ id: string }>;
}

const getProduct = unstable_cache(
    async (id: string): Promise<Product | null> => {
        if (!isSupabaseConfigured()) return null;

        const { data, error } = await getSupabaseStatic()
            .from('products')
            .select('*')
            .eq('id', parseInt(id, 10))
            .single();

        if (error || !data) return null;
        return data as Product;
    },
    ['product-detail'],
    { revalidate: 60, tags: ['products'] }
);

// badges moved to ProductClientLayout

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'المنتج غير موجود',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const productImages = product.images?.length ? product.images : [];

    return {
        title: `${product.name} | Leo Store`,
        description: `تسوق ${product.name} بأفضل الأسعار وبجودة عالية.`,
        openGraph: {
            title: product.name,
            description: `تسوق ${product.name} بأفضل الأسعار وبجودة عالية.`,
            images: [...productImages, ...previousImages],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            images: productImages.length > 0 ? [productImages[0]] : [],
        }
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const [product, settings, offers] = await Promise.all([
        getProduct(id),
        getSettings(),
        getOffers()
    ]);

    if (!product) notFound();
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Back */}
                <ProductClientLayout
                    product={product}
                    whatsappNumber={settings.whatsapp}
                    offers={offers}
                />
            </div>
        </div>
    );
}
