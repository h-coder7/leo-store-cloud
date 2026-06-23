import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/supabase/types'

const supabase = createClient()

// جلب كل المنتجات
export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Product[]
}

// جلب منتجات قسم معين
export async function getProductsBySection(sectionId: number, season?: string, sort?: string) {
    let query = supabase
        .from('products')
        .select('*')
        .eq('section_id', sectionId)

    if (season && season !== 'الكل') {
        query = query.eq('season', season)
    }

    if (sort === 'الأحدث') {
        query = query.order('created_at', { ascending: false })
    } else if (sort === 'الأقدم') {
        query = query.order('created_at', { ascending: true })
    } else if (sort === 'الأرخص') {
        query = query.order('price', { ascending: true })
    } else if (sort === 'الأغلى') {
        query = query.order('price', { ascending: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error
    return data as Product[]
}

// جلب منتج واحد
export async function getProduct(id: number) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data as Product
}

// إضافة منتج
export async function addProduct(product: Omit<Product, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

    if (error) throw error
    return data as Product
}

// تعديل منتج
export async function updateProduct(id: number, product: Partial<Product>) {
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Product
}

// حذف منتج
export async function deleteProduct(id: number) {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) throw error
}