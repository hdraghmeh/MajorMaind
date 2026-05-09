import { useCallback, useEffect, useRef, useState } from "react";

const MUTED_KEY = "mm-voice-muted";

// Preferred voices in order of quality — browser picks first available
const PREFERRED = [
  "Google UK English Female",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Google US English",
  "Samantha",
  "Karen",
  "Serena",
  "Moira",
  "Daniel",
  "Fiona",
];

function bestVoice(): SpeechSynthesisVoice | null {
  const all = window.speechSynthesis.getVoices();
  for (const name of PREFERRED) {
    const v = all.find((v) => v.name === name);
    if (v) return v;
  }
  return all.find((v) => v.lang.startsWith("en")) ?? all[0] ?? null;
}

// Strip markdown and clean text for natural TTS delivery
function cleanForSpeech(raw: string): string {
  return raw
    .replace(/[*_~`#>]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export interface UseSpeech {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  isSupported: boolean;
}

export function useSpeech(): UseSpeech {
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(MUTED_KEY) === "true";
  });

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Load voices and cancel on unmount
  useEffect(() => {
    if (!isSupported) return;
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || isMutedRef.current || !text.trim()) return;

      window.speechSynthesis.cancel();

      const clean = cleanForSpeech(text);
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      const voice = bestVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTED_KEY, String(next));
      if (next && isSupported) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isMuted, toggleMute, isSupported };
}
