import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      text,
      voiceId = Netlify.env.get("ELEVENLABS_VOICE_ID") || "EXAVITQu4vr4xnSDxMaL",
      modelId = "eleven_multilingual_v2",
      stability = 0.5,
      similarityBoost = 0.75,
    } = body || {};

    const apiKey = Netlify.env.get("ELEVENLABS_API_KEY");

    if (!text || typeof text !== "string") {
      return new Response("Text is required", { status: 400 });
    }

    if (!apiKey) {
      console.warn("ELEVENLABS_API_KEY is not set in environment secrets.");
      return new Response("ELEVENLABS_API_KEY is not configured in server secrets.", { status: 503 });
    }

    const cleanText = text
      .replace(/\[.*?\]/g, "")
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1000);

    if (!cleanText) {
      return new Response("Text is empty after cleaning", { status: 400 });
    }

    const makeTtsRequest = async (targetVoice: string) => {
      const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`;
      return await fetch(elevenLabsUrl, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        }),
      });
    };

    let response = await makeTtsRequest(voiceId);

    if (response.status === 402 && voiceId !== "EXAVITQu4vr4xnSDxMaL") {
      console.warn(`Voice ${voiceId} requires paid plan. Retrying with default free-tier voice EXAVITQu4vr4xnSDxMaL...`);
      response = await makeTtsRequest("EXAVITQu4vr4xnSDxMaL");
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown ElevenLabs Error");
      console.warn(`ElevenLabs API returned ${response.status}:`, errorText);
      return new Response(`ElevenLabs API error: ${errorText}`, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Error in ElevenLabs TTS proxy:", err);
    return new Response("ElevenLabs TTS server error", { status: 500 });
  }
};

export const config: Config = {
  path: "/api/elevenlabs/tts",
  method: "POST",
};
