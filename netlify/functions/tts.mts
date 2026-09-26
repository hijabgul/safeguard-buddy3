import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  try {
    const url = new URL(req.url);
    const rawText = (url.searchParams.get("text") || "").slice(0, 300);
    const langParam = (url.searchParams.get("lang") || url.searchParams.get("tl") || "ur").toLowerCase();
    const lang = langParam.startsWith("en") ? "en" : "ur";

    if (!rawText) return new Response("Text is required", { status: 400 });

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

    if (!cleanText) return new Response("Empty text", { status: 400 });

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/",
      },
    });

    if (!response.ok) {
      console.warn("Google TTS stream returned non-200 status:", response.status);
      return new Response("TTS audio stream unavailable", { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("TTS proxy error:", err);
    return new Response("TTS Proxy server error", { status: 500 });
  }
};

export const config: Config = {
  path: "/api/tts",
  method: "GET",
};
