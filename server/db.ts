import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users } from "../drizzle/schema";
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

    // 明確構建完整的值物件，不依賴 database defaults
    const values = {
      openId: user.openId,
      name: user.name || null,
      email: (user.email && user.email.trim() !== '') ? user.email : null,
      avatar: user.avatar || null,
      phone: user.phone || null,
      address: user.address || null,
      loginMethod: user.loginMethod || null,
      role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' as const : 'user' as const),
      createdAt: now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn || now,
    };

    // Update set - 只更新這些欄位
    const updateSet = {
      name: values.name,
      email: values.email,
      avatar: values.avatar,
      loginMethod: values.loginMethod,
      updatedAt: now,
      lastSignedIn: values.lastSignedIn,
    };

    console.log('[Database] Upserting user:', { openId: user.openId, email: values.email });

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });

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
