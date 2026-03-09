import type { UIMessage } from "ai";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { chat, message, decisionLog } from "./schema";

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

// ─── Decision Log ─────────────────────────────────────────────────────────────

export interface DecisionLogEntry {
  pillar: string;
  decision: string;
  chosen: string;
  rejected_alternatives: string[];
  rationale: string;
}

/**
 * Insert decision log entries for a completed chat.
 * Called from the API route's onFinish callback after each run.
 * Uses INSERT … ON CONFLICT DO NOTHING since entries are immutable once written.
 */
export async function upsertDecisionLog({
  chatId,
  entries,
}: {
  chatId: string;
  entries: DecisionLogEntry[];
}) {
  if (entries.length === 0) return;

  await db
    .insert(decisionLog)
    .values(
      entries.map((e) => ({
        chatId,
        pillar: e.pillar,
        decision: e.decision,
        chosen: e.chosen,
        rejectedAlternatives: e.rejected_alternatives,
        rationale: e.rationale,
      })),
    )
    .onConflictDoNothing();
}
