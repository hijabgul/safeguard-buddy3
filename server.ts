import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for distress alerts
interface DistressAlertServer {
  id: string;
  timestamp: number;
  childNickname: string;
  ageBracket: string;
  triggerWord: string;
  contextMessage: string;
  salamResponse: string;
  status: 'active' | 'resolved';
}

const distressAlerts: DistressAlertServer[] = [];

// Helper to check for distress triggers in child message
const DISTRESS_TRIGGERS = ["چھونا", "ڈر", "چوٹ", "برا", "مدد", "touch", "scared", "hurt", "bad touch", "help"];

function detectDistressTrigger(message: string): string | null {
  const lower = message.toLowerCase();
  for (const trigger of DISTRESS_TRIGGERS) {
    if (lower.includes(trigger)) {
      return trigger;
    }
  }
  return null;
}

// Lazy initialization of Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini API calls will fallback or return simulated response if needed.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", app: "Safeguard Buddy" });
});

// Text-To-Speech endpoint proxy supporting English and Urdu
app.get("/api/tts", async (req: Request, res: Response) => {
  try {
    const rawText = String(req.query.text || "").slice(0, 300);
    const lang = String(req.query.lang || req.query.tl || "ur").toLowerCase().startsWith("en") ? "en" : "ur";
    if (!rawText) return res.status(400).send("Text is required");

    // Clean text of tone tags, exclamations, and special markdown
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

    if (!cleanText) return res.status(400).send("Empty text");

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
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    console.error("TTS proxy error:", err);
    res.status(500).send("TTS Proxy server error");
  }
});

// ElevenLabs Multilingual Text-To-Speech endpoint proxy using ELEVENLABS_API_KEY
app.post("/api/elevenlabs/tts", async (req: Request, res: Response) => {
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

    // If 402 (paid plan required for requested library voice), retry with free-tier standard premade voice
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

    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(buffer);
  } catch (err: any) {
    console.error("Error in ElevenLabs TTS server proxy:", err);
    res.status(500).send("ElevenLabs TTS server error");
  }
});

app.post("/api/salam/chat", async (req: Request, res: Response) => {
  const language = req.body?.language === "en" ? "en" : "ur";
  try {
    const { message, history, ageBracket = "5-8", nickname = "چھوٹا دوست", avatar = "Mor" } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check for distress trigger
    const triggerWord = detectDistressTrigger(message);
    const isDistress = triggerWord !== null;

    let replyText = "";
    let detectedTone = "warm";

    const ai = getGeminiClient();
    const isEnglish = language === "en";

    if (ai) {
      const ageGuide = ageBracket === "2-5"
        ? "The child is very young (2-5 years old). Use simple animal stories, short sentences, and super easy words."
        : ageBracket === "5-8"
        ? "The child is 5-8 years old. Use friendly role-play scenarios, active practice, and gentle clear words."
        : "The child is 8-10 years old. Use real-world examples, clear safety rules.";

      const systemInstruction = isEnglish
        ? `You are "Safeguard Buddy" — a caring, safe, and friendly AI friend for children.
Your mission is to teach body safety (good touch vs bad touch), stranger awareness, saying NO, bad secrets, and identifying trusted adults.

RULES:
1. Speak ONLY in simple, friendly, child-appropriate English.
2. Tone Markers: Always prefix tone tag at start of speech like [warm], [gentle], [encouraging], or [slow].
3. Keep responses under ~120 words.
4. NEVER ask for personal information (full name, address, school name, phone number, location).
5. Language Context: ${ageGuide}
6. Always be empowering and warm ("You are brave," "You have the right to say NO").
7. NEVER use scary words.
8. NO MARKDOWN SYMBOLS: Write plain text without markdown formatting.
9. UNIQUE DIVERSE STORYTELLING: Whenever asked for a story, invent a unique, inspiring, short story with characters like Little Bird, Bunny, Elephant, Parrot, Squirrel!

CRITICAL EMERGENCY PROTOCOL:
If the user mentions anything related to touch, fear, being hurt, feeling uncomfortable, or asking for help:
YOU MUST include this exact sentence:
"This is very important. Please tell your Mom or Dad right now. Can you do that?"
And close with: "Remember, you are brave! Safeguard Buddy is always here with you."`
        : `You are "Safeguard Buddy" (سیف گارڈ بڈی) — a caring, safe, and friendly AI friend for Pakistani children.
Your mission is to teach body safety ("محفوظ چھونا" vs "غیر محفوظ چھونا"), stranger awareness ("اجنبی"), saying NO ("نہیں کہنا"), bad secrets ("راز"), and identifying trusted adults ("بھروسہ مند بالغ").

RULES:
1. Speak ONLY in simple Urdu unless the child explicitly asks for English.
2. Tone Markers: Always prefix or embed tone tag at start of speech like [warm], [gentle], [encouraging], or [slow].
   - [warm] for greetings & general conversation
   - [gentle] for sensitive/scary topics
   - [encouraging] for praise or right answers
   - [slow] for important safety rules
3. Keep responses under ~120 words (readable aloud under 30s).
4. NEVER ask for personal information (full name, address, school name, phone number, location).
5. Language Context: ${ageGuide}
6. Always be empowering and warm ("تم بہادر ہو," "تمہیں نہیں کہنے کا حق ہے").
7. NEVER use scary words like "اغوا کار" or "برے لوگ".
8. NO MARKDOWN SYMBOLS: NEVER output asterisks (** or *), hashes (#), underscores (_), or markdown formatting tags. Write completely plain Urdu text.
9. UNIQUE DIVERSE STORYTELLING: Whenever the child asks for a story ("کہانی", "story", "سناؤ") or asks again, ALWAYS invent a COMPLETELY NEW, UNIQUE, AND FRESH STORY! Never repeat characters, plots, or animals from previous stories. Pick different characters each time. Keep every story short (4-6 sentences), inspiring, colorful, and fun with a gentle lesson!

CRITICAL EMERGENCY PROTOCOL:
If the user mentions anything related to touch ("چھونا"), fear ("ڈر"), being hurt ("چوٹ"), feeling bad ("برا"), or asking for help ("مدد"):
YOU MUST MANDATORILY include this exact sentence in Urdu:
"یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟"
And close with:
"یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔"`;

      // Build context including past conversation history
      let formattedHistory = "";
      if (Array.isArray(history) && history.length > 0) {
        formattedHistory = "PREVIOUS CONVERSATION HISTORY:\n" + 
          history.slice(-8).map((h: any) => `${h.sender === 'user' ? 'Child' : 'Safeguard Buddy'}: ${h.text}`).join("\n") + "\n\n";
      }

      const promptText = `${formattedHistory}Child nickname: ${nickname}, Avatar: ${avatar}, Age: ${ageBracket}.
Child current message: "${message}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.95,
        },
      });

      replyText = response.text || (isEnglish ? "Hello! I am your Safeguard Buddy. You are completely safe." : "سلام! میں تمہارا سیف گارڈ بڈی ہوں۔ تم بالکل محفوظ ہو۔");
    } else {
      // Fallback response if API key is not present
      if (isDistress) {
        replyText = isEnglish
          ? "[gentle] This is very important. Please tell your Mom or Dad right now. Can you do that? Remember, you are brave! Safeguard Buddy is always here with you."
          : "[gentle] یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟ یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔";
      } else if (message.toLowerCase().includes("story") || message.includes("کہانی") || message.includes("سناؤ")) {
        replyText = isEnglish
          ? "[warm] Once upon a time, a brave little sparrow named Pip was flying in a park. Pip always listened to her mom and knew that her body belonged only to her! She flew happily home to her family."
          : "[warm] ایک جنگل میں مانو نامی ایک ننھی چڑیا رہتی تھی۔ مانو کو معلوم تھا کہ اس کا جسم اس کا اپنا ہے۔ وہ ہمیشہ اپنی امی ابو کی بات سنتی اور خوش رہتی تھی!";
      } else {
        replyText = isEnglish
          ? `[warm] Hello ${nickname}! I am your Safeguard Buddy. I am so happy to talk to you! You are very brave!`
          : `[warm] سلام ${nickname}! میں تمہارا سیف گارڈ بڈی ہوں۔ تمہاری بات سن کر بہت خوشی ہوئی۔ تم ایک بہادر بچے ہو!`;
      }
    }

    // Force safety response if trigger word detected
    if (isDistress && isEnglish && !replyText.includes("tell your Mom or Dad")) {
      replyText = `[gentle] This is very important. Please tell your Mom or Dad right now. Can you do that? ${replyText}`;
    } else if (isDistress && !isEnglish && !replyText.includes("امی یا ابو کو بتاؤ")) {
      replyText = `[gentle] یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟ ${replyText} یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔`;
    }

    // Extract tone tag if present
    if (replyText.includes("[gentle]")) detectedTone = "gentle";
    else if (replyText.includes("[encouraging]")) detectedTone = "encouraging";
    else if (replyText.includes("[slow]")) detectedTone = "slow";
    else detectedTone = "warm";

    // Clean tone bracket and ALL markdown formatting symbols
    const cleanText = replyText
      .replace(/\[(warm|gentle|encouraging|slow)\]/gi, "")
      .replace(/\*+/g, "")
      .replace(/#+/g, "")
      .replace(/_+/g, " ")
      .replace(/~/g, "")
      .replace(/`/g, "")
      .trim();

    // Log alert if distress detected
    if (isDistress) {
      const newAlert: DistressAlertServer = {
        id: `alert-${Date.now()}`,
        timestamp: Date.now(),
        childNickname: nickname,
        ageBracket,
        triggerWord,
        contextMessage: message,
        salamResponse: cleanText,
        status: 'active'
      };
      distressAlerts.unshift(newAlert);
      console.warn("Distress trigger detected in child conversation:", newAlert);
    }

    res.json({
      reply: cleanText,
      fullReplyWithTone: replyText,
      tone: detectedTone,
      distressTriggered: isDistress,
      alertLogged: isDistress
    });

  } catch (error: any) {
    console.error("Error in Salam chat API:", error);
    res.status(500).json({
      reply: language === "en"
        ? "Hello! Due to a temporary glitch I will talk in a moment. But remember, you are very brave!"
        : "سلام! تکنیکی خرابی کی وجہ سے میں کچھ لمحوں بعد بات کروں گا۔ لیکن یاد رکھو تم بہت بہادر ہو!",
      tone: "warm",
      distressTriggered: false
    });
  }
});

// Get distress alerts for Parents Dashboard
app.get("/api/parent/alerts", (_req: Request, res: Response) => {
  res.json({ alerts: distressAlerts });
});

// Resolve/clear distress alert
app.post("/api/parent/alerts/clear", (req: Request, res: Response) => {
  const { alertId } = req.body;
  if (alertId) {
    const idx = distressAlerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      distressAlerts[idx].status = 'resolved';
    }
  } else {
    // resolve all
    distressAlerts.forEach(a => a.status = 'resolved');
  }
  res.json({ success: true, alerts: distressAlerts });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Safeguard Buddy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
