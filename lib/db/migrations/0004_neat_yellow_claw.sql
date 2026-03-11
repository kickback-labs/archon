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
--> statement-breakpoint
ALTER TABLE "architecture_service" ADD CONSTRAINT "architecture_service_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;