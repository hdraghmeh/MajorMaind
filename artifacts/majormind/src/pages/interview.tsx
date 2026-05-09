import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { getSession, saveSession, type StoredSession } from "@/lib/sessions";
import { useInterviewTurn, type InterviewMessage } from "@workspace/api-client-react";
import { Button, Spinner } from "@heroui/react";
import { Input } from "@heroui/react";
import { Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "/logo.png";

const EMOJI_RE = /[\u{1F1E0}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
const stripEmoji = (s: string) => s.replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();

export default function Interview() {
  const [, params] = useRoute("/interview/:sessionId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [session, setSession] = useState<StoredSession | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const turnMutation = useInterviewTurn();

  useEffect(() => {
    if (!params?.sessionId) return;
    const s = getSession(params.sessionId);
    if (!s) {
      setLocation("/");
      return;
    }
    if (s.recommendation) {
      setLocation(`/result/${s.id}`);
      return;
    }
    setSession(s);

    if (s.messages.length === 0 && !initialized.current) {
      initialized.current = true;
      handleTurn([], s);
    }
  }, [params?.sessionId, setLocation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [session?.messages, turnMutation.isPending]);

  const handleTurn = async (currentMessages: InterviewMessage[], s: StoredSession, forceFinalize?: boolean) => {
    try {
      const response = await turnMutation.mutateAsync({
        data: { messages: currentMessages, forceFinalize },
      });

      const newSession = { ...s };

      if (response.kind === "question" && response.question) {
        newSession.messages = [
          ...currentMessages,
          { role: "advisor", content: stripEmoji(response.question) },
        ];
        newSession.progress = response.progress;
      } else if (response.kind === "result" && response.recommendation) {
        newSession.recommendation = response.recommendation;
        newSession.progress = response.progress;
        newSession.title = response.recommendation.recommendedMajor;
      }

      saveSession(newSession);
      setSession(newSession);

      if (response.kind === "result") {
        setLocation(`/result/${newSession.id}`);
      }
    } catch (err: unknown) {
      const description =
        err instanceof Error ? err.message : "Unable to reach the advisor. Please try again.";
      toast({
        title: "Connection Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || turnMutation.isPending) return;

    const cleaned = stripEmoji(input);
    if (!cleaned) return;
    const newMessage: InterviewMessage = { role: "student", content: cleaned };
    const updatedMessages = [...session.messages, newMessage];

    const updatedSession = { ...session, messages: updatedMessages };
    saveSession(updatedSession);
    setSession(updatedSession);
    setInput("");

    await handleTurn(updatedMessages, updatedSession);
  };

  const handleForceFinalize = async () => {
    if (!session || turnMutation.isPending) return;
    await handleTurn(session.messages, session, true);
  };

  if (!session) return null;

  const progress = session.progress?.percent ?? 0;

  return (
    <div className="flex flex-col h-[100dvh]" style={{ background: "var(--background)" }}>

      {/* Header */}
      <header
        className="flex-none px-4 py-3 border-b border-[--border] sticky top-0 z-10"
        style={{
          background: "color-mix(in oklab, var(--background) 90%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <img src={logoUrl} alt="MajorMind" className="h-8 w-auto object-contain shrink-0" />

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{session.progress?.stage || "Getting started"}</span>
              <span>{progress}%</span>
            </div>
            {/* HeroUI-styled progress bar */}
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "color-mix(in oklab, var(--accent) 20%, transparent)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 70%, white))",
                }}
              />
            </div>
          </div>

          {session.messages.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleForceFinalize}
              isDisabled={turnMutation.isPending}
              className="text-muted-foreground hover:text-foreground text-xs shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Get result
            </Button>
          )}
        </div>
      </header>

      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-5 pb-4">
          {session.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "advisor" && (
                <div className="flex items-end gap-2 mr-12 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mb-0.5" style={{ background: "color-mix(in oklab, var(--accent) 20%, transparent)" }}>
                    <img src={logoUrl} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-5 py-4 font-sans leading-relaxed border border-[--border]"
                    style={{
                      background: "var(--surface)",
                      direction: /[\u0600-\u06FF]/.test(msg.content) ? "rtl" : "ltr",
                      boxShadow: "var(--surface-shadow)",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              )}

              {msg.role === "student" && (
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-5 py-4 ml-12"
                  style={{
                    background: "color-mix(in oklab, var(--accent) 18%, var(--surface))",
                    color: "var(--foreground)",
                    direction: /[\u0600-\u06FF]/.test(msg.content) ? "rtl" : "ltr",
                    border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
                  }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {turnMutation.isPending && (
            <div className="flex items-end gap-2 mr-12">
              <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mb-0.5" style={{ background: "color-mix(in oklab, var(--accent) 20%, transparent)" }}>
                <img src={logoUrl} alt="" className="w-5 h-5 object-contain" />
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-5 py-4 border border-[--border] flex items-center gap-3"
                style={{ background: "var(--surface)", boxShadow: "var(--surface-shadow)" }}
              >
                <Spinner size="sm" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input footer */}
      <footer
        className="flex-none p-4 border-t border-[--border]"
        style={{ background: "var(--surface)" }}
      >
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                isDisabled={turnMutation.isPending}
                className="w-full pr-2 py-3 text-base rounded-2xl"
                style={{
                  direction: /[\u0600-\u06FF]/.test(input) ? "rtl" : "ltr",
                }}
              />
            </div>
            <Button
              type="submit"
              isIconOnly
              isDisabled={!input.trim() || turnMutation.isPending}
              variant="primary"
              className="rounded-xl w-11 h-11 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
