import { setAudioModeAsync } from 'expo-audio';

import { RECITERS } from '../content/quran';

/**
 * Recitation audio — per-surah MP3 streams from the alquran.cloud CDN.
 * The Quran reader uses expo-audio's useAudioPlayer/useAudioPlayerStatus
 * hooks with the URL built here.
 */

const CDN_BASE = 'https://cdn.islamic.network/quran/audio-surah/128';

export function recitationUrl(surahNumber: number, reciterId: string): string {
  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
  return `${CDN_BASE}/${reciter.edition}/${surahNumber}.mp3`;
}

export function nextReciterId(currentId: string): string {
  const index = RECITERS.findIndex((r) => r.id === currentId);
  return RECITERS[(index + 1) % RECITERS.length].id;
}

export function reciterName(reciterId: string): string {
  return (RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0]).name;
}

let audioModeReady = false;

/** Configure playback for spoken audio (once per app run). */
export async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  audioModeReady = true;
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    interruptionMode: 'duckOthers',
  }).catch(() => {
    audioModeReady = false;
  });
}

/** "2:41" from seconds. */
export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
