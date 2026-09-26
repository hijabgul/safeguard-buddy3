import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { distressAlerts } from "../../db/schema.js";

export default async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  const { alertId } = body || {};

  if (alertId) {
    const id = Number(alertId);
    if (Number.isFinite(id)) {
      await db.update(distressAlerts).set({ status: "resolved" }).where(eq(distressAlerts.id, id));
    }
  } else {
    await db.update(distressAlerts).set({ status: "resolved" });
  }

  return Response.json({ success: true });
};

export const config: Config = {
  path: "/api/parent/alerts/clear",
  method: "POST",
};
