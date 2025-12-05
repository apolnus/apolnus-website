import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { warrantyRouter } from "./routers/warranty";
import { ticketsRouter } from "./routers/tickets";
import { supportRouter } from "./routers/support";
import { adminRouter } from "./routers/admin";
import { dealersRouter } from "./routers/dealers";
import { seoRouter } from "./routers/seo";
import { faqsRouter } from "./routers/faqs";
import { jobsRouter } from "./routers/jobs";
import { backupRouter } from "./routers/backup";
import { z } from "zod";
import { getDb } from "./db";
import { subscribers, seoSettings, users, socialLinks } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { protectedProcedure } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  warranty: warrantyRouter,
  tickets: ticketsRouter,
  support: supportRouter,
  admin: adminRouter,
  dealers: dealersRouter,
  seo: seoRouter,
  faqs: faqsRouter,
  jobs: jobsRouter,
  backup: backupRouter,

  // User profile management
  user: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        const userId = ctx.user!.id;
        
        await db.update(users)
          .set({
            ...(input.name !== undefined && { name: input.name }),
            ...(input.email !== undefined && { email: input.email }),
            ...(input.phone !== undefined && { phone: input.phone }),
            ...(input.address !== undefined && { address: input.address }),
          })
          .where(eq(users.id, userId));
        
        return { success: true };
      }),
  }),

  // Social Links Management
  socialLinks: router({
    // Public: Get social links by locale
    getByLocale: publicProcedure
      .input(z.object({
        locale: z.string().default('zh-TW'),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        const links = await db.select().from(socialLinks)
          .where(and(
            eq(socialLinks.locale, input.locale),
            eq(socialLinks.isActive, 1)
          ))
          .orderBy(socialLinks.displayOrder);
        return links;
      }),

    // Admin: Get all social links for a locale
    getAllByLocale: protectedProcedure
      .input(z.object({
        locale: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const db = await getDb();
        const links = await db.select().from(socialLinks)
          .where(eq(socialLinks.locale, input.locale))
          .orderBy(socialLinks.displayOrder);
        return links;
      }),

    // Admin: Update social links for a locale
    updateLinks: protectedProcedure
      .input(z.object({
        locale: z.string(),
        links: z.array(z.object({
          platform: z.string(),
          url: z.string(),
          isActive: z.number(),
          displayOrder: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const db = await getDb();
        
        // Update or insert each link
        for (const link of input.links) {
          const existing = await db.select().from(socialLinks)
            .where(and(
              eq(socialLinks.locale, input.locale),
              eq(socialLinks.platform, link.platform)
            ));
          
          if (existing.length > 0) {
            await db.update(socialLinks)
              .set({
                url: link.url,
                isActive: link.isActive,
                displayOrder: link.displayOrder,
              })
              .where(and(
                eq(socialLinks.locale, input.locale),
                eq(socialLinks.platform, link.platform)
              ));
          } else {
            await db.insert(socialLinks).values({
              locale: input.locale,
              platform: link.platform,
              url: link.url,
              isActive: link.isActive,
              displayOrder: link.displayOrder,
            });
          }
        }
        
        return { success: true };
      }),
  }),

  // Public SEO settings
  public: router({
    getSeo: publicProcedure
      .input(z.object({
        page: z.string(),
        language: z.string(),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        const result = await db.select().from(seoSettings)
          .where(and(
            eq(seoSettings.page, input.page),
            eq(seoSettings.language, input.language)
          ));
        return result[0] || null;
      }),
  }),

  // Public newsletter subscription
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        try {
          const [result] = await db.insert(subscribers).values({ 
            email: input.email,
            subscribedAt: new Date()
          });
          return { success: true, id: result.insertId };
        } catch (error: any) {
          // Handle duplicate email error - check multiple possible error formats
          const isDuplicate = 
            error.code === 'ER_DUP_ENTRY' || 
            error.errno === 1062 || // MySQL duplicate entry error number
            error.message?.includes('Duplicate entry') ||
            error.message?.includes('unique constraint') ||
            error.message?.includes('UNIQUE constraint failed') ||
            error.cause?.message?.includes('Duplicate entry') || // Check cause for Drizzle ORM wrapped errors
            error.cause?.code === 'ER_DUP_ENTRY' ||
            error.cause?.errno === 1062;
          
          if (isDuplicate) {
            throw new Error('This email is already subscribed');
          }
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
