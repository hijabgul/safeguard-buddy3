import type { Config } from "@netlify/functions";

export default async () => {
  return Response.json({ status: "ok", app: "Safeguard Buddy" });
};

export const config: Config = {
  path: "/api/health",
};
