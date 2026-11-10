export type MetaParams = Record<string, string | number | string[]>;

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
    }
}

/** Fire a standard Meta Pixel event. No-ops when the pixel script is not loaded. */
export function trackMeta(event: string, params?: MetaParams) {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    if (params) {
        window.fbq('track', event, params);
        return;
    }
    window.fbq('track', event);
}
