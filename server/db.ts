import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema.ts";
import type { InsertUser } from "../drizzle/schema.ts";
import { ENV } from "./_core/env.ts";

// Global connection pool
let _pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Get database connection with automatic retry
 */
export async function getDb() {
  if (!_db) {
    try {
      if (!ENV.databaseUrl) {
        throw new Error("DATABASE_URL is not set");
      }

      console.log("[Database] Initializing connection pool...");

      _pool = mysql.createPool({
        uri: ENV.databaseUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 10000,
        // SSL configuration for external connections
        ssl: {
          rejectUnauthorized: false
        }
      });

      // Test the connection
      const connection = await _pool.getConnection();
      await connection.ping();
      connection.release();

      _db = drizzle(_pool as any, { mode: "default" });
      console.log("[Database] ✓ Connected to MySQL successfully");
    } catch (error: any) {
      console.error("[Database] ✗ Failed to connect:", {
        message: error.message,
        code: error.code,
        errno: error.errno
      });
      _db = null;
      throw error;
    }
  }
  if (!_db) throw new Error("Database initialization failed");
  return _db;
}

/**
 * Upsert user with improved error handling
 */
export async function upsertUser(user: Partial<Omit<InsertUser, 'id'>> & Pick<InsertUser, 'openId'>): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    const error = new Error("Database connection not available");
    console.error("[Auth] upsertUser failed:", error.message);
    throw error;
  }

  try {
    const now = new Date();
    const normalizedEmail = (user.email && user.email.trim() !== '') ? user.email.trim() : null;

    console.log('[Auth] Upserting user:', {
      openId: user.openId,
      name: user.name || 'N/A',
      email: normalizedEmail || 'NULL',
      loginMethod: user.loginMethod || 'N/A'
    });

    // Use raw SQL for reliable upsert
    const connection = await (db as any).$client;

    const [result] = await connection.execute(
      `INSERT INTO users (openId, name, email, avatar, phone, address, loginMethod, role, createdAt, updatedAt, lastSignedIn)
       VALUES (?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         email = VALUES(email),
         avatar = VALUES(avatar),
         loginMethod = VALUES(loginMethod),
         updatedAt = VALUES(updatedAt),
         lastSignedIn = VALUES(lastSignedIn)`,
      [
        user.openId,
        user.name || null,
        normalizedEmail,
        user.avatar || null,
        user.loginMethod || null,
        user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
        now,
        now,
        user.lastSignedIn || now
      ]
    );

    console.log('[Auth] ✓ User upsert successful:', {
      openId: user.openId,
      affectedRows: (result as any).affectedRows
    });
  } catch (error: any) {
    console.error("[Auth] ✗ User upsert failed:", {
      openId: user.openId,
      email: user.email,
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      errno: error.errno
    });
    throw error;
  }
}

/**
 * Get user by openId
 */
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Auth] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error: any) {
    console.error("[Auth] Failed to get user:", {
      openId,
      error: error.message
    });
    return undefined;
  }
}
