import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Simulation of the server code logic
async function verifyTranslationAccess() {
    console.log('--- Verification Script Start ---');

    const projectRoot = process.cwd();
    console.log(`[Diagnostic] process.cwd(): ${projectRoot}`);

    // Construct path exactly as in the server code
    const possiblePaths = [
        path.join(projectRoot, 'locales'),              // Production (simplified path)
        path.join(projectRoot, 'client/src/i18n/locales') // Development
    ];

    let localesDir = '';
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            localesDir = p;
            console.log(`[Diagnostic] Found locales at: ${localesDir}`);
            break;
        }
    }

    if (!localesDir) {
        console.error(`[Diagnostic] ❌ Locales directory NOT found in any expected path: ${possiblePaths.join(', ')}`);
        return;
    }

    const zhTWPath = path.join(localesDir, 'zh-TW.json');

    console.log(`[Diagnostic] Constructed Path: ${zhTWPath}`);

    try {
        if (fs.existsSync(zhTWPath)) {
            console.log('[Diagnostic] ✅ File exists on disk.');
            const content = fs.readFileSync(zhTWPath, 'utf-8');
            const data = JSON.parse(content);
            const keys = Object.keys(data).length;
            console.log(`[Diagnostic] ✅ File parsed successfully. Found ${keys} keys.`);
            console.log('[Diagnostic] Sample keys:', Object.keys(data).slice(0, 3));
        } else {
            console.error('[Diagnostic] ❌ File NOT found at constructed path.');

            // Debug: what IS in the parent dir?
            if (fs.existsSync(localesDir)) {
                console.log(`[Diagnostic] Contents of ${localesDir}:`, fs.readdirSync(localesDir));
            } else {
                console.log(`[Diagnostic] Parent directory ${localesDir} does not exist.`);
            }
        }
    } catch (error) {
        console.error('[Diagnostic] ❌ Error reading file:', error);
    }

    console.log('--- Verification Script End ---');
}

verifyTranslationAccess();
