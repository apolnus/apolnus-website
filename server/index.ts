import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Diagnostics Check ---
(async function runDiagnostics() {
  try {
    const fs = await import("fs");
    console.log("[Diagnostics] Starting checks...");

    // 1. Check Project Root and Locales
    const projectRoot = process.cwd();
    console.log(`[Diagnostics] Process CWD: ${projectRoot}`);

    const localesDir = path.join(projectRoot, "client/src/i18n/locales");
    console.log(`[Diagnostics] Checking locales dir: ${localesDir}`);

    if (fs.existsSync(localesDir)) {
      const files = fs.readdirSync(localesDir);
      console.log(`[Diagnostics] Locales found (${files.length} files):`, files.join(", "));
      if (files.includes("zh-TW.json")) {
        console.log("[Diagnostics] ✅ zh-TW.json exists.");
      } else {
        console.error("[Diagnostics] ❌ zh-TW.json MISSING!");
      }
    } else {
      console.error("[Diagnostics] ❌ LOCALES DIRECTORY DOES NOT EXIST!");
      // Try listing parent dirs to see what exists
      const clientSrc = path.join(projectRoot, "client/src");
      if (fs.existsSync(clientSrc)) console.log(`[Diagnostics] client/src content: ${fs.readdirSync(clientSrc).join(", ")}`);
      else console.log("[Diagnostics] client/src missing");
    }

    // 2. Check AI Env Vars
    const hasApiUrl = !!process.env.BUILT_IN_FORGE_API_URL;
    const hasApiKey = !!process.env.BUILT_IN_FORGE_API_KEY;
    console.log(`[Diagnostics] AI Env Vars: URL=${hasApiUrl ? "OK" : "MISSING"}, KEY=${hasApiKey ? "OK" : "MISSING"}`);

    if (hasApiUrl && hasApiKey) {
      console.log("[Diagnostics] ✅ AI Translation service ready.");
    } else {
      console.warn("[Diagnostics] ⚠️ AI Translation service NOT configured (missing env vars).");
    }

    console.log("[Diagnostics] Checks completed.");
  } catch (e) {
    console.error("[Diagnostics] Critical error during checks:", e);
  }
})();
// -------------------------

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Translation API
  app.get("/api/translations/:lang", async (req, res) => {
    try {
      const { lang } = req.params;
      const { getDb } = await import("./db");
      const { translations } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const db = await getDb();
      const records = await db.select().from(translations).where(eq(translations.lang, lang));

      // Unflatten keys to nested object
      const result = {};
      for (const record of records) {
        const keys = record.key.split('.');
        let current: any = result;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (i === keys.length - 1) {
            current[key] = record.value;
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        }
      }

      res.json(result);
    } catch (error) {
      console.error("Failed to fetch translations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
