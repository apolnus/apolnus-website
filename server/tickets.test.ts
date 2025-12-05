import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { supportTickets, ticketReplies } from "../drizzle/schema";
import { eq } from "drizzle-orm";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: role === "admin" ? 999 : 1,
    openId: role === "admin" ? "admin-user" : "test-user",
    email: role === "admin" ? "admin@example.com" : "test@example.com",
    name: role === "admin" ? "Admin User" : "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Ticket System", () => {
  let testTicketId: number;
  let testReplyId: number;

  beforeAll(async () => {
    // Clean up test data
    const db = await getDb();
    if (db) {
      await db.delete(ticketReplies).where(eq(ticketReplies.ticketId, 99999));
      await db.delete(supportTickets).where(eq(supportTickets.id, 99999));
    }
  });

  describe("tickets.create", () => {
    it("should create a ticket with all required fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.create({
        contactName: "測試用戶",
        contactPhone: "0912345678",
        contactAddress: "台北市信義區測試路123號",
        productModel: "One X",
        productSerial: "TEST123456",
        purchaseDate: "2024-01-01",
        purchaseChannel: "官方網站",
        issueTitle: "測試工單",
        issueDescription: "這是一個測試工單的描述",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf("number");
      testTicketId = result.id;
    });

    it("should create a ticket without optional fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.create({
        contactName: "測試用戶2",
        contactPhone: "0987654321",
        contactAddress: "台北市大安區測試路456號",
        productModel: "One X",
        issueTitle: "簡單測試工單",
        issueDescription: "沒有選填欄位的測試",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf("number");
    });
  });

  describe("tickets.getById", () => {
    it("should retrieve ticket by ID", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const ticket = await caller.tickets.getById({ id: testTicketId });

      expect(ticket).not.toBeNull();
      expect(ticket?.issueTitle).toBe("測試工單");
      expect(ticket?.contactName).toBe("測試用戶");
      expect(ticket?.status).toBe("pending");
    });

    it("should return null for non-existent ticket", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const ticket = await caller.tickets.getById({ id: 999999 });

      expect(ticket).toBeNull();
    });
  });

  describe("tickets.addReply", () => {
    it("should add a user reply to ticket", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.addReply({
        ticketId: testTicketId,
        message: "這是用戶的回覆",
        isAdmin: false,
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf("number");
      testReplyId = result.id;
    });

    it("should add an admin reply to ticket", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.addReply({
        ticketId: testTicketId,
        message: "這是客服人員的回覆",
        isAdmin: true,
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf("number");
    });
  });

  describe("tickets.getReplies", () => {
    it("should retrieve all replies for a ticket", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const replies = await caller.tickets.getReplies({ ticketId: testTicketId });

      expect(replies.length).toBeGreaterThanOrEqual(2);
      expect(replies[0]?.message).toBe("這是用戶的回覆");
      expect(replies[0]?.isAdmin).toBe(0);
      expect(replies[1]?.message).toBe("這是客服人員的回覆");
      expect(replies[1]?.isAdmin).toBe(1);
    });

    it("should return empty array for ticket with no replies", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const replies = await caller.tickets.getReplies({ ticketId: 999999 });

      expect(replies).toEqual([]);
    });
  });

  describe("tickets.updateStatus", () => {
    it("should update ticket status (admin only)", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.updateStatus({
        ticketId: testTicketId,
        status: "in_progress",
      });

      expect(result.success).toBe(true);

      // Verify status was updated
      const ticket = await caller.tickets.getById({ id: testTicketId });
      expect(ticket?.status).toBe("in_progress");
    });

    it("should update ticket status to resolved", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.updateStatus({
        ticketId: testTicketId,
        status: "resolved",
      });

      expect(result.success).toBe(true);

      const ticket = await caller.tickets.getById({ id: testTicketId });
      expect(ticket?.status).toBe("resolved");
    });
  });

  describe("tickets.myTickets", () => {
    it("should retrieve user's own tickets", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const tickets = await caller.tickets.myTickets();

      expect(Array.isArray(tickets)).toBe(true);
      // Note: May be empty if no tickets belong to this user
    });
  });

  describe("tickets.listWithFilters", () => {
    it("should list all tickets without filters", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const tickets = await caller.tickets.listWithFilters({});

      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets.length).toBeGreaterThan(0);
    });

    it("should filter tickets by status", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const tickets = await caller.tickets.listWithFilters({
        status: "resolved",
      });

      expect(Array.isArray(tickets)).toBe(true);
      tickets.forEach((ticket) => {
        expect(ticket.status).toBe("resolved");
      });
    });

    it("should filter tickets by search keyword", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const tickets = await caller.tickets.listWithFilters({
        search: "測試",
      });

      expect(Array.isArray(tickets)).toBe(true);
      if (tickets.length > 0) {
        const hasKeyword = tickets.some(
          (t) =>
            t.issueTitle.includes("測試") ||
            t.contactName.includes("測試") ||
            t.issueDescription.includes("測試")
        );
        expect(hasKeyword).toBe(true);
      }
    });

    it("should filter tickets by both status and search", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const tickets = await caller.tickets.listWithFilters({
        status: "resolved",
        search: "測試",
      });

      expect(Array.isArray(tickets)).toBe(true);
      tickets.forEach((ticket) => {
        expect(ticket.status).toBe("resolved");
      });
    });
  });
});
