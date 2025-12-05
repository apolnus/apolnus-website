import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { subscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Newsletter Subscription', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  let subscriberId: number;

  it('should subscribe a new email', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    const result = await caller.newsletter.subscribe({ email: testEmail });
    
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    subscriberId = result.id;
  });

  it('should prevent duplicate subscriptions', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    await expect(
      caller.newsletter.subscribe({ email: testEmail })
    ).rejects.toThrow('already subscribed');
  });

  it('should list subscribers in admin panel', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    const subscribers = await caller.admin.subscribers.list();
    
    expect(subscribers).toBeDefined();
    expect(Array.isArray(subscribers)).toBe(true);
    expect(subscribers.some(s => s.email === testEmail)).toBe(true);
  });

  it('should clean up test data', async () => {
    const db = await getDb();
    await db.delete(subscribers).where(eq(subscribers.id, subscriberId));
  });
});
