// Speech synthesis helper supporting Urdu and English TTS for long text & stories

let currentAudio: HTMLAudioElement | null = null;
let currentPlaybackId = 0;

const externalAudioStoppers = new Set<() => void>();
let registeredUrduVoiceHandler: ((text: string) => Promise<void>) | null = null;

export function registerAudioStopper(fn: () => void) {
  externalAudioStoppers.add(fn);
  return () => {
    externalAudioStoppers.delete(fn);
  };
}

export function registerUrduVoiceHandler(handler: (text: string) => Promise<void>) {
  registeredUrduVoiceHandler = handler;
}

export function cleanTextForSpeech(rawText: string, lang: 'ur' | 'en' | string = 'ur'): string {
  if (!rawText) return '';
  let cleaned = rawText
    .replace(/\[(warm|gentle|encouraging|slow|happy|calm|excited)\]/gi, '') // remove tone tags
    .replace(/\[.*?\]/g, '') // remove bracket tags
    .replace(/\*+/g, '') // remove markdown bold/italic asterisks (**)
    .replace(/#+/g, '') // remove markdown headers (#)
    .replace(/_+/g, ' ') // remove underscores
    .replace(/~/g, '') // remove tildes
    .replace(/`/g, '') // remove backticks
    .replace(/!+/g, ' ') // remove exclamation marks (! and !!)
    .replace(/\?+/g, ' ') // remove question marks
    .replace(/؟+/g, ' ') // remove urdu question marks
    .replace(/۔+/g, ' ') // remove urdu full stops
    .replace(/"+/g, ' ') // remove double quotes
    .replace(/'+/g, ' ') // remove single quotes
    .replace(/[:;,\-–—]/g, ' '); // remove punctuation

  // Strip all emojis, geometric shapes (like green/red circles 🟢 🔴 🟡 ⭕), and diagrams
  cleaned = cleaned
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{2B00}-\u{2BFF}]/gu, '')
    .replace(/[\u{25A0}-\u{25FF}]/gu, '')
    .replace(/[\u{2300}-\u{23FF}]/gu, '')
    .replace(/[\u{2000}-\u{206F}]/gu, '')
    .replace(/[\u{2100}-\u{214F}]/gu, '');

  if (lang === 'ur') {
    cleaned = cleaned
      .replace(/\([A-Za-z0-9\s,\.\/\-_'\u00C0-\u024F]+\)/g, '') // remove English terms in parentheses for pure Urdu speech
      .replace(/([A-Za-z]{2,}\s*)+/g, ''); // remove Latin words in Urdu speech
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

export function cleanUrduTextForSpeech(rawText: string): string {
  return cleanTextForSpeech(rawText, 'ur');
}

export function splitTextIntoChunks(text: string, maxLen = 140): string[] {
  if (!text) return [];
  if (text.length <= maxLen) return [text];

  // Split by sentence terminators: Urdu full stop (۔), exclamation (!), question (؟), period (.), newlines
  const sentences = text.split(/(?<=[۔!؟\.\?\n])/g).map(s => s.trim()).filter(Boolean);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).trim().length <= maxLen) {
      currentChunk = (currentChunk + ' ' + sentence).trim();
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      if (sentence.length > maxLen) {
        const subParts = sentence.split(/(?<=[،,;\-])/g).map(p => p.trim()).filter(Boolean);
        for (const part of subParts) {
          if ((currentChunk + ' ' + part).trim().length <= maxLen) {
            currentChunk = (currentChunk + ' ' + part).trim();
          } else {
            if (currentChunk) chunks.push(currentChunk);
            if (part.length > maxLen) {
              const words = part.split(' ');
              for (const w of words) {
                if ((currentChunk + ' ' + w).trim().length <= maxLen) {
                  currentChunk = (currentChunk + ' ' + w).trim();
                } else {
                  if (currentChunk) chunks.push(currentChunk);
                  currentChunk = w;
                }
              }
            } else {
              currentChunk = part;
            }
          }
        }
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export function stopSpeech() {
  currentPlaybackId++; // Invalidate any running playback loops

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      console.warn('Error pausing audio:', e);
    }
    currentAudio = null;
  }

  externalAudioStoppers.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      /* ignore */
    }
  });

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Error cancelling speech:', e);
    }
  }
}

export function speakText(text: string, lang: 'ur' | 'en' | string = 'ur', onEnd?: () => void) {
  stopSpeech();

  const cleanText = cleanTextForSpeech(text, lang);
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  speakStandardTTS(cleanText, lang, onEnd);
}

export function speakStandardTTS(cleanText: string, lang: 'ur' | 'en' | string = 'ur', onEnd?: () => void) {
  const chunks = splitTextIntoChunks(cleanText, 140);
  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  const thisPlaybackId = currentPlaybackId;

  const playChunk = (index: number) => {
    if (thisPlaybackId !== currentPlaybackId) return; // Cancelled or interrupted

    if (index >= chunks.length) {
      if (onEnd) onEnd();
      return;
    }

    const chunkText = chunks[index];
    const audioUrl = `/api/tts?text=${encodeURIComponent(chunkText)}&lang=${lang}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    // Preload next chunk for zero latency
    if (index + 1 < chunks.length) {
      const nextUrl = `/api/tts?text=${encodeURIComponent(chunks[index + 1])}&lang=${lang}`;
      const nextAudio = new Audio(nextUrl);
      nextAudio.preload = 'auto';
    }

    let finished = false;
    const advance = () => {
      if (thisPlaybackId !== currentPlaybackId) return;
      if (!finished) {
        finished = true;
        currentAudio = null;
        playChunk(index + 1);
      }
    };

    const tryDirectGoogleTtsFallback = async () => {
      try {
        const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=${lang}&client=tw-ob`;
        const res = await fetch(directUrl, {
          headers: {
            "Referer": "https://translate.google.com/"
          }
        });
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const fallbackAudio = new Audio(blobUrl);
          currentAudio = fallbackAudio;
          fallbackAudio.onended = () => {
            URL.revokeObjectURL(blobUrl);
            advance();
          };
          fallbackAudio.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            speakWebSpeechFallback(chunks.slice(index).join(' '), lang, onEnd);
          };
          await fallbackAudio.play();
          return;
        }
      } catch (directErr) {
        console.warn('Direct Google TTS fetch fallback failed:', directErr);
      }
      speakWebSpeechFallback(chunks.slice(index).join(' '), lang, onEnd);
    };

    audio.onended = advance;
    audio.onerror = (err) => {
      console.warn(`Chunk ${index} server TTS failed, trying direct Google TTS fallback:`, err);
      if (thisPlaybackId !== currentPlaybackId) return;
      currentAudio = null;
      tryDirectGoogleTtsFallback();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn('Audio play error, trying direct Google TTS fallback:', e);
        if (thisPlaybackId !== currentPlaybackId) return;
        currentAudio = null;
        tryDirectGoogleTtsFallback();
      });
    }
  };

  playChunk(0);
}

export function speakUrduText(text: string, onEnd?: () => void, lang: 'ur' | 'en' | string = 'ur') {
  speakText(text, lang, onEnd);
}

function speakWebSpeechFallback(cleanText: string, lang: 'ur' | 'en' | string = 'ur', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const chunks = splitTextIntoChunks(cleanText, 140);
    if (chunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    let idx = 0;
    const speakNext = () => {
      if (idx >= chunks.length) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[idx]);
      utterance.lang = lang === 'en' ? 'en-US' : 'ur-PK';
      utterance.rate = 0.88;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      if (lang === 'en') {
        const enVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      } else {
        const urduVoice = voices.find(v => {
          const l = v.lang.toLowerCase();
          const n = v.name.toLowerCase();
          return l.startsWith('ur') || l.includes('pk') || n.includes('urdu');
        }) || voices.find(v => {
          const l = v.lang.toLowerCase();
          const n = v.name.toLowerCase();
          return l.startsWith('hi') || n.includes('hindi');
        });
        if (urduVoice) utterance.voice = urduVoice;
      }

      let done = false;
      const onUtteranceEnd = () => {
        if (!done) {
          done = true;
          idx++;
          speakNext();
        }
      };

      utterance.onend = onUtteranceEnd;
      utterance.onerror = onUtteranceEnd;

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  } catch (err) {
    console.warn('Web speech synthesis fallback failed:', err);
    if (onEnd) onEnd();
  }
}
