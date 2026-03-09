import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL!;

export const db = url.includes("neon.tech")
  ? (drizzleNeon(neon(url), { schema }) as unknown as ReturnType<typeof drizzlePg<typeof schema>>)
  : drizzlePg(url, { schema });
