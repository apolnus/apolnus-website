import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
