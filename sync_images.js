
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
// import mime from 'mime-types'; // Removed to avoid dependency
// If mime-types is not available, we can use a simple lookup or just hardcode for jpg/png

// --- CONFIGURATION ---
// Local folder where iCloud Photos are synced
const LOCAL_PHOTOS_DIR = 'C:\\Users\\rriav\\iCloudPhotos\\Photos';

// Supabase Bucket Name
const BUCKET_NAME = 'Inventario inicial';

// Allowed extensions
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// --- SETUP ---
const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envConfig[key.trim()] = value.trim();
});

const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(envConfig.VITE_SUPABASE_URL, supabaseKey);

if (!envConfig.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️  WARNING: No SUPABASE_SERVICE_ROLE_KEY found. Uploads might fail due to RLS policies.");
}

async function syncImages() {
    console.log('🚀 Starting Inventory Sync...');
    console.log(`📁 Scanning local folder: ${LOCAL_PHOTOS_DIR}`);

    if (!fs.existsSync(LOCAL_PHOTOS_DIR)) {
        console.error(`❌ Error: Directory not found: ${LOCAL_PHOTOS_DIR}`);
        return;
    }

    // 1. Get all products from DB
    console.log('📦 Fetching products from Supabase...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, sku, main_image_url, additional_images');

    if (error) {
        console.error('❌ DB Error:', error.message);
        return;
    }
    console.log(`✅ Found ${products.length} products.`);

    // 2. Scan local directory
    const files = fs.readdirSync(LOCAL_PHOTOS_DIR);
    const fileMap = new Map(); // Filename (lowercase) -> Real Filename
    files.forEach(f => fileMap.set(f.toLowerCase(), f));

    let updatedCount = 0;

    // 3. Process each product
    for (const product of products) {
        if (!product.sku) continue;

        const sku = product.sku.trim();
        let mainImageChanged = false;
        let additionalImagesChanged = false;
        let newMainUrl = product.main_image_url;
        let newAdditionalUrls = product.additional_images || [];

        // --- A. Process Main Image (SKU.jpg) ---
        const mainImageName = findFile(fileMap, sku);
        if (mainImageName) {
            const publicUrl = await uploadIfNotExists(mainImageName);
            if (publicUrl && publicUrl !== product.main_image_url) {
                newMainUrl = publicUrl;
                mainImageChanged = true;
                console.log(`   📸 Linked Main Image for ${sku}`);
            }
        }

        // --- B. Process Gallery Images (SKU_1.jpg, SKU_2.jpg...) ---
        const foundGalleryUrls = [];
        for (let i = 1; i <= 5; i++) {
            const suffix = `_${i}`;
            const galleryImageName = findFile(fileMap, sku + suffix);
            if (galleryImageName) {
                const publicUrl = await uploadIfNotExists(galleryImageName);
                if (publicUrl) foundGalleryUrls.push(publicUrl);
            }
        }

        // Check if gallery changed (simple length/content check)
        // We replace the entire list if we found local files, to ensure sync.
        // OR we can merge. For "Sync", merging or replacing depends on strategy.
        // Strategy: If local files exist, they are the source of truth.
        if (foundGalleryUrls.length > 0) {
            // careful not to overwrite if we simply didn't find new ones but wanted to keep old ones?
            // User wants automation. Let's assume matches logic.
            // If we found matches locally, we update the DB list to match these.
            const currentJson = JSON.stringify(product.additional_images || []);
            const newJson = JSON.stringify(foundGalleryUrls);
            if (currentJson !== newJson) {
                newAdditionalUrls = foundGalleryUrls;
                additionalImagesChanged = true;
                console.log(`   🖼️  Linked ${foundGalleryUrls.length} Gallery Images for ${sku}`);
            }
        }

        // --- C. Update Database ---
        if (mainImageChanged || additionalImagesChanged) {
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    main_image_url: newMainUrl,
                    additional_images: newAdditionalUrls
                })
                .eq('id', product.id);

            if (updateError) {
                console.error(`   ❌ Failed to update ${sku}: ${updateError.message}`);
            } else {
                console.log(`   ✅ Synced ${sku}`);
                updatedCount++;
            }
        }
    }

    console.log('------------------------------------------------');
    console.log(`🎉 Sync Complete. Updated ${updatedCount} products.`);
}

function findFile(fileMap, baseName) {
    for (const ext of EXTENSIONS) {
        const key = (baseName + ext).toLowerCase();
        if (fileMap.has(key)) {
            return fileMap.get(key);
        }
    }
    return null;
}

async function uploadIfNotExists(filename) {
    const localPath = path.join(LOCAL_PHOTOS_DIR, filename);
    const fileBuffer = fs.readFileSync(localPath);
    const storagePath = filename; // We upload to root of bucket or folder? User said "Inventario inicial"

    // 1. Upload (Upsert: true implies we overwrite if exists, ensuring latest version)
    // To be efficient, we *could* check if exists first, but upsert is safer for "latest version"
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
            contentType: getMimeType(filename),
            upsert: true
        });

    if (error) {
        console.error(`      ⚠️  Upload failed for ${filename}: ${error.message}`);
        return null;
    }

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

    return urlData.publicUrl;
}

function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.png') return 'image/png';
    if (ext === '.webp') return 'image/webp';
    return 'application/octet-stream';
}

syncImages();
