import { useEffect, useRef, useState, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { getSession, saveSession, type StoredSession } from "@/lib/sessions";
import { useInterviewTurn, type InterviewMessage } from "@workspace/api-client-react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIAvatar, { type AvatarState } from "@/components/AIAvatar";

const EMOJI_RE = /[\u{1F1E0}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
const stripEmoji = (s: string) => s.replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();

const IS_AR = (s: string) => /[\u0600-\u06FF]/.test(s);

const REACTIONS = [
  "Interesting choice...",
  "That tells me a lot about you...",
  "Got it, this is very insightful...",
  "I see where you're going with this...",
  "That's a meaningful perspective...",
  "Thank you for sharing that...",
  "I appreciate your honesty...",
  "That's a great signal for me...",
  "Very telling — I'll factor this in...",
];

function pickReaction(): string {
  return REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
}

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export default function Interview() {
  const [, params] = useRoute("/interview/:sessionId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [session, setSession] = useState<StoredSession | null>(null);
  const [input, setInput] = useState("");
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [microReaction, setMicroReaction] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const turnMutation = useInterviewTurn();

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!params?.sessionId) return;
    const s = getSession(params.sessionId);
    if (!s) { setLocation("/"); return; }
    if (s.recommendation) { setLocation(`/result/${s.id}`); return; }
    setSession(s);

    if (s.messages.length === 0 && !initialized.current) {
      initialized.current = true;
      runTurn([], s);
    }
  }, [params?.sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, avatarState]);

  const runTurn = async (
    currentMessages: InterviewMessage[],
    s: StoredSession,
    forceFinalize?: boolean,
  ) => {
    const hasStudentPrior = currentMessages.some((m) => m.role === "student");

    setAvatarState("thinking");
    setMicroReaction(null);

    try {
      const response = await turnMutation.mutateAsync({
        data: { messages: currentMessages, forceFinalize },
      });

      const newSession = { ...s };

      if (response.kind === "question" && response.question) {
        // Show micro-reaction if student has answered something
        if (hasStudentPrior) {
          const reaction = pickReaction();
          setMicroReaction(reaction);
          setAvatarState("speaking");
          await delay(1400);
          setMicroReaction(null);
        } else {
          // First greeting — quick speaking pulse
          setAvatarState("speaking");
          await delay(600);
        }

        newSession.messages = [
          ...currentMessages,
          { role: "advisor", content: stripEmoji(response.question) },
        ];
        newSession.progress = response.progress;
        saveSession(newSession);
        setSession(newSession);
        setAvatarState("idle");

      } else if (response.kind === "result" && response.recommendation) {
        setAvatarState("result");
        newSession.recommendation = response.recommendation;
        newSession.progress = response.progress;
        newSession.title = response.recommendation.recommendedMajor;
        saveSession(newSession);
        setSession(newSession);
        await delay(1200);
        setLocation(`/result/${newSession.id}`);
      }
    } catch (err: unknown) {
      setAvatarState("idle");
      const description =
        err instanceof Error ? err.message : "Unable to reach the advisor. Please try again.";
      toast({ title: "Connection Error", description, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || avatarState === "thinking") return;

    const cleaned = stripEmoji(input);
    if (!cleaned) return;

    const newMessage: InterviewMessage = { role: "student", content: cleaned };
    const updatedMessages = [...session.messages, newMessage];
    const updatedSession = { ...session, messages: updatedMessages };

    saveSession(updatedSession);
    setSession(updatedSession);
    setInput("");

    await runTurn(updatedMessages, updatedSession);
  };

  const handleForceFinalize = async () => {
    if (!session || avatarState === "thinking") return;
    await runTurn(session.messages, session, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  if (!session) return null;

  const progress = session.progress?.percent ?? 0;
  const isBusy = avatarState === "thinking" || avatarState === "speaking" || avatarState === "result";

  return (
    <div className="flex flex-col h-[100dvh]" style={{ background: "var(--background)" }}>

      {/* ── Top progress bar ── */}
      <header
        className="flex-none px-4 py-3 border-b border-[--border] z-10"
        style={{
          background: "color-mix(in oklab, var(--background) 92%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-medium">{session.progress?.stage || "Getting started"}</span>
              <div className="flex items-center gap-3">
                <span>{progress}%</span>
                {session.messages.length > 2 && (
                  <button
                    onClick={handleForceFinalize}
                    disabled={isBusy}
                    className="flex items-center gap-1 text-xs font-medium disabled:opacity-40 transition-opacity hover:opacity-70"
                    style={{ color: "#71151a" }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Get result
                  </button>
                )}
              </div>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "color-mix(in oklab, #84e4a8 18%, transparent)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #84e4a8, #3db87f)",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Avatar panel ── */}
      <div
        className="flex-none flex justify-center border-b border-[--border]"
        style={{
          background: "color-mix(in oklab, #84e4a8 4%, var(--background))",
        }}
      >
        <AIAvatar state={avatarState} microReaction={microReaction} size={72} />
      </div>

      {/* ── Chat messages ── */}
      <main className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-6">

          {session.messages.length === 0 && avatarState === "thinking" && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground italic animate-pulse">
                Your advisor is preparing...
              </p>
            </div>
          )}

          {session.messages.map((msg, idx) => {
            const isAdvisor = msg.role === "advisor";
            const isAr = IS_AR(msg.content);
            const isLast = idx === session.messages.length - 1;

            return (
              <div
                key={idx}
                className={`flex ${isAdvisor ? "justify-start" : "justify-end"}`}
                style={{ animation: isLast ? "fade-slide-up 0.4s ease forwards" : undefined }}
              >
                {isAdvisor ? (
                  <div
                    className="max-w-[88%] sm:max-w-[78%] rounded-2xl rounded-tl-sm px-5 py-3.5 leading-relaxed border border-[--border] text-sm"
                    style={{
                      background: "var(--surface)",
                      boxShadow: "var(--surface-shadow)",
                      direction: isAr ? "rtl" : "ltr",
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className="max-w-[88%] sm:max-w-[78%] rounded-2xl rounded-tr-sm px-5 py-3.5 leading-relaxed text-sm"
                    style={{
                      background: "color-mix(in oklab, #84e4a8 16%, var(--surface))",
                      border: "1px solid color-mix(in oklab, #84e4a8 28%, transparent)",
                      color: "var(--foreground)",
                      direction: isAr ? "rtl" : "ltr",
                    }}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking dots in chat — only when no micro-reaction is showing */}
          {avatarState === "thinking" && (
            <div
              className="flex justify-start"
              style={{ animation: "fade-slide-up 0.3s ease forwards" }}
            >
              <div
                className="rounded-2xl rounded-tl-sm px-5 py-3.5 border border-[--border] flex items-center gap-1.5"
                style={{ background: "var(--surface)", boxShadow: "var(--surface-shadow)" }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block w-2 h-2 rounded-full"
                    style={{
                      background: "#84e4a8",
                      animation: `thinking-bounce 1.1s ease-in-out infinite ${i * 0.18}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Input ── */}
      <footer
        className="flex-none p-3 border-t border-[--border]"
        style={{ background: "var(--surface)" }}
      >
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className={`flex-1 transition-opacity duration-200 ${isBusy ? "opacity-50 pointer-events-none" : ""}`}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isBusy ? "Your advisor is responding..." : "Type your response..."}
                className="w-full rounded-xl text-sm"
                style={{ direction: IS_AR(input) ? "rtl" : "ltr" }}
              />
            </div>
            <Button
              type="submit"
              isIconOnly
              isDisabled={!input.trim() || isBusy}
              variant="primary"
              className="rounded-xl w-10 h-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
