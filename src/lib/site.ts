/** Canonical public site URL — set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.leo-kids.com';

export const SITE_NAME = 'Leo Kids';
export const SITE_NAME_AR = 'ليو كيدز';

export function absoluteUrl(path: string = '/') {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${normalized}`;
}

export function pageTitle(title: string) {
    return `${title} | ${SITE_NAME}`;
}
