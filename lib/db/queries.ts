import type { UIMessage } from "ai";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { chat, message, userSettings } from "./schema";

// ─── Chats ────────────────────────────────────────────────────────────────────

export async function createChat({
  userId,
  title,
}: {
  userId: string;
  title?: string;
}) {
  const [created] = await db
    .insert(chat)
    .values({ userId, title: title ?? "New Chat" })
    .returning();
  return created;
}

export async function getChatsByUser(userId: string) {
  return db
    .select()
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.updatedAt));
}

export async function getChatById(id: string) {
  const [found] = await db.select().from(chat).where(eq(chat.id, id));
  return found ?? null;
}

export async function updateChatTitle(id: string, title: string) {
  await db
    .update(chat)
    .set({ title, updatedAt: new Date() })
    .where(eq(chat.id, id));
}

export async function deleteChat(id: string) {
  await db.delete(chat).where(eq(chat.id, id));
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessagesByChatId(chatId: string): Promise<UIMessage[]> {
  const rows = await db
    .select()
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(message.createdAt);

  return rows.map((row) => ({
    id: row.id,
    role: row.role as UIMessage["role"],
    parts: row.parts as UIMessage["parts"],
  }));
}

/**
 * Replace all messages for a chat with the provided list.
 * This is called from the API route's onFinish callback with the full message history.
 */
export async function upsertMessages({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}) {
  // Filter out messages with empty/missing ids — safety guard in case the SDK
  // emits a message without a stable id.
  const validMessages = messages.filter((m) => !!m.id);

  if (validMessages.length === 0) return;

  await db
    .insert(message)
    .values(
      validMessages.map((m) => ({
        id: m.id,
        chatId,
        role: m.role,
        parts: m.parts as object,
        attachments: [] as object,
      }))
    )
    .onConflictDoUpdate({
      target: message.id,
      set: {
        role: sql`excluded.role`,
        parts: sql`excluded.parts`,
        attachments: sql`excluded.attachments`,
      },
    });
}

// ─── User Settings ────────────────────────────────────────────────────────────

export async function getUserSettings(userId: string) {
  const [found] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));
  return found ?? null;
}

export async function upsertUserSettings({
  userId,
  scale,
  cloudExpertise,
  budget,
  compliance,
  providers,
}: {
  userId: string;
  scale: string;
  cloudExpertise: string;
  budget: string;
  compliance: string[];
  providers: string[];
}) {
  const [result] = await db
    .insert(userSettings)
    .values({
      userId,
      scale: scale as "< 1k" | "1k–100k" | "> 100k",
      cloudExpertise: cloudExpertise as "low" | "medium" | "high",
      budget: budget as "minimal" | "moderate" | "enterprise",
      compliance,
      providers: providers as ("AWS" | "Azure" | "GCP")[],
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        scale: sql`excluded.scale`,
        cloudExpertise: sql`excluded.cloud_expertise`,
        budget: sql`excluded.budget`,
        compliance: sql`excluded.compliance`,
        providers: sql`excluded.providers`,
        updatedAt: new Date(),
      },
    })
    .returning();
  return result;
}
