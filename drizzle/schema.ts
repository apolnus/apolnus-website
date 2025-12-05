import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: text("email", { length: 320 }),
  avatar: text("avatar"),
  phone: text("phone", { length: 20 }),
  address: text("address"),
  loginMethod: text("loginMethod", { length: 64 }),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(), // SQLite trigger needed for onUpdateNow behavior, handling manually for now
  lastSignedIn: integer("lastSignedIn", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Warranty Registration Table
export const warrantyRegistrations = sqliteTable("warrantyRegistrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(), // 綁定用戶ID，確保每個用戶只能看到自己的保固登錄
  name: text("name", { length: 100 }).notNull(),
  email: text("email", { length: 320 }).notNull(),
  phone: text("phone", { length: 20 }).notNull(),
  productModel: text("productModel", { length: 100 }).notNull(),
  serialNumber: text("serialNumber", { length: 100 }).notNull(),
  purchaseDate: integer("purchaseDate", { mode: 'timestamp' }).notNull(),
  purchaseChannel: text("purchaseChannel", { length: 100 }),
  notes: text("notes"),
  registeredAt: integer("registeredAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type WarrantyRegistration = typeof warrantyRegistrations.$inferSelect;
export type InsertWarrantyRegistration = typeof warrantyRegistrations.$inferInsert;

// Support Ticket Table
export const supportTickets = sqliteTable("supportTickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  contactName: text("contactName", { length: 100 }).notNull(),
  contactPhone: text("contactPhone", { length: 20 }).notNull(),
  contactAddress: text("contactAddress").notNull(),
  productModel: text("productModel", { length: 100 }).notNull(),
  serialNumber: text("serialNumber", { length: 100 }),
  purchaseDate: integer("purchaseDate", { mode: 'timestamp' }),
  purchaseChannel: text("purchaseChannel", { length: 100 }),
  issueTitle: text("issueTitle", { length: 200 }).notNull(),
  issueDescription: text("issueDescription").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "resolved", "closed"] }).default("pending").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// Ticket Reply Table
export const ticketReplies = sqliteTable("ticketReplies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ticketId: integer("ticketId").notNull(),
  userId: integer("userId"),
  isAdmin: integer("isAdmin", { mode: 'number' }).default(0).notNull(), // 0 or 1
  message: text("message").notNull(),
  attachments: text("attachments", { mode: 'json' }), // JSON格式儲存圖片URL陣列
  isReadByUser: integer("isReadByUser", { mode: 'number' }).default(0).notNull(), // 0=未讀, 1=已讀 (僅當isAdmin=1時有效)
  isReadByAdmin: integer("isReadByAdmin", { mode: 'number' }).default(0).notNull(), // 0=未讀, 1=已讀 (僅當isAdmin=0時有效)
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type TicketReply = typeof ticketReplies.$inferSelect;
export type InsertTicketReply = typeof ticketReplies.$inferInsert;

// Service Center Table
export const serviceCenters = sqliteTable("serviceCenters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 200 }).notNull(),
  address: text("address").notNull(),
  phone: text("phone", { length: 20 }).notNull(),
  businessHours: text("businessHours"),
  services: text("services"),
  latitude: text("latitude", { length: 50 }),
  longitude: text("longitude", { length: 50 }),
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type ServiceCenter = typeof serviceCenters.$inferSelect;
export type InsertServiceCenter = typeof serviceCenters.$inferInsert;

// Subscribers Table (for newsletter)
export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email", { length: 320 }).notNull().unique(),
  subscribedAt: integer("subscribedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

// Partners Table (for partnership applications)
export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("companyName", { length: 200 }).notNull(),
  contactName: text("contactName", { length: 100 }).notNull(),
  email: text("email", { length: 320 }).notNull(),
  phone: text("phone", { length: 20 }),
  message: text("message"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

// Site Settings Table (for GA and Meta Pixel)
export const siteSettings = sqliteTable("siteSettings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// Product Models Table
export const productModels = sqliteTable("productModels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 100 }).notNull().unique(),
  // slug 欄位：有 slug = 前台產品 (FAQ/Sitemap 可用)
  //         無 slug = 僅後勤使用 (工單/保固)
  slug: text("slug", { length: 100 }),
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(), // 1=上架, 0=下架
  order: integer("order", { mode: 'number' }).default(0).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(), // 用於 Sitemap lastmod
});

export type ProductModel = typeof productModels.$inferSelect;
export type InsertProductModel = typeof productModels.$inferInsert;

// FAQ Table
export const socialLinks = sqliteTable("socialLinks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale", { length: 10 }).notNull(), // 'zh-TW', 'en', 'ja', 'zh-CN'
  platform: text("platform", { length: 50 }).notNull(), // 'line', 'facebook', 'instagram', etc.
  url: text("url").notNull(),
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  displayOrder: integer("displayOrder", { mode: 'number' }).default(0).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
}, (table) => ({
  uniqueLocalePlatform: uniqueIndex("unique_social_locale_platform").on(table.locale, table.platform),
}));

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // 分類 (如：保固、使用、APP)
  category: text("category", { length: 100 }).notNull(),

  // 關聯產品 (JSON Array, e.g., ["one-x", "ultra-s7"])
  // 若為空陣列或 null，代表通用問題
  relatedProducts: text("relatedProducts", { mode: 'json' }),

  // 多語言內容 (JSON Object, e.g., { "zh-TW": "問題...", "en": "Question..." })
  question: text("question", { mode: 'json' }).notNull(),
  answer: text("answer", { mode: 'json' }).notNull(),

  order: integer("order", { mode: 'number' }).default(0).notNull(),
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = typeof faqs.$inferInsert;

// Authorized Dealers Table
export const authorizedDealers = sqliteTable("authorizedDealers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 200 }).notNull(),
  phone: text("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  businessHours: text("businessHours"),
  latitude: text("latitude", { length: 50 }),
  longitude: text("longitude", { length: 50 }),
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type AuthorizedDealer = typeof authorizedDealers.$inferSelect;
export type InsertAuthorizedDealer = typeof authorizedDealers.$inferInsert;

// Authorized Service Centers Table
export const authorizedServiceCenters = sqliteTable("authorizedServiceCenters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 200 }).notNull(),
  phone: text("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  businessHours: text("businessHours"),
  services: text("services"),
  latitude: text("latitude", { length: 50 }),
  longitude: text("longitude", { length: 50 }),
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type AuthorizedServiceCenter = typeof authorizedServiceCenters.$inferSelect;
export type InsertAuthorizedServiceCenter = typeof authorizedServiceCenters.$inferInsert;

// Online Stores Table (線上銷售渠道)
export const onlineStores = sqliteTable("onlineStores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  country: text("country", { length: 10 }).notNull(), // tw, jp, us...
  type: text("type", { length: 20 }).default("platform").notNull(), // 'official' (官方) | 'platform' (經銷)
  name: text("name", { length: 100 }).notNull(), // 平台名稱
  url: text("url"), // 連結 (若為空則前台顯示"敬請期待"或隱藏)
  logo: text("logo"), // Logo 圖片網址
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  displayOrder: integer("displayOrder", { mode: 'number' }).default(0).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type OnlineStore = typeof onlineStores.$inferSelect;
export type InsertOnlineStore = typeof onlineStores.$inferInsert;

// SEO Settings Table
export const seoSettings = sqliteTable("seoSettings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  page: text("page", { length: 100 }).notNull(), // 頁面識別碼 (e.g., "home", "about")
  language: text("language", { length: 10 }).notNull(), // 語言代碼 (e.g., "zh-TW", "en")
  title: text("title", { length: 500 }).notNull(),
  description: text("description"),
  keywords: text("keywords"),
}, (t) => ({
  uniquePageLang: uniqueIndex("unique_page_lang").on(t.page, t.language),
}));

export type SeoSetting = typeof seoSettings.$inferSelect;
export type InsertSeoSetting = typeof seoSettings.$inferInsert;

// Jobs Table (職缺資料)
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: text("jobId", { length: 50 }).notNull(), // e.g. ENG-TW-001
  title: text("title", { length: 200 }).notNull(),
  department: text("department", { length: 100 }).notNull(), // e.g. R&D, Marketing
  location: text("location", { length: 100 }).notNull(), // e.g. Taipei
  country: text("country", { length: 10 }).notNull(), // e.g. tw, us, jp
  description: text("description").notNull(), // HTML content
  requirements: text("requirements"), // HTML content
  isActive: integer("isActive", { mode: 'number' }).default(1).notNull(),
  postedAt: integer("postedAt", { mode: 'timestamp' }).defaultNow().notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;
