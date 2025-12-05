import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import type { User } from '../drizzle/schema';

describe('Ticket Permission Tests', () => {
  let db: Awaited<ReturnType<typeof getDb>>;
  let testTicketId: number;
  let userContext: { user: User };
  let adminContext: { user: User };
  let otherUserContext: { user: User };

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create test users
    const userResult = await db.execute(`
      INSERT INTO users (openId, name, email, role) 
      VALUES ('test-user-1', 'Test User', 'user@test.com', 'user')
      ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
    `);
    
    const adminResult = await db.execute(`
      INSERT INTO users (openId, name, email, role) 
      VALUES ('test-admin-1', 'Test Admin', 'admin@test.com', 'admin')
      ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
    `);
    
    const otherUserResult = await db.execute(`
      INSERT INTO users (openId, name, email, role) 
      VALUES ('test-user-2', 'Other User', 'other@test.com', 'user')
      ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
    `);

    const userId = (userResult as any)[0].insertId;
    const adminId = (adminResult as any)[0].insertId;
    const otherUserId = (otherUserResult as any)[0].insertId;

    // Create contexts
    userContext = {
      user: {
        id: userId,
        openId: 'test-user-1',
        name: 'Test User',
        email: 'user@test.com',
        role: 'user',
        avatar: null,
        phone: null,
        address: null,
        loginMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };

    adminContext = {
      user: {
        id: adminId,
        openId: 'test-admin-1',
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
        avatar: null,
        phone: null,
        address: null,
        loginMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };

    otherUserContext = {
      user: {
        id: otherUserId,
        openId: 'test-user-2',
        name: 'Other User',
        email: 'other@test.com',
        role: 'user',
        avatar: null,
        phone: null,
        address: null,
        loginMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };

    // Create a test ticket owned by userContext
    const ticketResult = await db.execute(`
      INSERT INTO supportTickets (
        userId, contactName, contactPhone, contactAddress, 
        productModel, issueTitle, issueDescription, status
      ) VALUES (
        ${userId}, 'Test User', '0912345678', 'Test Address',
        'One X', 'Test Issue', 'Test Description', 'pending'
      )
    `);

    testTicketId = (ticketResult as any)[0].insertId;
  });

  it('should allow user to view their own ticket', async () => {
    const caller = appRouter.createCaller(userContext);
    
    const ticket = await caller.tickets.getById({ id: testTicketId });
    
    expect(ticket).toBeDefined();
    expect(ticket?.id).toBe(testTicketId);
    expect(ticket?.userId).toBe(userContext.user.id);
  });

  it('should prevent user from viewing other users ticket', async () => {
    const caller = appRouter.createCaller(otherUserContext);
    
    await expect(
      caller.tickets.getById({ id: testTicketId })
    ).rejects.toThrow('您沒有權限查看此工單');
  });

  it('should allow admin to view any ticket', async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const ticket = await caller.tickets.getById({ id: testTicketId });
    
    expect(ticket).toBeDefined();
    expect(ticket?.id).toBe(testTicketId);
  });

  it('should allow user to add reply with attachments to their own ticket', async () => {
    const caller = appRouter.createCaller(userContext);
    
    const result = await caller.tickets.addReply({
      ticketId: testTicketId,
      message: 'Test reply with image',
      isAdmin: false,
      attachments: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    });
    
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();

    // Verify attachments were saved
    const replies = await caller.tickets.getReplies({ ticketId: testTicketId });
    const lastReply = replies[replies.length - 1];
    expect(lastReply.attachments).toBeDefined();
    
    const attachments = JSON.parse(lastReply.attachments!);
    expect(attachments).toHaveLength(2);
    expect(attachments[0]).toBe('https://example.com/image1.jpg');
  });

  it('should allow admin to add reply with attachments', async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const result = await caller.tickets.addReply({
      ticketId: testTicketId,
      message: 'Admin reply with image',
      isAdmin: true,
      attachments: ['https://example.com/admin-image.jpg'],
    });
    
    expect(result.success).toBe(true);
  });
});
