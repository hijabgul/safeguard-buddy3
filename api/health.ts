export default function handler(req: any, res: any) {
  res.status(200).json({ status: "ok", app: "Safeguard Buddy Vercel API" });
}
