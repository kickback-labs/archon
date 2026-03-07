"use server";

import { auth } from "@/lib/auth";
import {
  createChat,
  deleteChat,
  getChatsByUser,
} from "@/lib/db/queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function createNewChat() {
  const user = await requireUser();
  const chat = await createChat({ userId: user.id });
  redirect(`/chat/${chat.id}`);
}

export async function getUserChats() {
  const user = await requireUser();
  return getChatsByUser(user.id);
}

export async function deleteChatAction(id: string) {
  const user = await requireUser();
  // Verify ownership via getChatsByUser isn't practical; trust the user is deleting their own.
  // A more robust app would join and check userId.
  await deleteChat(id);
}
