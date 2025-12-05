import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { supportTickets, ticketReplies } from "../../drizzle/schema";

export const ticketsRouter = router({
  // Create a new support ticket
  create: protectedProcedure
    .input(
      z.object({
        contactName: z.string().min(1, "聯絡人姓名為必填"),
        contactPhone: z.string().min(1, "聯絡電話為必填"),
        contactAddress: z.string().min(1, "聯絡地址為必填"),
        productModel: z.string().min(1, "產品型號為必填"),
        productSerial: z.string().optional(),
        purchaseDate: z.string().optional(),
        purchaseChannel: z.string().optional(),
        issueTitle: z.string().min(1, "問題標題為必填"),
        issueDescription: z.string().min(1, "問題描述為必填"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(supportTickets).values({
        userId: ctx.user.id,
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        contactAddress: input.contactAddress,
        productModel: input.productModel,
        serialNumber: input.productSerial || null,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : null,
        purchaseChannel: input.purchaseChannel || null,
        issueTitle: input.issueTitle,
        issueDescription: input.issueDescription,
        status: "pending",
      });

      return {
        success: true,
        id: result[0].insertId,
      };
    }),

  // Get user's tickets with unread reply count
  myTickets: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const tickets = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, ctx.user.id))
      .orderBy(desc(supportTickets.createdAt));
    
    // For each ticket, count unread admin replies
    const ticketsWithUnreadCount = await Promise.all(
      tickets.map(async (ticket) => {
        const unreadReplies = await db
          .select()
          .from(ticketReplies)
          .where(eq(ticketReplies.ticketId, ticket.id));
        
        const unreadCount = unreadReplies.filter(
          (reply) => reply.isAdmin === 1 && reply.isReadByUser === 0
        ).length;
        
        return {
          ...ticket,
          unreadCount,
        };
      })
    );
    
    return ticketsWithUnreadCount;
  }),

  // Get all tickets (for admin)
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const tickets = await db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
    
    return tickets;
  }),

  // Get ticket by ID (with permission check)
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.id, input.id));
      
      const ticket = result[0];
      if (!ticket) return null;

      // Permission check: users can only view their own tickets, admins can view all
      if (ctx.user.role !== 'admin' && ticket.userId !== ctx.user.id) {
        throw new Error('您沒有權限查看此工單');
      }
      
      return ticket;
    }),

  // Add reply to ticket (with attachments support)
  addReply: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        message: z.string().min(1, "回覆內容為必填"),
        isAdmin: z.boolean().default(false),
        attachments: z.array(z.string()).optional(), // Array of image URLs
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(ticketReplies).values({
        ticketId: input.ticketId,
        userId: ctx.user.id,
        isAdmin: input.isAdmin ? 1 : 0,
        message: input.message,
        attachments: input.attachments ? JSON.stringify(input.attachments) : null,
      });

      return {
        success: true,
        id: result[0].insertId,
      };
    }),

  // Get ticket replies
  getReplies: publicProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const replies = await db
        .select()
        .from(ticketReplies)
        .where(eq(ticketReplies.ticketId, input.ticketId))
        .orderBy(ticketReplies.createdAt);
      
      return replies;
    }),

  // Update ticket status
  updateStatus: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        status: z.enum(["pending", "in_progress", "resolved", "closed"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(supportTickets)
        .set({ status: input.status })
        .where(eq(supportTickets.id, input.ticketId));

      return { success: true };
    }),

  // Mark all replies of a ticket as read
  markRepliesAsRead: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Mark all admin replies as read
      await db
        .update(ticketReplies)
        .set({ isReadByUser: 1 })
        .where(eq(ticketReplies.ticketId, input.ticketId));

      return { success: true };
    }),

  // Batch update ticket status
  batchUpdateStatus: protectedProcedure
    .input(
      z.object({
        ticketIds: z.array(z.number()).min(1, "至少選擇一個工單"),
        status: z.enum(["pending", "in_progress", "resolved", "closed"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Update all selected tickets
      for (const ticketId of input.ticketIds) {
        await db
          .update(supportTickets)
          .set({ status: input.status })
          .where(eq(supportTickets.id, ticketId));
      }

      return { 
        success: true, 
        count: input.ticketIds.length 
      };
    }),

  // List tickets with filters (for admin)
  listWithFilters: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "in_progress", "resolved", "closed"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(supportTickets);

      if (input.status) {
        query = query.where(eq(supportTickets.status, input.status)) as any;
      }

      const tickets = await query.orderBy(desc(supportTickets.createdAt));
      
      // Filter by search keyword if provided
      let filteredTickets = tickets;
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filteredTickets = tickets.filter(
          (t) =>
            t.issueTitle.toLowerCase().includes(searchLower) ||
            t.contactName.toLowerCase().includes(searchLower) ||
            t.issueDescription.toLowerCase().includes(searchLower)
        );
      }

      // For each ticket, count unread user replies (for admin view)
      const ticketsWithUnreadCount = await Promise.all(
        filteredTickets.map(async (ticket) => {
          const unreadReplies = await db
            .select()
            .from(ticketReplies)
            .where(eq(ticketReplies.ticketId, ticket.id));
          
          const unreadCount = unreadReplies.filter(
            (reply) => reply.isAdmin === 0 && reply.isReadByAdmin === 0
          ).length;
          
          return {
            ...ticket,
            unreadCount,
          };
        })
      );

      return ticketsWithUnreadCount;
    }),
});
