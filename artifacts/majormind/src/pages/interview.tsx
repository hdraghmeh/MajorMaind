import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { getSession, saveSession, type StoredSession } from "@/lib/sessions";
import { useInterviewTurn, type InterviewMessage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
    } catch (err: any) {
      toast({
        title: "Connection Error",
        description: err?.statusText || "Unable to reach the advisor. Please try again.",
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

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="flex-none p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-1 w-full max-w-sm">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{session.progress?.stage || "Getting started"}</span>
              <span>{session.progress?.percent || 0}%</span>
            </div>
            <Progress value={session.progress?.percent || 0} className="h-1.5" />
          </div>
          {session.messages.length > 2 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleForceFinalize}
              disabled={turnMutation.isPending}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Ready for recommendation
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {session.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  msg.role === "student"
                    ? "bg-muted text-muted-foreground ml-12 rounded-tr-sm"
                    : "bg-primary/10 text-foreground mr-12 rounded-tl-sm border border-primary/20 font-serif leading-relaxed"
                }`}
                style={{ direction: /[\u0600-\u06FF]/.test(msg.content) ? "rtl" : "ltr" }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {turnMutation.isPending && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-4 bg-primary/5 border border-primary/10 mr-12 w-64">
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-4/5 bg-primary/10" />
                  <Skeleton className="h-4 w-2/3 bg-primary/10" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="flex-none p-4 bg-background border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              disabled={turnMutation.isPending}
              className="pr-12 py-6 text-base rounded-full border-border/50 focus-visible:ring-primary/30"
              style={{ direction: /[\u0600-\u06FF]/.test(input) ? "rtl" : "ltr" }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || turnMutation.isPending}
              className="absolute right-2 rounded-full w-10 h-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
