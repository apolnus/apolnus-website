import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "mysql://root:root@localhost:3306/apolnus",
  },
});
