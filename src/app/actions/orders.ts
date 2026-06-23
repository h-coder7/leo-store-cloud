"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface OrderItem {
    product_id?: number;
    name?: string;
    image?: string;
    price?: number;
    quantity?: number;
    size?: string;
    color?: string;
    [key: string]: unknown;
}

export async function createOrder(formData: {
    customer_name: string;
    phone: string;
    address: string;
    governorate: string;
    payment_method: string;
    items: OrderItem[];
    total: number;
    transfer_number?: string;
    transfer_image_url?: string;
}) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session")?.value;

    // Rate Limiting: Check if an order with the same phone was placed in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentOrders } = await supabase
        .from("orders")
        .select("id")
        .eq("phone", formData.phone)
        .gte("created_at", fiveMinutesAgo)
        .limit(1);

    if (recentOrders && recentOrders.length > 0) {
        return { success: false, error: "عذراً، لقد قمت بإرسال طلب مؤخراً. يرجى الانتظار بضع دقائق قبل المحاولة مرة أخرى." };
    }

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            customer_name: formData.customer_name,
            phone: formData.phone,
            address: formData.address,
            governorate: formData.governorate,
            payment_method: formData.payment_method,
            transfer_number: formData.transfer_number,
            transfer_image_url: formData.transfer_image_url,
            total: formData.total,
            items: formData.items,
            status: 'جديد',
        })
        .select()
        .single();

    if (orderError) {
        console.error("Order error:", orderError);
        return { success: false, error: "حدث خطأ أثناء حفظ الطلب" };
    }

    // Clear cart for this session
    if (sessionId) {
        await supabase
            .from("cart_items")
            .delete()
            .eq("session_id", sessionId);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/cart");
    
    return { success: true, orderId: order.id };
}

export async function getAllOrders() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch orders error:", error);
        return [];
    }

    return data;
}

export async function updateOrderStatus(orderId: number, status: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/orders");
    return { success: true };
}

export async function deleteOrder(orderId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/orders");
    return { success: true };
}

export async function getTopProducts() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: orders, error } = await supabase
        .from("orders")
        .select("items");

    if (error || !orders) return [];

    const productStats: Record<number, { name: string; totalQty: number; image: string; price: number }> = {};

    orders.forEach((order: { items: OrderItem[] | null }) => {
        const items = order.items;
        if (items && Array.isArray(items)) {
            items.forEach((item: OrderItem) => {
                const id = item.product_id;
                if (id == null) return;
                if (!productStats[id]) {
                    productStats[id] = {
                        name: item.name ?? '',
                        totalQty: 0,
                        image: item.image ?? '',
                        price: item.price ?? 0
                    };
                }
                productStats[id].totalQty += (item.quantity || 1);
            });
        }
    });

    return Object.values(productStats).sort((a, b) => b.totalQty - a.totalQty);
}
