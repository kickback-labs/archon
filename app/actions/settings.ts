"use server";

import { auth } from "@/lib/auth";
import { getUserSettings, upsertUserSettings } from "@/lib/db/queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function getSettingsAction() {
  const user = await requireUser();
  return getUserSettings(user.id);
}

export async function saveSettingsAction(data: {
  scale: string;
  cloudExpertise: string;
  budget: string;
  compliance: string[];
  providers: string[];
}) {
  const user = await requireUser();
  return upsertUserSettings({ userId: user.id, ...data });
}
