export type Section = {
    id: number
    name: string
    image_url: string | null
    parent: 'boy' | 'girl' | 'offers' | null
    created_at: string
}

export type ProductOffer = {
    id: string
    title: string
    discount: number
    is_active: boolean
    type: 'free_shipping' | 'percentage'
    show_button: boolean
    button_text?: string
    quantity: number
    is_free_shipping?: boolean
}

export type Product = {
    id: number
    name: string
    description: string | null
    price: number
    stock: number
    images: string[] | null
    sizes: string[] | null
    colors: string[] | null
    color_sizes: Record<string, string[]> | null
    season: 'صيف' | 'شتاء' | 'كل الموسم' | null
    section_id: number | null
    size_chart_image: string | null
    offer_title: string | null
    offer_discount: number | null
    offer_image: string | null
    offers: ProductOffer[] | null
    created_at: string
}

export type Order = {
    id: number
    customer_name: string
    phone: string
    address: string
    governorate: string
    items: OrderItem[]
    total: number
    status: 'جديد' | 'تم الشحن' | 'تم التسليم' | 'ملغي'
    created_at: string
}

export type OrderItem = {
    product_id: number
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
}

export type Testimonial = {
    id: number
    name: string
    role: string | null
    content: string
    rating: number
    avatar_url: string | null
    created_at: string
}

export type CartItem = {
    product_id: number
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
}

export type Offer = {
    id: number
    title: string
    description: string
    discount_label: string
    image_url: string
    is_active: boolean
    type: 'free_shipping' | 'percentage' | 'fixed_amount'
    min_quantity: number
    discount_value: number
    is_free_shipping: boolean
    created_at: string
}