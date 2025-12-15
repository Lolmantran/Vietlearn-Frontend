/**
 * Audio utility functions for pronunciation playback
 */

/**
 * Generate Google Translate TTS URL for Chinese text
 * @param text - Chinese text to convert to speech
 * @param lang - Language code (default: zh-CN for Mandarin)
 */
export function getGoogleTTSUrl(text: string, lang: string = "zh-CN"): string {
  const encodedText = encodeURIComponent(text);
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}`;
}

/**
 * Play audio from a URL
 * @param url - Audio URL to play
 */
export async function playAudio(url: string): Promise<void> {
  try {
    const audio = new Audio(url);
    await audio.play();
  } catch (error) {
    console.error("Error playing audio:", error);
    throw error;
  }
}

/**
 * Preload audio for better performance
 * @param url - Audio URL to preload
 */
export function preloadAudio(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.preload = "auto";
  return audio;
}
