import { useEffect, useRef, useState, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { getSession, saveSession, type StoredSession } from "@/lib/sessions";
import { getStudentProfile, buildProfileContext } from "@/lib/studentProfile";
import { useInterviewTurn, type InterviewMessage } from "@workspace/api-client-react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIAvatar, { type AvatarState } from "@/components/AIAvatar";

const EMOJI_RE = /[\u{1F1E0}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
const stripEmoji = (s: string) => s.replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();

const REACTIONS = [
  "اختيار مثير للاهتمام...",
  "هذا يخبرني الكثير عنك...",
  "فهمت، هذا مفيد جداً...",
  "أرى إلى أين تتجه...",
  "هذا منظور ذو معنى...",
  "شكراً لمشاركتي هذا...",
  "أقدّر صراحتك...",
  "هذه إشارة رائعة بالنسبة لي...",
  "معبّر جداً — سآخذ هذا بعين الاعتبار...",
];

function pickReaction(): string {
  return REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export default function Interview() {
  const [, params] = useRoute("/interview/:sessionId");
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [session, setSession] = useState<StoredSession | null>(null);
  const [input, setInput] = useState("");
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [microReaction, setMicroReaction] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const profileContextRef = useRef<string | null>(null);
  const turnMutation = useInterviewTurn();

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (!params?.sessionId) return;
    const s = getSession(params.sessionId);
    if (!s) { setLocation("/"); return; }
    if (s.recommendation) { setLocation(`/result/${s.id}`); return; }
    setSession(s);

    if (s.messages.length === 0 && !initialized.current) {
      initialized.current = true;
      const profile = getStudentProfile();
      const profileCtx = profile?.name ? buildProfileContext(profile) : null;
      profileContextRef.current = profileCtx;
      runTurn([], s, false, profileCtx);
    } else if (s.messages.length > 0) {
      const profile = getStudentProfile();
      profileContextRef.current = profile?.name ? buildProfileContext(profile) : null;
    }
  }, [params?.sessionId, isAuthenticated, authLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, avatarState]);

  const runTurn = async (
    currentMessages: InterviewMessage[],
    s: StoredSession,
    forceFinalize?: boolean,
    profileContext?: string | null,
  ): Promise<boolean> => {
    const hasStudentPrior = currentMessages.some((m) => m.role === "student");

    setAvatarState("thinking");
    setMicroReaction(null);

    const TURN_TIMEOUT_MS = 75_000;

    const doFetch = () =>
      turnMutation.mutateAsync({
        data: { messages: currentMessages, forceFinalize, profileContext: profileContext ?? undefined, sessionId: s.id },
      });

    const withTimeout = (fn: () => ReturnType<typeof doFetch>) =>
      Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), TURN_TIMEOUT_MS),
        ),
      ]);

    try {
      let response: Awaited<ReturnType<typeof doFetch>>;
      try {
        response = await withTimeout(doFetch);
      } catch (firstErr) {
        // Only retry on server-side errors (not timeout or network loss)
        if (firstErr instanceof Error && (firstErr.message === "timeout" || firstErr.name === "TypeError")) {
          throw firstErr;
        }
        response = await withTimeout(doFetch);
      }

      const newSession = { ...s };

      if (response.kind === "question" && response.question) {
        const cleanQuestion = stripEmoji(response.question);

        if (hasStudentPrior) {
          const reaction = pickReaction();
          setMicroReaction(reaction);
          setAvatarState("speaking");
          await wait(1400);
          setMicroReaction(null);
        } else {
          setAvatarState("speaking");
          await wait(400);
        }

        newSession.messages = [
          ...currentMessages,
          { role: "advisor", content: cleanQuestion },
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

        await wait(1400);
        setLocation(`/result/${newSession.id}`);
      }

      return true;
    } catch (err: unknown) {
      setAvatarState("idle");
      const isTimeout = err instanceof Error && err.message === "timeout";
      const isNetwork = err instanceof TypeError && err.message.includes("fetch");
      const description = isTimeout
        ? "استغرق الرد وقتاً طويلاً. يرجى المحاولة مجدداً."
        : isNetwork
          ? "تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً."
          : "تعذّر الوصول إلى المستشار. يرجى المحاولة مجدداً.";
      toast({ title: "خطأ في الاتصال", description, variant: "destructive" });
      return false;
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

    // Show student message immediately in UI, but only persist AFTER successful response
    setSession(updatedSession);
    setInput("");

    const ok = await runTurn(updatedMessages, updatedSession, false, profileContextRef.current);

    // Rollback to previous session state if the turn failed (keeps history clean)
    if (!ok) {
      setSession(session);
    }
  };

  const handleForceFinalize = async () => {
    if (!session || avatarState === "thinking") return;
    await runTurn(session.messages, session, true, profileContextRef.current);
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
    <div
      className="flex flex-col"
      style={{ background: "var(--background)", height: "100dvh", maxHeight: "100dvh", overflow: "hidden" }}
    >

      {/* ── Progress header ── */}
      <header
        className="flex-none px-4 py-3 border-b border-[--border] z-10"
        style={{
          background: "color-mix(in oklab, var(--background) 92%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-medium">{session.progress?.stage || "بداية المقابلة"}</span>
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
                    احصل على النتيجة
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
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #84e4a8, #3db87f)" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Avatar panel ── */}
      <div
        className="flex-none flex flex-col items-center border-b border-[--border] pt-4 pb-3"
        style={{ background: "color-mix(in oklab, #84e4a8 4%, var(--background))" }}
      >
        <AIAvatar
          state={avatarState}
          microReaction={microReaction}
          isVoiceActive={false}
          size={72}
        />
      </div>

      {/* ── Chat messages ── */}
      <main className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-6">

          {session.messages.length === 0 && avatarState === "thinking" && (
            <div className="text-center py-6 space-y-2">
              <p className="text-sm text-muted-foreground italic animate-pulse">
                مستشارك يستعد...
              </p>
            </div>
          )}

          {avatarState === "thinking" && session.messages.length > 0 && (
            <div
              className="text-center text-xs py-1 px-3 mx-auto w-fit rounded-full"
              style={{
                background: "color-mix(in oklab, #f59e0b 10%, transparent)",
                color: "#92400e",
                border: "1px solid color-mix(in oklab, #f59e0b 25%, transparent)",
              }}
            >
              حافظ على شاشتك مضاءة أثناء الانتظار
            </div>
          )}

          {session.messages.map((msg, idx) => {
            const isAdvisor = msg.role === "advisor";
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
                      direction: "rtl",
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
                      direction: "rtl",
                    }}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            );
          })}

          {avatarState === "thinking" && (
            <div className="flex justify-start" style={{ animation: "fade-slide-up 0.3s ease forwards" }}>
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
        className="flex-none border-t border-[--border]"
        style={{
          background: "var(--surface)",
          padding: "0.75rem",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Button
              type="submit"
              isIconOnly
              isDisabled={!input.trim() || isBusy}
              variant="primary"
              className="rounded-xl w-10 h-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
            <div
              className={`flex-1 transition-opacity duration-200 ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isBusy ? "مستشارك يُجيب..." : "اكتب إجابتك..."}
                className="w-full rounded-xl text-sm"
                style={{ direction: "rtl" }}
              />
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
