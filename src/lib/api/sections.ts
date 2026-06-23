import { createClient } from '@/lib/supabase/client'
import type { Section } from '@/lib/supabase/types'

const supabase = createClient()

// جلب كل الأقسام
export async function getSections() {
    const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Section[]
}

// جلب أقسام البناتي
export async function getGirlSections() {
    const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('parent', 'girl')
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Section[]
}

// جلب أقسام الأولادي
export async function getBoysSections() {
    const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('parent', 'boy')
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Section[]
}

// إضافة قسم
export async function addSection(section: Omit<Section, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('sections')
        .insert(section)
        .select()
        .single()

    if (error) throw error
    return data as Section
}

// تعديل قسم
export async function updateSection(id: number, section: Partial<Section>) {
    const { data, error } = await supabase
        .from('sections')
        .update(section)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Section
}

// حذف قسم
export async function deleteSection(id: number) {
    const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id)

    if (error) throw error
}