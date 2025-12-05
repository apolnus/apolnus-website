import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { warrantyRegistrations } from "../../drizzle/schema";

export const warrantyRouter = router({
  // Register a new warranty (requires authentication)
  register: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "姓名為必填"),
        email: z.string().email("請輸入有效的電子郵件"),
        phone: z.string().min(1, "聯絡電話為必填"),
        productModel: z.string().min(1, "產品型號為必填"),
        serialNumber: z.string().min(1, "產品序號為必填"),
        purchaseDate: z.string().min(1, "購買日期為必填"),
        purchaseChannel: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // 儲存時綁定當前用戶ID
      const result = await db.insert(warrantyRegistrations).values({
        userId: ctx.user.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        productModel: input.productModel,
        serialNumber: input.serialNumber,
        purchaseDate: new Date(input.purchaseDate),
        purchaseChannel: input.purchaseChannel || null,
        notes: input.notes || null,
      });

      return {
        success: true,
        id: result[0].insertId,
      };
    }),

  // Get warranty registrations for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    // 只回傳當前用戶的保固登錄資料
    const registrations = await db
      .select()
      .from(warrantyRegistrations)
      .where(eq(warrantyRegistrations.userId, ctx.user.id));
    return registrations;
  }),

  // Get warranty by serial number
  getBySerialNumber: publicProcedure
    .input(z.object({ serialNumber: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const result = await db
        .select()
        .from(warrantyRegistrations)
        .where(eq(warrantyRegistrations.serialNumber, input.serialNumber));
      
      return result[0] || null;
    }),
});
