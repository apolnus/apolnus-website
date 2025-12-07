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

    // New filenames after renaming
    const newFiles = ['jp.json', 'tw.json', 'cn.json'];
    for (const fileName of newFiles) {
        const filePath = path.join(localesDir, fileName);
        console.log(`[Diagnostic] Checking file: ${filePath}`);
        try {
            if (fs.existsSync(filePath)) {
                console.log('[Diagnostic] ✅ File exists on disk.');
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                const keys = Object.keys(data).length;
                console.log(`[Diagnostic] ✅ File parsed successfully. Found ${keys} keys.`);
                console.log('[Diagnostic] Sample keys:', Object.keys(data).slice(0, 3));
            } else {
                console.error('[Diagnostic] ❌ File NOT found at constructed path.');
            }
        } catch (error) {
            console.error('[Diagnostic] ❌ Error reading file:', error);
        }
    }

    console.log('--- Verification Script End ---');
}

verifyTranslationAccess();
