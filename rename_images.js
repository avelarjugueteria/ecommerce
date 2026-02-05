
import fs from 'fs';
import path from 'path';
import { csvParse } from 'd3-dsv';

// Configuration
const CSV_FILE = 'Inventario Avelar Jugueterias - Hoja 1.csv';
const IMAGE_DIR = 'C:/Users/rriav/iCloudPhotos/Photos';

async function renameImages() {
    console.log("--- Starting Auto-Renaming Process ---");

    // 1. Read and Parse CSV to build a Mapping
    // Mapping: Barcode (CSV 'sku') -> Supabase SKU (CSV 'id')
    const csvPath = path.resolve(process.cwd(), CSV_FILE);
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV File not found: ${csvPath}`);
        return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const records = csvParse(csvContent);

    // Create Map: Barcode -> TargetSKU
    const barcodeToSku = new Map();
    records.forEach(row => {
        const barcode = row.sku ? row.sku.trim() : null; // "489..."
        const targetSku = row.id ? row.id.trim() : null; // "DT-..."

        if (barcode && targetSku) {
            // Check for duplicates
            if (barcodeToSku.has(barcode) && barcodeToSku.get(barcode) !== targetSku) {
                console.warn(`⚠️ Warning: Barcode ${barcode} maps to multiple IDs? Keeping ${barcodeToSku.get(barcode)}`);
            } else {
                barcodeToSku.set(barcode, targetSku);
            }
        }
    });

    console.log(`✅ Loaded ${barcodeToSku.size} mappings from CSV.`);

    // 2. Scan Directory
    if (!fs.existsSync(IMAGE_DIR)) {
        console.error(`❌ Image directory not found: ${IMAGE_DIR}`);
        return;
    }

    const files = fs.readdirSync(IMAGE_DIR);
    let renamedCount = 0;
    let errors = 0;

    console.log(`📂 Scanning ${files.length} files in ${IMAGE_DIR}...`);

    for (const file of files) {
        // Skip hidden files or directories
        if (file.startsWith('.')) continue;

        const ext = path.extname(file); // .jpg
        const basename = path.basename(file, ext); // "4891861280726_1" or "4891861280726"

        // Analyze filename structure
        // Pattern: [Barcode] OR [Barcode]_[Number]
        let barcode = basename;
        let suffix = '';

        // Check for suffix like _1, _2
        const suffixMatch = basename.match(/^(.+)(_\d+)$/);
        if (suffixMatch) {
            barcode = suffixMatch[1]; // "4891861280726"
            suffix = suffixMatch[2];  // "_1"
        }

        // 3. Check if we have a mapping for this barcode
        if (barcodeToSku.has(barcode)) {
            const cleanSku = barcodeToSku.get(barcode);
            const newName = `${cleanSku}${suffix}${ext}`; // "DT-STI12-01_1.jpg"

            const oldPath = path.join(IMAGE_DIR, file);
            const newPath = path.join(IMAGE_DIR, newName);

            // Don't rename if name is already correct
            if (oldPath === newPath) continue;

            // Handle potential collisions (if target file exists)
            if (fs.existsSync(newPath)) {
                console.log(`⏭️  Skipping ${file} -> Target ${newName} already exists.`);
                continue;
            }

            try {
                fs.renameSync(oldPath, newPath);
                console.log(`✨ Renamed: ${file} -> ${newName}`);
                renamedCount++;
            } catch (err) {
                console.error(`❌ Error renaming ${file}:`, err.message);
                errors++;
            }
        }
    }

    console.log("\n--- Renaming Summary ---");
    console.log(`✅ Successfully renamed: ${renamedCount}`);
    console.log(`❌ Errors: ${errors}`);
    console.log("------------------------");

    if (renamedCount > 0) {
        console.log("💡 Now you can run 'run_sync.bat' to upload the renamed images!");
    } else {
        console.log("⚠️ No matching barcodes found to rename. Are the files already renamed?");
    }
}

renameImages();
