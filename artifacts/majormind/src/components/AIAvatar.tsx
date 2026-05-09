import { useEffect, useState } from "react";
import logoUrl from "/logo.png";

export type AvatarState = "idle" | "thinking" | "speaking" | "result";

const GREEN = "#84e4a8";

const THINKING_LINES = [
  "Analyzing your academic profile...",
  "Matching personality patterns...",
  "Finding best career paths for you...",
  "Processing your response...",
  "Building your academic portrait...",
  "Mapping your strengths...",
];

// Waveform bar heights (relative, 0–1)
const WAVE_BARS = [0.45, 0.75, 1, 0.85, 0.55, 0.9, 0.65];

interface Props {
  state: AvatarState;
  microReaction?: string | null;
  isVoiceActive?: boolean;
  size?: number;
}

export default function AIAvatar({
  state,
  microReaction,
  isVoiceActive = false,
  size = 76,
}: Props) {
  const [thinkingIdx, setThinkingIdx] = useState(0);
  const [labelKey, setLabelKey] = useState(0);

  useEffect(() => {
    if (state !== "thinking") {
      setThinkingIdx(0);
      return;
    }
    const id = setInterval(() => {
      setThinkingIdx((i) => (i + 1) % THINKING_LINES.length);
      setLabelKey((k) => k + 1);
    }, 2200);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    setLabelKey((k) => k + 1);
  }, [state, microReaction, isVoiceActive]);

  const ring1 = size + 20;
  const ring2 = size + 42;

  // When voice is active and avatar has returned to idle, keep speaking visuals
  const displayState: AvatarState =
    isVoiceActive && state === "idle" ? "speaking" : state;

  const glowStyle =
    displayState === "idle"
      ? `0 0 18px ${GREEN}28, 0 4px 14px rgba(0,0,0,0.18)`
      : displayState === "thinking"
      ? `0 0 30px ${GREEN}55, 0 4px 18px rgba(0,0,0,0.22)`
      : `0 0 48px ${GREEN}85, 0 6px 22px rgba(0,0,0,0.24)`;

  const showPulseRings = displayState === "speaking" || displayState === "result";
  const showWaveform = isVoiceActive;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* ── Avatar orb ── */}
      <div className="relative" style={{ width: ring2, height: ring2 }}>
        {/* Outer ambient halo */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${GREEN}${displayState === "idle" ? "12" : "28"} 0%, transparent 70%)`,
            transition: "background 0.6s ease",
          }}
        />

        {/* Spinning arc — thinking */}
        {displayState === "thinking" && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: 0,
              border: "2.5px solid transparent",
              borderTopColor: GREEN,
              borderRightColor: `${GREEN}55`,
              animation: "spin-slow 1.6s linear infinite",
            }}
          />
        )}

        {/* Pulse rings — speaking / voice active / result */}
        {showPulseRings && (
          <>
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: `2px solid ${GREEN}`,
                animation: "avatar-ring-pulse 1.8s ease-out infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: `2px solid ${GREEN}`,
                animation: "avatar-ring-pulse 1.8s ease-out infinite 0.55s",
              }}
            />
          </>
        )}

        {/* Inner soft ring */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ring1,
            height: ring1,
            top: (ring2 - ring1) / 2,
            left: (ring2 - ring1) / 2,
            border: `1px solid ${GREEN}${displayState === "idle" ? "22" : "50"}`,
            transition: "border-color 0.5s ease",
          }}
        />

        {/* Core circle */}
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: size,
            height: size,
            top: (ring2 - size) / 2,
            left: (ring2 - size) / 2,
            background: "linear-gradient(145deg, #1a5c3a 0%, #2a8f60 50%, #3db87f 100%)",
            boxShadow: glowStyle,
            animation: "avatar-breathe 4.2s ease-in-out infinite",
            transition: "box-shadow 0.6s ease",
          }}
        >
          <img
            src={logoUrl}
            alt="AI Advisor"
            style={{
              width: size * 0.58,
              height: size * 0.58,
              objectFit: "contain",
              filter: "brightness(1.1) drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
            }}
          />
        </div>
      </div>

      {/* ── Status label ── */}
      <div
        className="text-center min-h-[3.5rem] flex flex-col items-center justify-center gap-1.5 px-6 max-w-[300px]"
        key={labelKey}
        style={{ animation: "fade-slide-up 0.4s ease forwards" }}
      >
        {/* Waveform bars — shown whenever voice is active */}
        {showWaveform && (
          <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
            {WAVE_BARS.map((h, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 3,
                  height: `${h * 18}px`,
                  background: GREEN,
                  transformOrigin: "bottom",
                  animation: `waveform 0.55s ease-in-out infinite ${i * 0.09}s alternate`,
                }}
              />
            ))}
          </div>
        )}

        {/* Text label — adapts to state */}
        {displayState === "idle" && !showWaveform && (
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            AI Academic Advisor
          </p>
        )}

        {displayState === "idle" && showWaveform && (
          <p className="text-xs italic text-muted-foreground">Speaking...</p>
        )}

        {displayState === "thinking" && (
          <div className="space-y-2 flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{
                    background: GREEN,
                    animation: `thinking-bounce 1.1s ease-in-out infinite ${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs italic text-muted-foreground">
              {THINKING_LINES[thinkingIdx]}
            </p>
          </div>
        )}

        {displayState === "speaking" && (
          <p
            className="text-sm font-semibold italic leading-snug"
            style={{
              color: "#71151a",
              animation: "reaction-pop 0.45s ease forwards",
            }}
          >
            {microReaction ?? "One moment..."}
          </p>
        )}

        {displayState === "result" && (
          <p
            className="text-sm font-semibold leading-snug text-center"
            style={{ color: "#71151a" }}
          >
            Based on everything I've analyzed about you...
          </p>
        )}
      </div>
    </div>
  );
}
