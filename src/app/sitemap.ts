import { MetadataRoute } from 'next';
import { getProducts, getSections } from '@/app/actions/products';
import { getOffers } from '@/app/actions/offers';
import { absoluteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl('/'),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: absoluteUrl('/products'),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: absoluteUrl('/contact'),
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return staticPages;
    }

    try {
        const [products, sections, offers] = await Promise.all([
            getProducts(undefined, 500),
            getSections(),
            getOffers(),
        ]);

        const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
            url: absoluteUrl(`/product/${product.id}`),
            lastModified: product.created_at ? new Date(product.created_at) : now,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        const sectionEntries: MetadataRoute.Sitemap = sections.map((section) => ({
            url: absoluteUrl(`/products?section=${section.id}`),
            lastModified: section.created_at ? new Date(section.created_at) : now,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        const offerEntries: MetadataRoute.Sitemap = offers.map((offer) => ({
            url: absoluteUrl(`/offers/${offer.id}/products`),
            lastModified: offer.created_at ? new Date(offer.created_at) : now,
            changeFrequency: 'weekly',
            priority: 0.75,
        }));

        return [...staticPages, ...sectionEntries, ...productEntries, ...offerEntries];
    } catch {
        return staticPages;
    }
}
