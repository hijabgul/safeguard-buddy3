import { GoogleGenAI } from "@google/genai";

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
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in process.env.");
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

function generateDynamicFallback(message: string, isEnglish: boolean, nickname: string, historyLength: number = 0): string {
  const lower = message.toLowerCase().trim();

  // Simple string hash to pick varied index for dynamic variation
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i);
    hash |= 0;
  }
  const pos = Math.abs(hash + historyLength);

  // 1. Distress / Fear / Hurt / Bad Touch / Help
  if (lower.includes("touch") || lower.includes("چھونا") || lower.includes("ڈر") || lower.includes("چوٹ") || lower.includes("برا") || lower.includes("مدد") || lower.includes("scared") || lower.includes("hurt") || lower.includes("help")) {
    return isEnglish
      ? `[gentle] This is very important. Please tell your Mom or Dad right now. Can you do that? Remember, you are brave! Safeguard Buddy is always here with you.`
      : `[gentle] یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟ یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔`;
  }

  // 2. Greetings / How are you
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("سلام") || lower.includes("کیسے") || lower.includes("کیا حال") || lower.includes("kese") || lower.includes("kya hal")) {
    const urduGreetings = [
      `[warm] وعلیکم السلام ${nickname}! میں بالکل ٹھیک ہوں۔ تم کیسے ہو؟ آج تم نے کیا کیا؟`,
      `[warm] سلام ${nickname}! تمہاری بات سن کر بہت خوشی ہوئی! کیا تم آج کسی مزے دار کھیل کے بارے میں بات کرنا چاہتے ہو؟`,
      `[warm] سلام پیارے ${nickname}! میں تمہارا سیف گارڈ بڈی ہوں۔ میں تمہارے ساتھ بات کرنے کا انتظار کر رہا تھا!`,
      `[warm] وعلیکم السلام! تم ایک بہت پیارے اور ہوشیار بچے ہو۔ آج تمہارا موڈ کیسا ہے؟`
    ];
    const englishGreetings = [
      `[warm] Hello ${nickname}! I am doing great! How are you feeling today?`,
      `[warm] Hi ${nickname}! I am so happy to hear from you! What fun things did you do today?`,
      `[warm] Hello my brave friend ${nickname}! Safeguard Buddy is right here with you! What shall we talk about?`,
      `[warm] Hi there ${nickname}! You are very special and smart. How is your day going?`
    ];
    const list = isEnglish ? englishGreetings : urduGreetings;
    return list[pos % list.length];
  }

  // 3. Name / Identity
  if (lower.includes("name") || lower.includes("who are you") || lower.includes("نام") || lower.includes("کون ہو")) {
    return isEnglish
      ? `[warm] I am Safeguard Buddy! I am your special AI friend who helps you stay safe, learn good safety rules, and tells fun stories!`
      : `[warm] میں سیف گارڈ بڈی ہوں! میں تمہارا دوست اور محافظ ہوں جو تمہیں محفوظ رہنے کے طریقے سکھاتا ہے اور مزے دار کہانیاں سناتا ہے!`;
  }

  // 4. Stories / Tales
  if (lower.includes("story") || lower.includes("کہانی") || lower.includes("سناؤ") || lower.includes("قصہ")) {
    const urduStories = [
      `[warm] ایک خوبصورت جنگل میں پپو نامی ایک ننھا پرندہ رہتا تھا۔ پپو کو معلوم تھا کہ اس کا جسم اس کا اپنا ہے۔ وہ ہمیشہ اپنی امی ابو کی بات سنتا اور خوش رہتا تھا!`,
      `[warm] ایک ہرے بھرے باغ میں ٹومی نامی ایک ننھا خرگوش رہتا تھا۔ ایک دن ایک اجنبی نے اسے گاجر دی، لیکن ٹومی نے کہا "نہیں!" اور بھاگ کر اپنی امی کے پاس چلا گیا۔`,
      `[warm] ایک نیلی ندی میں مینو نامی ایک ننھی مچھلی تھی۔ مینو ہمیشہ اپنے والدین کے ساتھ تیرتی تھی اور کسی اجنبی مچھلی کے ساتھ کبھی نہیں جاتی تھی!`,
      `[warm] ایک اونچے درخت پر چینو نامی ایک ننھی گلہری رہتی تھی۔ چینو کو اپنے بھروسہ مند لوگوں کا پتہ تھا اور وہ ہمیشہ اپنے راز اپنی امی سے شیئر کرتی تھی!`,
      `[warm] ایک چمکتے ہوئے جزیرے پر مانو نامی ایک ہاتھی کا بچہ رہتا تھا۔ مانو کو پتہ تھا کہ اگر کوئی اسے ڈرائے تو فوراً "نہیں" بولنا ہے اور اپنے بڑوں کو بتانا ہے!`,
      `[warm] ایک خوبصورت وادی میں بسنتی نامی ایک تتلی رہتی تھی۔ بسنتی اپنے پروں کی حفاظت خود کرتی تھی اور ہمیشہ اپنے پروں کو چھونے پر منع کر دیتی تھی!`
    ];
    const englishStories = [
      `[warm] Once upon a time, a brave little sparrow named Pip was flying in a park. Pip always listened to her mom and knew that her body belonged only to her! She flew happily home.`,
      `[warm] In a green forest, Benny the Rabbit met a stranger who offered a carrot. Benny remembered his safe rules, shouted "NO!", and hopped back to his family!`,
      `[warm] Under the blue sea, Finny the Little Fish always stayed near her mother. When a stranger asked her to come away, Finny swam straight to her mom!`,
      `[warm] Up in a golden tree, Chino the Squirrel knew all her trusted adults. Whenever she felt unsure, she always ran to ask her Grandma!`
    ];
    const list = isEnglish ? englishStories : urduStories;
    return list[pos % list.length];
  }

  // 5. Touch / Body Safety
  if (lower.includes("touch") || lower.includes("چھونا") || lower.includes("محفوظ") || lower.includes("جسم")) {
    return isEnglish
      ? `[slow] Safe touches make you feel happy and protected, like a high-five or a warm hug from Mom! If any touch feels confusing or uncomfortable, say NO loudly and tell a trusted adult immediately.`
      : `[slow] محفوظ چھونا وہ ہوتا ہے جو آپ کو خوشی اور تحفظ دے، جیسے امی کا پیار یا ہاتھ ملانا۔ اگر کوئی بھی آپ کو ناگوار طریقے سے چھوئے تو فوراً نہیں کہیں اور امی یا ابو کو بتائیں۔`;
  }

  // 6. Strangers / Gifts
  if (lower.includes("stranger") || lower.includes("gift") || lower.includes("candy") || lower.includes("اجنبی") || lower.includes("تحفہ") || lower.includes("ٹافی")) {
    return isEnglish
      ? `[gentle] Never take gifts, candies, or rides from strangers! Always ask your parents first. If a stranger asks you to go with them, step back and shout NO!`
      : `[gentle] کبھی بھی کسی اجنبی سے تحفہ، ٹافی یا ساتھ جانے کی افر قبول نہ کریں۔ ہمیشہ پہلے امی یا ابو سے پوچھیں۔ اجنبی کو صاف نہیں بولیں!`;
  }

  // 7. Secrets / Telling Adults
  if (lower.includes("secret") || lower.includes("راز") || lower.includes("چھپانا")) {
    return isEnglish
      ? `[slow] Good secrets are happy surprises like a birthday present! Bad secrets make you feel worried or scared. NEVER keep a bad secret — always tell Mom or Dad!`
      : `[slow] اچھے راز خوشی کے سرپرائز ہوتے ہیں جیسے سالگرہ کا تحفہ! برے راز آپ کو پریشان کرتے ہیں۔ برے راز کبھی نہ چھپائیں — ہمیشہ امی یا ابو کو بتائیں!`;
  }

  // 8. Feelings / Emotions
  if (lower.includes("sad") || lower.includes("happy") || lower.includes("angry") || lower.includes("خوش") || lower.includes("اداس") || lower.includes("غصہ")) {
    return isEnglish
      ? `[encouraging] It is completely okay to feel all kinds of feelings! Whenever you feel sad or angry, take a deep breath and share your thoughts with Mom, Dad, or me!`
      : `[encouraging] ہر قسم کے جذبات ہونا بالکل نارمل بات ہے! جب بھی آپ اداس یا غصے میں ہوں، ایک لمبا سانس لیں اور اپنی امی یا ابو سے بات کریں!`;
  }

  // 9. Animals / Nature / Play
  if (lower.includes("animal") || lower.includes("bird") || lower.includes("cat") || lower.includes("dog") || lower.includes("بلی") || lower.includes("کتا") || lower.includes("پرندہ") || lower.includes("جانور") || lower.includes("کھیل")) {
    const urduAnimals = [
      `[encouraging] جانور بہت پیارے ہوتے ہیں! پرندے جیسے طوطا اور چڑیا ہمیشہ اپنے گھونسلے میں محفوظ رہتے ہیں اور اپنے امی ابو کے ساتھ رہتے ہیں!`,
      `[encouraging] کیا تمہیں پتہ ہے؟ بلی کا بچہ ہمیشہ اپنی امی کے قریب رہتا ہے تا کہ محفوظ رہے! تم بھی ہمیشہ اپنے بڑوں کے پاس رہا کرو۔`
    ];
    const englishAnimals = [
      `[encouraging] Animals are wonderful! Little birds and kittens always stay close to their mothers to stay safe and sound!`,
      `[encouraging] Did you know? Puppies love playing high-five games! Just like playing safe games with friends!`
    ];
    const list = isEnglish ? englishAnimals : urduAnimals;
    return list[pos % list.length];
  }

  // 10. Default Dynamic Pool based on hash
  const defaultUrduPool = [
    `[warm] ${nickname}، تم ایک بہت ہوشیار اور بہادر بچے ہو! میں تمہاری ہر بات غور سے سنتا ہوں۔ کیا تم کوئی کہانی سننا چاہتے ہو یا کچھ پوچھنا چاہتے ہو؟`,
    `[warm] واہ ${nickname}! یہ تو بہت دلچسپ بات ہے۔ یاد رکھو کہ تمہارا جسم تمہارا اپنا ہے اور تم ہمیشہ محفوظ ہو!`,
    `[encouraging] ${nickname}، تم روزانہ نئی اور اچھی باتیں سیکھ رہے ہو۔ اگر تمہیں کسی بات کی سمجھ نہ آئے تو اپنے بھروسہ مند بالغ سے ضرور پوچھو!`,
    `[warm] سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے! تم اپنی امی یا ابو کے ساتھ کون سا پسندیدہ کھیل کھیلتے ہو؟`,
    `[encouraging] تم ایک سچے چیمپئن ہو ${nickname}! ہمیشہ یاد رکھو کہ اگر کوئی چیز تمہیں عجیب لگے تو فوراً "نہیں" کہو!`
  ];

  const defaultEnglishPool = [
    `[warm] ${nickname}, you are such a smart and brave child! I love listening to you. Would you like to hear a fun story or learn a safe rule?`,
    `[warm] Wow ${nickname}! That is so interesting. Remember that your body belongs to you and you are always safe!`,
    `[encouraging] ${nickname}, you are learning new wonderful things every day! Always share your ideas with your Mom and Dad!`,
    `[warm] Safeguard Buddy is always right here with you! What is your favorite game to play with Mom or Dad?`,
    `[encouraging] You are a true champion ${nickname}! Always remember that you have the right to say NO if anything feels uncomfortable!`
  ];

  const pool = isEnglish ? defaultEnglishPool : defaultUrduPool;
  return pool[pos % pool.length];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const language = req.body?.language === "en" ? "en" : "ur";
  try {
    const { message, history, ageBracket = "5-8", nickname = "چھوٹا دوست", avatar = "Mor" } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
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
4. NEVER ask for personal information.
5. Language Context: ${ageGuide}
6. Always be empowering and warm ("تم بہادر ہو," "تمہیں نہیں کہنے کا حق ہے").
7. NEVER use scary words.
8. NO MARKDOWN SYMBOLS: Write completely plain Urdu text.
9. UNIQUE DIVERSE STORYTELLING: Whenever the child asks for a story ("کہانی", "story", "سناؤ"), ALWAYS invent a COMPLETELY NEW, UNIQUE STORY!

CRITICAL EMERGENCY PROTOCOL:
If the user mentions anything related to touch ("چھونا"), fear ("ڈر"), being hurt ("چوٹ"), feeling bad ("برا"), or asking for help ("مدد"):
YOU MUST MANDATORILY include this exact sentence in Urdu:
"یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟"
And close with:
"یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔"`;

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
      replyText = generateDynamicFallback(message, isEnglish, nickname, Array.isArray(history) ? history.length : 0);
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

    return res.status(200).json({
      reply: cleanText,
      fullReplyWithTone: replyText,
      tone: detectedTone,
      distressTriggered: isDistress,
      alertLogged: isDistress
    });
  } catch (error: any) {
    console.error("Vercel Salam Chat error:", error);
    return res.status(500).json({
      reply: language === "en"
        ? "Hello! I am your Safeguard Buddy. Remember, you are very brave and safe!"
        : "سلام! میں تمہارا سیف گارڈ بڈی ہوں۔ یاد رکھو تم بہت بہادر اور محفوظ بچے ہو!",
      tone: "warm",
      distressTriggered: false
    });
  }
}
