-- =============================================================================
-- Docker PostgreSQL initialisation script
-- Runs automatically on first container start via /docker-entrypoint-initdb.d/
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Migration 0000: pgvector extension + base schema
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);

CREATE TABLE "chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'New Chat' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);

CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" uuid NOT NULL,
	"role" varchar NOT NULL,
	"parts" json NOT NULL,
	"attachments" json DEFAULT '[]'::json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "service_embedding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cloud_provider" varchar NOT NULL,
	"service_category" text NOT NULL,
	"service_name" text NOT NULL,
	"pricing_model" text NOT NULL,
	"managed" boolean NOT NULL,
	"tier" integer NOT NULL,
	"content" text NOT NULL,
	"file_path" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "service_embedding_file_path_unique" UNIQUE("file_path")
);

CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);

CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);

ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX "service_embedding_hnsw_idx" ON "service_embedding" USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX "service_embedding_provider_idx" ON "service_embedding" USING btree ("cloud_provider");
CREATE INDEX "service_embedding_category_idx" ON "service_embedding" USING btree ("service_category");
CREATE INDEX "service_embedding_tier_idx" ON "service_embedding" USING btree ("tier");

-- ---------------------------------------------------------------------------
-- Migration 0001: decision_log (created then dropped in 0002 — skipped)
-- Migration 0002: DROP TABLE decision_log CASCADE (skipped — table never created)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Migration 0003: user_settings
-- ---------------------------------------------------------------------------

CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"scale" varchar DEFAULT '< 1k' NOT NULL,
	"cloud_expertise" varchar DEFAULT 'low' NOT NULL,
	"budget" varchar DEFAULT 'minimal' NOT NULL,
	"compliance" json DEFAULT '[]'::json NOT NULL,
	"providers" json DEFAULT '[]'::json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);

ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

-- ---------------------------------------------------------------------------
-- Migration 0004: architecture_service
-- ---------------------------------------------------------------------------

CREATE TABLE "architecture_service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"tier" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"service_name" text NOT NULL,
	"pillar_label" text NOT NULL,
	"core_tag" text,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "architecture_service" ADD CONSTRAINT "architecture_service_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;

-- ---------------------------------------------------------------------------
-- Seed: service_embedding (353 rows from Neon export)
-- ---------------------------------------------------------------------------

\i /docker-entrypoint-initdb.d/seed-embeddings.sql
