import { z } from "zod";
import { eq, like, and } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { serviceCenters } from "../../drizzle/schema";

export const supportRouter = router({
  // Get all service centers
  serviceCenters: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(serviceCenters.isActive, 1)];
      
      if (input.city && input.city !== "所有城市") {
        conditions.push(like(serviceCenters.address, `%${input.city}%`));
      }
      
      if (input.search) {
        conditions.push(like(serviceCenters.name, `%${input.search}%`));
      }

      const centers = await db
        .select()
        .from(serviceCenters)
        .where(and(...conditions));

      return centers;
    }),

  // Get all cities
  cities: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const centers = await db
      .select()
      .from(serviceCenters)
      .where(eq(serviceCenters.isActive, 1));
    
    // Extract unique cities from addresses
    const cities = new Set<string>();
    centers.forEach(center => {
      const match = center.address.match(/([^,，]+[市縣])/);
      if (match) {
        cities.add(match[1]);
      }
    });
    
    return Array.from(cities).sort();
  }),
});
