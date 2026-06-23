"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseStatic, isSupabaseConfigured } from "@/lib/supabase/static";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export type SiteSettings = {
    phone: string;
    whatsapp: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    telegram_url: string;
    vodafone_cash: string;
    instapay_number: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
    phone: '',
    whatsapp: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    telegram_url: '',
    vodafone_cash: '',
    instapay_number: ''
};

const getCachedSettings = unstable_cache(
    async (): Promise<SiteSettings> => {
        if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;

        const { data, error } = await getSupabaseStatic()
            .from('site_settings')
            .select('phone, whatsapp, address, facebook_url, instagram_url, telegram_url, vodafone_cash, instapay_number')
            .single();

        if (error || !data) {
            return DEFAULT_SETTINGS;
        }

        return data as SiteSettings;
    },
    ['site-settings'],
    { revalidate: 3600, tags: ['settings'] }
);

export async function getSettings(): Promise<SiteSettings> {
    return getCachedSettings();
}

export async function updateSettings(formData: FormData) {
    const supabase = await createClient();

    const settings = {
        id: 1,
        phone: (formData.get('phone') as string) || '',
        whatsapp: (formData.get('whatsapp') as string) || '',
        address: (formData.get('address') as string) || '',
        facebook_url: (formData.get('facebook_url') as string) || '',
        instagram_url: (formData.get('instagram_url') as string) || '',
        telegram_url: (formData.get('telegram_url') as string) || '',
        vodafone_cash: (formData.get('vodafone_cash') as string) || '',
        instapay_number: (formData.get('instapay_number') as string) || '',
    };

    // Always update row id=1 (we guarantee this row exists from DB setup)
    const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', 1);

    if (error) throw new Error(error.message);

    revalidateTag('settings', 'max');
    revalidatePath('/admin/settings');
    revalidatePath('/');
    revalidatePath('/product');
    return { success: true };
}
