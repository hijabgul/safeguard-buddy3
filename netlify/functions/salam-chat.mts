import type { Config } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import { db } from "../../db/index.js";
import { distressAlerts } from "../../db/schema.js";

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

function getGeminiClient() {
  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini API calls will fallback or return simulated response if needed.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export default async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  const language = body?.language === "en" ? "en" : "ur";

  try {
    const { message, history, ageBracket = "5-8", nickname = "چھوٹا دوست", avatar = "Mor" } = body;
    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

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

      let formattedHistory = "";
      if (Array.isArray(history) && history.length > 0) {
        formattedHistory = "PREVIOUS CONVERSATION HISTORY:\n" +
          history.slice(-8).map((h: any) => `${h.sender === "user" ? "Child" : "Safeguard Buddy"}: ${h.text}`).join("\n") + "\n\n";
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

    if (isDistress && isEnglish && !replyText.includes("tell your Mom or Dad")) {
      replyText = `[gentle] This is very important. Please tell your Mom or Dad right now. Can you do that? ${replyText}`;
    } else if (isDistress && !isEnglish && !replyText.includes("امی یا ابو کو بتاؤ")) {
      replyText = `[gentle] یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟ ${replyText} یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔`;
    }

    if (replyText.includes("[gentle]")) detectedTone = "gentle";
    else if (replyText.includes("[encouraging]")) detectedTone = "encouraging";
    else if (replyText.includes("[slow]")) detectedTone = "slow";
    else detectedTone = "warm";

    const cleanText = replyText
      .replace(/\[(warm|gentle|encouraging|slow)\]/gi, "")
      .replace(/\*+/g, "")
      .replace(/#+/g, "")
      .replace(/_+/g, " ")
      .replace(/~/g, "")
      .replace(/`/g, "")
      .trim();

    if (isDistress) {
      try {
        await db.insert(distressAlerts).values({
          childNickname: nickname,
          ageBracket,
          triggerWord,
          contextMessage: message,
          salamResponse: cleanText,
          status: "active",
        });
      } catch (dbErr) {
        console.error("Failed to persist distress alert:", dbErr);
      }
      console.warn("Distress trigger detected in child conversation:", triggerWord);
    }

    return Response.json({
      reply: cleanText,
      fullReplyWithTone: replyText,
      tone: detectedTone,
      distressTriggered: isDistress,
      alertLogged: isDistress,
    });
  } catch (error) {
    console.error("Error in Salam chat API:", error);
    return Response.json(
      {
        reply: language === "en"
          ? "Hello! Due to a temporary glitch I will talk in a moment. But remember, you are very brave!"
          : "سلام! تکنیکی خرابی کی وجہ سے میں کچھ لمحوں بعد بات کروں گا۔ لیکن یاد رکھو تم بہت بہادر ہو!",
        tone: "warm",
        distressTriggered: false,
      },
      { status: 500 },
    );
  }
};

export const config: Config = {
  path: "/api/salam/chat",
  method: "POST",
};
