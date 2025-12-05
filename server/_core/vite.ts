import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getSeoByPath } from "./seoHelper";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      
      // --- SEO 注入核心邏輯 ---
      // 使用 url 而非 req.path，因為 Vite 可能會修改 req.path
      const seoData = await getSeoByPath(url);
      
      if (seoData) {
        const title = seoData.title || "Apolnus";
        const desc = seoData.description || "";
        const keywords = seoData.keywords || "";
        // 強制使用寫死的 OG 圖片
        const ogImage = "/og-image.jpg";
        
        // 替換 Title
        template = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        
        // 注入 Meta Tags
        let metaTags = `
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${keywords}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">`;
        
        // 如果有 og_image，添加 OG Image 標籤
        if (ogImage) {
          metaTags += `
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${ogImage}">`;
        }
        
        template = template.replace("</head>", `${metaTags}\n  </head>`);
      }
      // -----------------------
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res) => {
    try {
      let template = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      
      // --- SEO 注入核心邏輯 (Production) ---
      const seoData = await getSeoByPath(req.originalUrl || req.path);
      
      if (seoData) {
        const title = seoData.title || "Apolnus";
        const desc = seoData.description || "";
        const keywords = seoData.keywords || "";
        // 強制使用寫死的 OG 圖片
        const ogImage = "/og-image.jpg";
        
        // 替換 Title
        template = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        
        // 注入 Meta Tags
        let metaTags = `
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${keywords}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">`;
        
        // 如果有 og_image，添加 OG Image 標籤
        if (ogImage) {
          metaTags += `
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${ogImage}">`;
        }
        
        template = template.replace("</head>", `${metaTags}\n  </head>`);
      }
      // -----------------------
      
      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    } catch (e) {
      console.error("SEO Injection Error:", e);
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
