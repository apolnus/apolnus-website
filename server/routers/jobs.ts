import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { jobs } from "../../drizzle/schema";
import { eq, and, like, or, desc } from "drizzle-orm";

export const jobsRouter = router({
  // 公開 API: 列出職缺 (支援篩選)
  list: publicProcedure
    .input(
      z.object({
        country: z.string().optional(),
        query: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions = [eq(jobs.isActive, 1)];

      if (input.country) {
        conditions.push(eq(jobs.country, input.country));
      }

      if (input.query) {
        conditions.push(
          or(
            like(jobs.title, `%${input.query}%`),
            like(jobs.department, `%${input.query}%`)
          )!
        );
      }

      const result = await db
        .select()
        .from(jobs)
        .where(and(...conditions))
        .orderBy(desc(jobs.postedAt));

      return result;
    }),

  // 管理員 API: 匯出所有職缺
  exportAll: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.select().from(jobs).orderBy(desc(jobs.postedAt));
    return result;
  }),

  // 管理員 API: 匯入職缺
  importJobs: protectedProcedure
    .input(
      z.object({
        jobs: z.array(
          z.object({
            title: z.string(),
            department: z.string(),
            country: z.string(),
            description: z.string(),
            requirements: z.string(),
            isActive: z.number().min(0).max(1),
            postedAt: z.string().optional(),
          })
        ),
        mode: z.enum(["append", "replace"]).default("append"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // 如果是替換模式,先刪除所有現有職缺
      if (input.mode === "replace") {
        await db.delete(jobs);
      }

      // 批次插入職缺
      const insertData = input.jobs.map((job) => ({
        ...job,
        postedAt: job.postedAt || new Date().toISOString(),
      }));

      if (insertData.length > 0) {
        await db.insert(jobs).values(insertData);
      }

      return {
        success: true,
        imported: insertData.length,
        mode: input.mode,
      };
    }),
});
