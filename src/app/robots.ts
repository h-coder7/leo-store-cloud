import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/checkout/', '/cart/', '/login'],
        },
        sitemap: absoluteUrl('/sitemap.xml'),
    };
}
