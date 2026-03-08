import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  json,
  varchar,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { vector } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── App tables ───────────────────────────────────────────────────────────────

export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = typeof chat.$inferSelect;

export const message = pgTable("message", {
  id: text("id").primaryKey().notNull(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = typeof message.$inferSelect;

// ─── RAG tables ───────────────────────────────────────────────────────────────

export const serviceEmbedding = pgTable(
  "service_embedding",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    // Frontmatter metadata
    cloudProvider: varchar("cloud_provider", {
      enum: ["AWS", "Azure", "GCP"],
    }).notNull(),
    serviceCategory: text("service_category").notNull(),
    serviceName: text("service_name").notNull(),
    pricingModel: text("pricing_model").notNull(),
    managed: boolean("managed").notNull(),
    tier: integer("tier").notNull(),
    // The full markdown content of the service doc
    content: text("content").notNull(),
    // The file path relative to the data/ directory (for debugging / re-indexing)
    filePath: text("file_path").notNull().unique(),
    // text-embedding-3-small produces 1536-dimensional vectors
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("service_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    index("service_embedding_provider_idx").on(table.cloudProvider),
    index("service_embedding_category_idx").on(table.serviceCategory),
    index("service_embedding_tier_idx").on(table.tier),
  ],
);

export type ServiceEmbedding = typeof serviceEmbedding.$inferSelect;

// ─── Decision Log ─────────────────────────────────────────────────────────────

/**
 * Persists every `decisions_resolved` entry from every specialist agent.
 * Enables the UI to show "Why this service?" reasoning without re-running
 * the pipeline, and provides a training signal for future model improvement.
 */
export const decisionLog = pgTable("decision_log", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  pillar: text("pillar").notNull(),
  decision: text("decision").notNull(),
  chosen: text("chosen").notNull(),
  rejectedAlternatives: json("rejected_alternatives")
    .notNull()
    .$type<string[]>()
    .default([]),
  rationale: text("rationale").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DecisionLog = typeof decisionLog.$inferSelect;
