import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import { ENV } from './_core/env';

// Global connection pool
let _pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      if (!ENV.databaseUrl) {
        throw new Error("DATABASE_URL is not set");
      }

      _pool = mysql.createPool({
        uri: ENV.databaseUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        // 添加 SSL 設定以支援外部連線 (若需要)
        ssl: {
          rejectUnauthorized: false
        }
      });

      _db = drizzle(_pool, { mode: "default" });
      console.log("[Database] Connected to MySQL via Pool");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: Partial<Omit<InsertUser, 'id'>> & Pick<InsertUser, 'openId'>): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const now = new Date();

    console.log('[Database] Upserting user:', { openId: user.openId, email: user.email || 'NULL' });

    // 直接執行原生 SQL，完全控制
    const connection = await (db as any).$client;

    await connection.execute(
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
        (user.email && user.email.trim() !== '') ? user.email : null,
        user.avatar || null,
        user.loginMethod || null,
        user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
        now,
        now,
        user.lastSignedIn || now
      ]
    );

    console.log('[Database] User upsert successful:', user.openId);
  } catch (error: any) {
    console.error("[Database] Failed to upsert user:", {
      openId: user.openId,
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
    });
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  // @ts-ignore - basic where clause
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

import { eq } from "drizzle-orm";
