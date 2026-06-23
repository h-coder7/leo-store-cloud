import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

type R2Config = {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
};

let client: S3Client | null = null;

function getR2Config(): R2Config {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
        throw new Error(
            'R2 storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.'
        );
    }

    return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
}

export function isR2Configured(): boolean {
    return Boolean(
        process.env.R2_ACCOUNT_ID &&
            process.env.R2_ACCESS_KEY_ID &&
            process.env.R2_SECRET_ACCESS_KEY &&
            process.env.R2_BUCKET_NAME &&
            process.env.R2_PUBLIC_URL
    );
}

function getR2Client(): S3Client {
    if (!client) {
        const { accountId, accessKeyId, secretAccessKey } = getR2Config();
        client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return client;
}

export function getR2PublicUrl(key: string): string {
    const { publicUrl } = getR2Config();
    const base = publicUrl.replace(/\/$/, '');
    const normalizedKey = key.replace(/^\//, '');
    return `${base}/${normalizedKey}`;
}

export function buildImageKey(folder: string, fileName: string): string {
    const ext = fileName.split('.').pop() || 'jpg';
    return `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
}

export async function uploadToR2(
    key: string,
    body: Buffer | Uint8Array,
    contentType: string
): Promise<void> {
    const { bucketName } = getR2Config();
    await getR2Client().send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        })
    );
}

/** Upload a store image (products, banners, offers, sections) to R2. */
export async function uploadStoreImage(
    buffer: Buffer,
    folder: string,
    contentType: string,
    originalName = 'image.jpg'
): Promise<string> {
    const key = buildImageKey(folder, originalName);
    await uploadToR2(key, buffer, contentType);
    return getR2PublicUrl(key);
}
