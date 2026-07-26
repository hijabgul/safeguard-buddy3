/**
 * ElevenLabs Text-to-Speech Service
 * Provides reusable Urdu and Multilingual voice generation using ElevenLabs API.
 */

import {
  speakText,
  stopSpeech,
  registerAudioStopper,
  registerUrduVoiceHandler,
  speakStandardTTS,
} from '../utils/speech';

export const DEFAULT_VOICE_ID =
  (typeof process !== 'undefined' && process.env?.ELEVENLABS_VOICE_ID) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ELEVENLABS_VOICE_ID) ||
  'EXAVITQu4vr4xnSDxMaL';

export const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';

let currentElevenLabsAudio: HTMLAudioElement | null = null;

export function stopActiveElevenLabsAudio() {
  if (currentElevenLabsAudio) {
    try {
      currentElevenLabsAudio.pause();
      currentElevenLabsAudio.currentTime = 0;
    } catch (e) {
      console.warn('[ElevenLabs Service] Error stopping audio:', e);
    }
    currentElevenLabsAudio = null;
  }
}

// Register global audio stopper with speech utils so stopSpeech() stops ElevenLabs audio too
registerAudioStopper(stopActiveElevenLabsAudio);

export interface ElevenLabsVoiceOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  apiKey?: string;
  bypassCache?: boolean;
}

// ======================= AUDIO CACHE SYSTEM =======================
const DB_NAME = 'ElevenLabsVoiceCacheDB';
const STORE_NAME = 'audio_cache';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | null = null;
const memoryCache = new Map<string, ArrayBuffer>();

function getDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => {
          console.warn('[ElevenLabs Cache] IndexedDB open error:', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('[ElevenLabs Cache] IndexedDB init exception:', err);
        resolve(null);
      }
    });
  }
  return dbPromise;
}

/**
 * Retrieve cached audio ArrayBuffer from memory or IndexedDB
 */
export async function getCachedAudio(key: string): Promise<ArrayBuffer | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const result = req.result;
        if (result && result instanceof ArrayBuffer) {
          memoryCache.set(key, result);
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('[ElevenLabs Cache] Read error:', err);
    return null;
  }
}

/**
 * Save audio ArrayBuffer to memory and IndexedDB cache
 */
export async function setCachedAudio(key: string, buffer: ArrayBuffer): Promise<void> {
  try {
    memoryCache.set(key, buffer);
    const db = await getDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(buffer, key);
  } catch (err) {
    console.warn('[ElevenLabs Cache] Write error:', err);
  }
}

export interface PlayableVoiceResult {
  /** HTMLAudioElement instance ready for play() in browser environments */
  audio: HTMLAudioElement | null;
  /** Blob object URL for audio source */
  audioUrl: string;
  /** Raw MP3 audio ArrayBuffer */
  audioBuffer: ArrayBuffer;
  /** Binary Blob instance */
  blob: Blob;
  /** MIME Content-Type */
  contentType: string;
  /** Convenience method to play the synthesized audio */
  play: () => Promise<void>;
  /** Convenience method to stop current audio playback */
  stop: () => void;
}

/**
 * Clean Urdu or English text before passing to ElevenLabs TTS
 */
export function cleanTextForUrduVoice(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[(warm|gentle|encouraging|slow|happy|calm|excited)\]/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\*+/g, '')
    .replace(/#+/g, '')
    .replace(/_+/g, ' ')
    .replace(/~/g, '')
    .replace(/`/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reusable function to generate playable MP3 audio for Urdu/English text using ElevenLabs API.
 * 
 * - Checks persistent IndexedDB audio cache before fetching from API
 * - Reads API key from process.env.ELEVENLABS_API_KEY (or via backend proxy route)
 * - Uses the configured Voice ID (default: 21m00Tcm4TlvDq8ikWAM)
 * - Uses the 'eleven_multilingual_v2' model which supports Urdu
 * - Handles errors gracefully with fallback audio stream
 * 
 * @param text The string to convert to speech
 * @param options Custom options (voiceId, modelId, stability, similarityBoost, apiKey, bypassCache)
 * @returns Promise<PlayableVoiceResult> playable MP3 audio object
 */
export async function generateUrduVoice(
  text: string,
  options: ElevenLabsVoiceOptions = {}
): Promise<PlayableVoiceResult> {
  const cleanText = cleanTextForUrduVoice(text);
  if (!cleanText) {
    console.warn('[ElevenLabs Service] Empty or invalid text provided for voice generation.');
    return createEmptyPlayableResult();
  }

  const voiceId = options.voiceId || DEFAULT_VOICE_ID;
  const modelId = options.modelId || DEFAULT_MODEL_ID;
  const stability = options.stability ?? 0.5;
  const similarityBoost = options.similarityBoost ?? 0.75;

  const apiKey =
    options.apiKey ||
    (typeof process !== 'undefined' && process.env?.ELEVENLABS_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ELEVENLABS_API_KEY) ||
    '';

  const cacheKey = `${voiceId}_${modelId}_${cleanText}`;

  // 1. Check persistent Audio Cache first
  if (!options.bypassCache) {
    try {
      const cachedBuffer = await getCachedAudio(cacheKey);
      if (cachedBuffer && cachedBuffer.byteLength > 0) {
        console.log(`[ElevenLabs Cache] HIT for text: "${cleanText.slice(0, 35)}..."`);
        return createPlayableResultFromBuffer(cachedBuffer);
      }
    } catch (cacheReadErr) {
      console.warn('[ElevenLabs Cache] Cache read error, proceeding with API call:', cacheReadErr);
    }
  }

  try {
    let arrayBuffer: ArrayBuffer | null = null;

    if (apiKey) {
      // Direct call to ElevenLabs API if key is present on client/environment
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
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

      if (!response.ok) {
        const errDetails = await response.text().catch(() => 'Unknown error');
        console.warn(`[ElevenLabs Service] API returned status ${response.status}: ${errDetails}`);
        throw new Error(`ElevenLabs API HTTP ${response.status}: ${errDetails}`);
      }

      arrayBuffer = await response.arrayBuffer();
    } else {
      // Proxy call through backend server route /api/elevenlabs/tts
      const proxyResponse = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          voiceId,
          modelId,
          stability,
          similarityBoost,
        }),
      });

      if (!proxyResponse.ok) {
        const errDetails = await proxyResponse.text().catch(() => 'Unknown error');
        console.warn(`[ElevenLabs Service] Proxy endpoint returned status ${proxyResponse.status}: ${errDetails}`);
        throw new Error(`ElevenLabs Proxy HTTP ${proxyResponse.status}: ${errDetails}`);
      }

      arrayBuffer = await proxyResponse.arrayBuffer();
    }

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Received empty audio buffer from ElevenLabs');
    }

    // Save generated audio to persistent cache
    setCachedAudio(cacheKey, arrayBuffer).catch((cacheWriteErr) => {
      console.warn('[ElevenLabs Cache] Failed to save audio to cache:', cacheWriteErr);
    });

    return createPlayableResultFromBuffer(arrayBuffer);
  } catch (error: any) {
    console.error('[ElevenLabs Service] Failed to generate Urdu voice:', error?.message || error);
    
    // Graceful fallback to backup audio stream so callers never crash
    return fallbackToBackupAudio(cleanText);
  }
}

/**
 * Creates PlayableVoiceResult from an ArrayBuffer
 */
function createPlayableResultFromBuffer(buffer: ArrayBuffer): PlayableVoiceResult {
  const blob = new Blob([buffer], { type: 'audio/mpeg' });
  let audioUrl = '';
  let audioElement: HTMLAudioElement | null = null;

  if (typeof window !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
    audioUrl = URL.createObjectURL(blob);
    audioElement = new Audio(audioUrl);
  }

  return {
    audio: audioElement,
    audioUrl,
    audioBuffer: buffer,
    blob,
    contentType: 'audio/mpeg',
    play: async () => {
      stopSpeech();
      if (audioElement) {
        currentElevenLabsAudio = audioElement;
        audioElement.currentTime = 0;
        await audioElement.play();
      } else {
        console.warn('[ElevenLabs Service] Cannot play audio: HTMLAudioElement not available.');
      }
    },
    stop: () => {
      if (audioElement) {
        try {
          audioElement.pause();
          audioElement.currentTime = 0;
        } catch (e) {}
      }
      if (currentElevenLabsAudio === audioElement) {
        currentElevenLabsAudio = null;
      }
    },
  };
}

/**
 * Fallback to server backup audio or Web Speech Synthesis if ElevenLabs is offline or tier restricted
 */
async function fallbackToBackupAudio(text: string): Promise<PlayableVoiceResult> {
  if (typeof window !== 'undefined') {
    try {
      const fallbackUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=ur`;
      const response = await fetch(fallbackUrl);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > 0) {
          return createPlayableResultFromBuffer(buffer);
        }
      }
    } catch (fallbackErr) {
      console.warn('[ElevenLabs Service] Fallback backup audio fetch failed:', fallbackErr);
    }
  }

  return createEmptyPlayableResult(text);
}

/**
 * Creates a safe PlayableVoiceResult that uses SpeechSynthesis if audio buffer is empty
 */
function createEmptyPlayableResult(fallbackText?: string): PlayableVoiceResult {
  const emptyBuffer = new ArrayBuffer(0);
  const blob = new Blob([emptyBuffer], { type: 'audio/mpeg' });
  return {
    audio: null,
    audioUrl: '',
    audioBuffer: emptyBuffer,
    blob,
    contentType: 'audio/mpeg',
    play: async () => {
      stopSpeech();
      if (fallbackText) {
        speakStandardTTS(fallbackText, 'ur');
      } else {
        console.warn('[ElevenLabs Service] play() called on empty audio result.');
      }
    },
    stop: () => {
      stopSpeech();
    },
  };
}

// Note: ElevenLabs auto-handler disabled per user directive. Standard TTS is active.
