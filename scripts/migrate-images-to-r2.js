/**
 * Migrate store images from Supabase Storage to Cloudflare R2.
 *
 * Skips transfers/ (checkout payment proofs stay on Supabase).
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-images-to-r2.js
 *   node --env-file=.env.local scripts/migrate-images-to-r2.js --dry-run
 */

const { createClient } = require('@supabase/supabase-js');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const DRY_RUN = process.argv.includes('--dry-run');
const SUPABASE_MARKER = '/storage/v1/object/public/images/';

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        console.error(`Missing env: ${name}`);
        process.exit(1);
    }
    return value;
}

function getR2Client() {
    const accountId = requireEnv('R2_ACCOUNT_ID');
    return new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
            secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
        },
    });
}

function getR2PublicUrl(key) {
    const base = requireEnv('R2_PUBLIC_URL').replace(/\/$/, '');
    return `${base}/${key.replace(/^\//, '')}`;
}

function extractStorageKey(url) {
    if (!url || typeof url !== 'string') return null;
    const idx = url.indexOf(SUPABASE_MARKER);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + SUPABASE_MARKER.length));
}

function shouldMigrateKey(key) {
    if (!key) return false;
    if (key.startsWith('transfers/')) return false;
    return true;
}

function isAlreadyOnR2(url) {
    const publicUrl = process.env.R2_PUBLIC_URL;
    return Boolean(publicUrl && url.startsWith(publicUrl.replace(/\/$/, '')));
}

const migrated = new Map();

async function migrateUrl(supabase, r2, bucketName, url) {
    if (!url || isAlreadyOnR2(url)) return url;

    if (migrated.has(url)) return migrated.get(url);

    const key = extractStorageKey(url);
    if (!key || !shouldMigrateKey(key)) return url;

    console.log(`  → ${key}`);

    if (DRY_RUN) {
        const newUrl = getR2PublicUrl(key);
        migrated.set(url, newUrl);
        return newUrl;
    }

    const { data, error } = await supabase.storage.from('images').download(key);
    if (error) {
        console.error(`    ✗ download failed: ${error.message}`);
        return url;
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    const contentType = data.type || 'application/octet-stream';

    await r2.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        })
    );

    const newUrl = getR2PublicUrl(key);
    migrated.set(url, newUrl);
    return newUrl;
}

async function migrateStringField(supabase, r2, bucketName, url) {
    if (!url || !extractStorageKey(url)) return url;
    return migrateUrl(supabase, r2, bucketName, url);
}

async function migrateProducts(supabase, r2, bucketName) {
    console.log('\nProducts…');
    const { data: products, error } = await supabase.from('products').select('id, images, size_chart_image');
    if (error) throw error;

    for (const product of products ?? []) {
        let changed = false;
        const images = [];

        for (const url of product.images ?? []) {
            const next = await migrateUrl(supabase, r2, bucketName, url);
            if (next !== url) changed = true;
            images.push(next);
        }

        const size_chart_image = await migrateStringField(
            supabase,
            r2,
            bucketName,
            product.size_chart_image
        );
        if (size_chart_image !== product.size_chart_image) changed = true;

        if (!changed) continue;

        console.log(`  product #${product.id}`);
        if (!DRY_RUN) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ images, size_chart_image })
                .eq('id', product.id);
            if (updateError) console.error(`    ✗ update failed: ${updateError.message}`);
        }
    }
}

async function migrateTableImageColumn(supabase, r2, bucketName, table, column) {
    console.log(`\n${table}.${column}…`);
    const { data: rows, error } = await supabase.from(table).select(`id, ${column}`);
    if (error) throw error;

    for (const row of rows ?? []) {
        const current = row[column];
        const next = await migrateStringField(supabase, r2, bucketName, current);
        if (next === current) continue;

        console.log(`  ${table} #${row.id}`);
        if (!DRY_RUN) {
            const { error: updateError } = await supabase
                .from(table)
                .update({ [column]: next })
                .eq('id', row.id);
            if (updateError) console.error(`    ✗ update failed: ${updateError.message}`);
        }
    }
}

async function main() {
    console.log(DRY_RUN ? 'DRY RUN — no uploads or DB writes' : 'Migrating Supabase images → R2…');

    const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
    const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    const bucketName = requireEnv('R2_BUCKET_NAME');

    const supabase = createClient(supabaseUrl, serviceKey);
    const r2 = getR2Client();

    await migrateProducts(supabase, r2, bucketName);
    await migrateTableImageColumn(supabase, r2, bucketName, 'banners', 'image_url');
    await migrateTableImageColumn(supabase, r2, bucketName, 'offers', 'image_url');
    await migrateTableImageColumn(supabase, r2, bucketName, 'sections', 'image_url');

    console.log(`\nDone. ${migrated.size} unique image(s) ${DRY_RUN ? 'would be' : ''} migrated.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
