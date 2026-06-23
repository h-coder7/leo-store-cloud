import { uploadStoreImage } from '@/lib/r2';

/** Upload a File from a server action form to R2 (store images only). */
export async function uploadFormImage(file: File, folder: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return uploadStoreImage(buffer, folder, file.type || 'application/octet-stream', file.name);
}
