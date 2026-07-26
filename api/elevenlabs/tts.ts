export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send("Method not allowed");
  }

  try {
    const {
      text,
      voiceId = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL",
      modelId = "eleven_multilingual_v2",
      stability = 0.5,
      similarityBoost = 0.75,
    } = req.body || {};

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!text || typeof text !== "string") {
      return res.status(400).send("Text is required");
    }

    if (!apiKey) {
      console.warn("ELEVENLABS_API_KEY is not set in environment secrets.");
      return res.status(503).send("ELEVENLABS_API_KEY is not configured in server secrets.");
    }

    const cleanText = text
      .replace(/\[.*?\]/g, "")
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1000);

    if (!cleanText) {
      return res.status(400).send("Text is empty after cleaning");
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
      return res.status(response.status).send(`ElevenLabs API error: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(buffer);
  } catch (err: any) {
    console.error("Error in Vercel ElevenLabs TTS server proxy:", err);
    return res.status(500).send("ElevenLabs TTS server error");
  }
}
