import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatWhatsAppNumber(phone: string): string {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');

    // If it starts with '0' and is an Egyptian number (11 digits)
    // Common Egyptian format: 010..., 011..., 012..., 015...
    if (digits.startsWith('0') && digits.length === 11) {
        digits = '2' + digits;
    }

    // If it starts with '1' and is 10 digits (Egyptian number without leading 0)
    if (digits.length === 10 && (digits.startsWith('10') || digits.startsWith('11') || digits.startsWith('12') || digits.startsWith('15'))) {
        digits = '20' + digits;
    }

    return digits;
}
