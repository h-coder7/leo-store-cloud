"use server";

import { createClient } from '@/lib/supabase/server';
import { supabaseStatic } from '@/lib/supabase/static';
import { uploadFormImage } from '@/lib/storage/upload';
import { revalidatePath, unstable_cache, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

const getCachedOffers = unstable_cache(
    async () => {
        const { data, error } = await supabaseStatic
            .from('offers')
            .select('id, title, description, discount_label, image_url, type, min_quantity, discount_value, is_free_shipping, is_active, created_at')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching offers:', error);
            return [];
        }
        return data || [];
    },
    ['offers-list'],
    { revalidate: 60, tags: ['offers'] }
);

export async function getOffers() {
    return getCachedOffers();
}

export async function getAllOffers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all offers:', error);
        return [];
    }
    return data || [];
}

export async function addOffer(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const discount_label = formData.get('discount_label') as string;
    const type = formData.get('type') as string;
    const min_quantity = parseInt(formData.get('min_quantity') as string) || 1;
    const discount_value = parseFloat(formData.get('discount_value') as string) || 0;
    const is_free_shipping = formData.get('is_free_shipping') === 'true' || type === 'free_shipping';
    
    // Image handling
    const imageFile = formData.get('image') as File;
    let image_url = '';

    if (imageFile && imageFile.size > 0) {
        try {
            image_url = await uploadFormImage(imageFile, 'offers');
        } catch (err) {
            console.error('Error uploading offer image:', err);
            throw new Error('فشل رفع الصورة');
        }
    }

    const { error } = await supabase.from('offers').insert([
        {
            title,
            description,
            discount_label,
            image_url,
            type,
            min_quantity,
            discount_value,
            is_free_shipping,
            is_active: true
        }
    ]);

    if (error) {
        console.error('Error adding offer:', error);
        throw new Error('فشل إضافة العرض');
    }

    revalidateTag('offers', 'max');
    revalidatePath('/');
    revalidatePath('/admin/offers');
    return { success: true };
}

export async function toggleOfferStatus(id: number, currentStatus: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('offers')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) {
        console.error('Error toggling offer status:', error);
        return { success: false };
    }

    revalidateTag('offers', 'max');
    revalidatePath('/');
    revalidatePath('/admin/offers');
    return { success: true };
}

export async function deleteOffer(id: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting offer:', error);
        return { success: false };
    }

    revalidateTag('offers', 'max');
    revalidatePath('/');
    revalidatePath('/admin/offers');
    return { success: true };
}

export async function getOfferById(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching offer by id:', error);
        return null;
    }
    return data;
}

export async function updateOffer(id: number, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const discount_label = formData.get('discount_label') as string;
    const type = formData.get('type') as string;
    const min_quantity = parseInt(formData.get('min_quantity') as string) || 1;
    const discount_value = parseFloat(formData.get('discount_value') as string) || 0;
    const is_free_shipping = formData.get('is_free_shipping') === 'true' || type === 'free_shipping';
    
    // Image handling
    const imageFile = formData.get('image') as File;
    let image_url = formData.get('current_image_url') as string;

    if (imageFile && imageFile.size > 0) {
        try {
            image_url = await uploadFormImage(imageFile, 'offers');
        } catch (err) {
            console.error('Error uploading offer image:', err);
            throw new Error('فشل رفع الصورة');
        }
    }

    const { error } = await supabase.from('offers')
        .update({
            title,
            description,
            discount_label,
            image_url,
            type,
            min_quantity,
            discount_value,
            is_free_shipping,
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating offer:', error);
        throw new Error('فشل تحديث العرض');
    }

    revalidateTag('offers', 'max');
    revalidatePath('/');
    revalidatePath('/admin/offers');
    return { success: true };
}
