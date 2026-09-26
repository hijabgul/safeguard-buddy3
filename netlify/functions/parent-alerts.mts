import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { distressAlerts } from "../../db/schema.js";

export default async () => {
  const rows = await db.select().from(distressAlerts).orderBy(desc(distressAlerts.createdAt));
  const alerts = rows.map((row) => ({
    id: String(row.id),
    timestamp: row.createdAt ? row.createdAt.getTime() : Date.now(),
    childNickname: row.childNickname,
    ageBracket: row.ageBracket,
    triggerWord: row.triggerWord,
    contextMessage: row.contextMessage,
    salamResponse: row.salamResponse,
    status: row.status,
  }));
  return Response.json({ alerts });
};

export const config: Config = {
  path: "/api/parent/alerts",
  method: "GET",
};
