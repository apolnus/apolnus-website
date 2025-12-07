import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { authRouter } from "./auth_routes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { sitemapHandler, robotsHandler } from "./sitemap";
import { getSeoByPath } from "./seoHelper";
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';
import { storagePut } from '../storage';
import { registerBackupDownloadRoutes } from '../routers/backup';
import { getDb } from '../db';

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// --- Diagnostics Check ---
(async function runDiagnostics() {
  try {
    const fs = await import("fs");
    console.log("[Diagnostics] Starting checks...");

    // 1. Check Project Root and Locales
    const projectRoot = process.cwd();
    console.log(`[Diagnostics] Process CWD: ${projectRoot}`);

    // Check both potential paths
    const localesPaths = [
      path.join(projectRoot, "client/src/i18n/locales"),
      path.join(projectRoot, "dist/client/src/i18n/locales") // Just in case structure is different in dist
    ];

    let found = false;
    for (const localesDir of localesPaths) {
      console.log(`[Diagnostics] Checking locales dir: ${localesDir}`);

      if (fs.existsSync(localesDir)) {
        found = true;
        const files = fs.readdirSync(localesDir);
        console.log(`[Diagnostics] Locales found at ${localesDir} (${files.length} files):`, files.join(", "));
        if (files.includes("zh-TW.json")) {
          console.log("[Diagnostics] ✅ zh-TW.json exists.");
        } else {
          console.error("[Diagnostics] ❌ zh-TW.json MISSING!");
        }
      }
    }

    if (!found) {
      console.error("[Diagnostics] ❌ LOCALES DIRECTORY DOES NOT EXIST in any expected location!");
      // Try listing recursive to find where it is
      try {
        const listDeep = (dir: string, depth = 0) => {
          if (depth > 2) return;
          const files = fs.readdirSync(dir);
          console.log(`[Diagnostics] Listing ${dir}: ${files.join(', ')}`);
          files.forEach(f => {
            const full = path.join(dir, f);
            if (fs.statSync(full).isDirectory() && !full.includes('node_modules')) {
              listDeep(full, depth + 1);
            }
          });
        };
        // listDeep(projectRoot); // Too verbose, maybe just list root and client
        console.log(`[Diagnostics] Root listing: ${fs.readdirSync(projectRoot).join(', ')}`);
        if (fs.existsSync(path.join(projectRoot, 'client')))
          console.log(`[Diagnostics] Client listing: ${fs.readdirSync(path.join(projectRoot, 'client')).join(', ')}`);
      } catch (e) { }
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
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Sitemap.xml and robots.txt routes - must be registered before static files
  app.get("/sitemap.xml", sitemapHandler);
  app.get("/robots.txt", robotsHandler);

  // 檔案上傳 API
  const upload = multer({ storage: multer.memoryStorage() });
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '沒有檔案' });
      }

      const category = req.body.category || 'uploads';
      const fileName = `${category}/${Date.now()}-${req.file.originalname}`;
      const result = await storagePut(fileName, req.file.buffer, req.file.mimetype);

      res.json({ url: result.url, key: result.key });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: '上傳失敗' });
    }
  });

  // Backup download routes
  registerBackupDownloadRoutes(app);
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Google & LINE OAuth routes
  app.use(authRouter);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Debug Route for Database Check
  app.get('/api/debug/db-check', async (req, res) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("DB Connection Failed");

      const { authorizedServiceCenters, users } = await import('../../drizzle/schema');
      const { sql } = await import('drizzle-orm');

      // @ts-ignore
      const [centerCount] = await db.select({ count: sql`count(*)` }).from(authorizedServiceCenters);
      // @ts-ignore
      const [userCount] = await db.select({ count: sql`count(*)` }).from(users);

      res.json({
        status: 'ok',
        databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'), // Mask password
        counts: {
          centers: centerCount,
          users: userCount
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message, stack: e.stack });
    }
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
