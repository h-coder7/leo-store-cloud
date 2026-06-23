"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getCartSessionId() {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session")?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        cookieStore.set("cart_session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });
    }

    return sessionId;
}

export async function addToCart(productId: number, quantity: number, size: string, color: string) {
    const supabase = await createClient();
    const sessionId = await getCartSessionId();

    const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("session_id", sessionId)
        .eq("product_id", productId)
        .eq("size", size || "")
        .eq("color", color || "")
        .single();

    if (existing) {
        const { error } = await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + quantity })
            .eq("id", existing.id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from("cart_items")
            .insert({
                session_id: sessionId,
                product_id: productId,
                quantity,
                size: size || "",
                color: color || "",
            });

        if (error) throw new Error(error.message);
    }

    revalidatePath("/cart");
    revalidatePath("/");
    return { success: true };
}

export async function getCartItems() {
    const supabase = await createClient();
    const sessionId = await getCartSessionId();

    const { data, error } = await supabase
        .from("cart_items")
        .select(`
      id,
      quantity,
      size,
      color,
      product_id,
      products (
        id,
        name,
        price,
        images
      )
    `)
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching cart:", error);
        return [];
    }

    // Transform data slightly to make it easy to consume
    return data.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        product: Array.isArray(item.products) ? item.products[0] : item.products
    }));
}

export async function updateCartItemQuantity(id: number, quantity: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/cart");
    return { success: true };
}

export async function removeFromCart(id: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/cart");
    return { success: true };
}

export async function getCartCount() {
    try {
        const supabase = await createClient();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("cart_session")?.value;

        if (!sessionId) return 0;

        const { data, error } = await supabase
            .from("cart_items")
            .select("quantity")
            .eq("session_id", sessionId);

        if (error) return 0;

        return data.reduce((acc, item) => acc + item.quantity, 0);
    } catch {
        return 0;
    }
}
