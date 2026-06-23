"use server";

import { createClient } from '@/lib/supabase/server';
import { getSupabaseStatic, isSupabaseConfigured } from '@/lib/supabase/static';
import { uploadFormImage } from '@/lib/storage/upload';
import { revalidatePath, unstable_cache, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product, Section } from '@/lib/supabase/types';

const getCachedProducts = unstable_cache(
    async (sectionId?: number, limit: number = 20) => {
        if (!isSupabaseConfigured()) return [];

        let query = getSupabaseStatic()
            .from('products')
            .select('id, name, price, images, sizes, colors, season, section_id, created_at')
            .order('created_at', { ascending: false });

        if (sectionId) {
            query = query.eq('section_id', sectionId);
        }

        query = query.limit(limit);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return (data ?? []) as Product[];
    },
    ['products-list'],
    { revalidate: 60, tags: ['products'] }
);

// `limit` defaults to 20 (used on the homepage for "latest products"). The
// full catalog / section pages pass a higher limit to show all products.
export async function getProducts(sectionId?: number, limit: number = 20): Promise<Product[]> {
    return getCachedProducts(sectionId, limit);
}

export async function getProduct(id: number): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data;
}

const getCachedSections = unstable_cache(
    async () => {
        if (!isSupabaseConfigured()) return [];

        const { data, error } = await getSupabaseStatic()
            .from('sections')
            .select('id, name, image_url, parent, created_at')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching sections:', error);
            return [];
        }

        return (data ?? []) as Section[];
    },
    ['sections-list'],
    { revalidate: 300, tags: ['sections'] }
);

export async function getSections(): Promise<Section[]> {
    return getCachedSections();
}

export async function addProduct(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const description = formData.get('description') as string || null;
    const price = parseFloat(formData.get('price') as string);
    const sectionRaw = formData.get('section_id') as string;
    const section_id = sectionRaw ? parseInt(sectionRaw, 10) : null;
    const season = (formData.get('season') as Product['season']) || null;

    // Arrays: sizes & colors come as multiple checkbox values
    const colorSizesRaw = formData.get('color_sizes') as string;
    const color_sizes = colorSizesRaw ? JSON.parse(colorSizesRaw) : null;
    const colors = color_sizes ? Object.keys(color_sizes) : [];
    const sizes = color_sizes ? Array.from(new Set(Object.values(color_sizes).flat() as string[])) : [];

    // Images: Upload files to Cloudflare R2
    const imageFiles = formData.getAll('images') as File[];
    const images: string[] = [];

    for (const file of imageFiles) {
        if (!file || file.size === 0) continue;

        try {
            images.push(await uploadFormImage(file, 'products'));
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    }

    // Size Chart Image: Upload if provided
    const sizeChartFile = formData.get('size_chart_image') as File;
    let size_chart_image = null;

    if (sizeChartFile && sizeChartFile.size > 0) {
        try {
            size_chart_image = await uploadFormImage(sizeChartFile, 'products/size_charts');
        } catch (err) {
            console.error('Error uploading size chart:', err);
        }
    }



    const { error } = await supabase.from('products').insert([
        {
            name,
            description,
            price: isNaN(price) ? 0 : price,
            section_id: section_id && !isNaN(section_id) ? section_id : null,
            images,
            sizes,
            colors,
            color_sizes,
            season,
            size_chart_image,
        },
    ]);

    if (error) {
        console.error('Error inserting product:', JSON.stringify(error, null, 2));
        return;
    }

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

    redirect('/admin/products');
}

export async function addSection(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const parent = (formData.get('parent') as Section['parent']) || null;
    const imageFile = formData.get('image') as File;
    let image_url = null;

    if (imageFile && imageFile.size > 0) {
        try {
            image_url = await uploadFormImage(imageFile, 'sections');
        } catch (err) {
            console.error('Error uploading section image:', err);
        }
    }

    const { error } = await supabase.from('sections').insert([{ name, image_url, parent }]);

    if (error) {
        console.error('Error inserting section:', error);
        return;
    }

    revalidateTag('sections', 'max');
    revalidatePath('/admin/sections');
    revalidatePath('/admin/products');
    revalidatePath('/');

    redirect('/admin/sections');
}

export async function getSection(id: number): Promise<Section | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching section:', error);
        return null;
    }

    return data;
}

export async function updateSection(id: number, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const parent = (formData.get('parent') as Section['parent']) || null;
    const imageFile = formData.get('image') as File;
    
    // Check if there is an existing image URL or a new one being uploaded
    let image_url = formData.get('current_image_url') as string || null;

    if (imageFile && imageFile.size > 0) {
        try {
            image_url = await uploadFormImage(imageFile, 'sections');
        } catch (err) {
            console.error('Error uploading section image:', err);
        }
    }

    const { error } = await supabase
        .from('sections')
        .update({ name, image_url, parent })
        .eq('id', id);

    if (error) {
        console.error('Error updating section:', error);
        return;
    }

    revalidateTag('sections', 'max');
    revalidatePath('/admin/sections');
    revalidatePath('/admin/products');
    revalidatePath('/');

    redirect('/admin/sections');
}

export async function deleteSection(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting section:', error);
        throw new Error('فشل حذف القسم');
    }

    revalidateTag('sections', 'max');
    revalidatePath('/admin/sections');
    revalidatePath('/admin/products');
    revalidatePath('/');
}

export async function deleteProduct(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw new Error('فشل حذف المنتج');
    }

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');
}

export async function updateProduct(id: number, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const description = formData.get('description') as string || null;
    const price = parseFloat(formData.get('price') as string);
    const sectionRaw = formData.get('section_id') as string;
    const section_id = sectionRaw ? parseInt(sectionRaw, 10) : null;
    const season = (formData.get('season') as Product['season']) || null;

    const colorSizesRaw = formData.get('color_sizes') as string;
    const color_sizes = colorSizesRaw ? JSON.parse(colorSizesRaw) : null;
    const colors = color_sizes ? Object.keys(color_sizes) : [];
    const sizes = color_sizes ? Array.from(new Set(Object.values(color_sizes).flat() as string[])) : [];

    // Images: current images + new uploads
    const existingImagesRaw = formData.get('existing_images') as string;
    const existingImages: string[] = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

    const imageFiles = formData.getAll('images') as File[];
    const newImages: string[] = [];

    for (const file of imageFiles) {
        if (!file || file.size === 0) continue;

        try {
            newImages.push(await uploadFormImage(file, 'products'));
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    }

    const images = [...existingImages, ...newImages];

    // Size Chart Image: new upload or current one
    let size_chart_image = formData.get('current_size_chart_image') as string || null;
    const sizeChartFile = formData.get('size_chart_image') as File;

    if (sizeChartFile && sizeChartFile.size > 0) {
        try {
            size_chart_image = await uploadFormImage(sizeChartFile, 'products/size_charts');
        } catch (err) {
            console.error('Error uploading size chart:', err);
        }
    }



    const { error } = await supabase.from('products').update({
        name,
        description,
        price: isNaN(price) ? 0 : price,
        section_id: section_id && !isNaN(section_id) ? section_id : null,
        images,
        sizes,
        colors,
        color_sizes,
        season,
        size_chart_image,
    }).eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        return;
    }

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

    redirect('/admin/products');
}
