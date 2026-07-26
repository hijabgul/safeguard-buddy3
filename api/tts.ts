export default async function handler(req: any, res: any) {
  try {
    const rawText = String(req.query?.text || req.body?.text || "").slice(0, 300);
    const lang = String(req.query?.lang || req.query?.tl || req.body?.lang || "ur").toLowerCase().startsWith("en") ? "en" : "ur";
    
    if (!rawText) {
      return res.status(400).send("Text is required");
    }

    const cleanText = rawText
      .replace(/\[(warm|gentle|encouraging|slow|happy|calm|excited)\]/gi, "")
      .replace(/\[.*?\]/g, "")
      .replace(/!+/g, " ")
      .replace(/\?+/g, " ")
      .replace(/؟+/g, " ")
      .replace(/۔+/g, " ")
      .replace(/"+/g, " ")
      .replace(/'+/g, " ")
      .replace(/[:;,\-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return res.status(400).send("Empty text");
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
      }
    });

    if (!response.ok) {
      console.warn("Google TTS stream returned non-200 status:", response.status);
      return res.status(response.status).send("TTS audio stream unavailable");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(buffer);
  } catch (err) {
    console.error("Vercel TTS proxy error:", err);
    return res.status(500).send("TTS Proxy server error");
  }
}
