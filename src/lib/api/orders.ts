import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/supabase/types'

const supabase = createClient()

// إضافة طلب جديد
export async function addOrder(order: Omit<Order, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single()

    if (error) throw error
    return data as Order
}

// جلب كل الطلبات (للأدمن)
export async function getOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Order[]
}

// تغيير حالة الطلب
export async function updateOrderStatus(id: number, status: Order['status']) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Order
}