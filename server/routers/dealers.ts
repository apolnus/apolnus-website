import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { authorizedDealers, authorizedServiceCenters, onlineStores } from "../../drizzle/schema";

export const dealersRouter = router({
  // Authorized Dealers
  getDealers: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const dealers = await db.select().from(authorizedDealers).where(eq(authorizedDealers.isActive, 1));
    return dealers;
  }),

  getAllDealers: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const dealers = await db.select().from(authorizedDealers);
    return dealers;
  }),

  createDealer: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        address: z.string().min(1),
        businessHours: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(authorizedDealers).values(input);
      return { id: Number(result.insertId) };
    }),

  updateDealer: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        phone: z.string().min(1),
        address: z.string().min(1),
        businessHours: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        isActive: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(authorizedDealers).set(data).where(eq(authorizedDealers.id, id));
      return { success: true };
    }),

  deleteDealer: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(authorizedDealers).where(eq(authorizedDealers.id, input.id));
      return { success: true };
    }),

  // Authorized Service Centers
  getServiceCenters: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const centers = await db.select().from(authorizedServiceCenters).where(eq(authorizedServiceCenters.isActive, 1));
    return centers;
  }),

  getAllServiceCenters: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const centers = await db.select().from(authorizedServiceCenters);
    return centers;
  }),

  createServiceCenter: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        address: z.string().min(1),
        businessHours: z.string().optional(),
        services: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(authorizedServiceCenters).values(input);
      return { id: Number(result.insertId) };
    }),

  updateServiceCenter: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        phone: z.string().min(1),
        address: z.string().min(1),
        businessHours: z.string().optional(),
        services: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        isActive: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(authorizedServiceCenters).set(data).where(eq(authorizedServiceCenters.id, id));
      return { success: true };
    }),

  deleteServiceCenter: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(authorizedServiceCenters).where(eq(authorizedServiceCenters.id, input.id));
      return { success: true };
    }),

  // Online Stores (線上銷售渠道)
  getOnlineStores: publicProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const stores = await db.select()
        .from(onlineStores)
        .where(eq(onlineStores.country, input.country))
        .orderBy(onlineStores.type, onlineStores.displayOrder); // official 先, 然後按 displayOrder
      
      return stores.filter(s => s.isActive === 1);
    }),

  getAllOnlineStores: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const stores = await db.select().from(onlineStores).orderBy(onlineStores.country, onlineStores.type, onlineStores.displayOrder);
    return stores;
  }),

  upsertOnlineStore: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        country: z.string().min(1),
        type: z.enum(["official", "platform"]),
        name: z.string().min(1),
        url: z.string().optional(),
        logo: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // 如果是 official 類型，確保該國家只有一筆
      if (input.type === "official") {
        const existing = await db.select()
          .from(onlineStores)
          .where(eq(onlineStores.country, input.country));
        
        const officialStore = existing.find(s => s.type === "official");
        
        if (officialStore && (!input.id || officialStore.id !== input.id)) {
          // 更新現有的 official store
          const { id, ...data } = input;
          await db.update(onlineStores)
            .set(data)
            .where(eq(onlineStores.id, officialStore.id));
          return { id: officialStore.id };
        }
      }

      if (input.id) {
        // Update
        const { id, ...data } = input;
        await db.update(onlineStores).set(data).where(eq(onlineStores.id, id));
        return { id };
      } else {
        // Insert
        const result = await db.insert(onlineStores).values(input);
        return { id: Number(result.insertId) };
      }
    }),

  deleteOnlineStore: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(onlineStores).where(eq(onlineStores.id, input.id));
      return { success: true };
    }),

  // 批次更新線上平台順序
  updateOnlineStoresOrder: protectedProcedure
    .input(
      z.object({
        country: z.string(),
        storeIds: z.array(z.number()), // 按照新順序排列的 ID 陣列
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // 批次更新每個 store 的 displayOrder
      for (let i = 0; i < input.storeIds.length; i++) {
        await db.update(onlineStores)
          .set({ displayOrder: i })
          .where(eq(onlineStores.id, input.storeIds[i]));
      }

      return { success: true };
    }),
});
