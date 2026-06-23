import { uploadFormImage } from '@/lib/storage/upload'

// رفع صورة
export async function uploadImage(file: File, folder: string = 'products') {
    return uploadFormImage(file, folder)
}

// حذف صورة — R2 deletion not implemented; images use immutable unique keys
export async function deleteImage(_url: string) {
    // no-op: old URLs remain in storage; DB references are removed on entity delete
}
