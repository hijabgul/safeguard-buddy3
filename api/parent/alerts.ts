// In-memory store for Vercel Serverless Function instance
let distressAlerts: any[] = [];

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ alerts: distressAlerts });
  }

  if (req.method === 'POST') {
    const { alertId } = req.body || {};
    if (alertId) {
      const idx = distressAlerts.findIndex(a => a.id === alertId);
      if (idx !== -1) {
        distressAlerts[idx].status = 'resolved';
      }
    } else {
      distressAlerts.forEach(a => a.status = 'resolved');
    }
    return res.status(200).json({ success: true, alerts: distressAlerts });
  }

  return res.status(405).send("Method not allowed");
}
