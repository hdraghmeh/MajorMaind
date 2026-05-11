import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { getSession, saveSession, loadSessionsFromServer, mergeServerSessions, createSession, type StoredSession } from "@/lib/sessions";
import { Button, Card, CardContent, CardHeader, CardTitle, Chip } from "@heroui/react";
import { ArrowRight, ExternalLink, GraduationCap, Lightbulb, RefreshCw, Sparkles, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "/logo.png";

const CLEAN = (s: string) => s.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

function AnimatedBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 100);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div
      className="h-1.5 rounded-full overflow-hidden"
      style={{ background: "color-mix(in oklab, var(--accent) 20%, transparent)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 80%, white))",
          transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {children}
    </div>
  );
}

function FeedbackForm({ sessionId }: { sessionId?: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, rating, comment: comment.trim() || undefined }),
      });
      setSubmitted(true);
    } catch {
      toast({ title: "تعذّر إرسال التقييم", description: "يرجى المحاولة مجدداً.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl px-6 py-5 text-center space-y-1"
        style={{
          background: "color-mix(in oklab, #84e4a8 10%, var(--surface))",
          border: "1px solid color-mix(in oklab, #84e4a8 28%, transparent)",
        }}
      >
        <p className="font-semibold text-sm" style={{ color: "#1a5c3a" }}>شكراً على تقييمك</p>
        <p className="text-xs text-muted-foreground">رأيك يساعدنا على تحسين التجربة</p>
      </div>
    );
  }

  return (
    <Card style={{ boxShadow: "var(--surface-shadow)" }}>
      <CardContent className="p-5 space-y-4">
        <p className="text-sm font-medium text-center" style={{ color: "#71151a" }}>
          كيف كانت تجربتك مع المقابلة؟
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2" dir="ltr">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform duration-150 hover:scale-110 focus:outline-none"
            >
              <Star
                className="w-8 h-8"
                style={{
                  fill: star <= (hovered || rating) ? "#f59e0b" : "transparent",
                  color: star <= (hovered || rating) ? "#f59e0b" : "var(--border)",
                  transition: "fill 0.15s, color 0.15s",
                }}
              />
            </button>
          ))}
        </div>

        {/* Star label */}
        {(hovered || rating) > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            {["", "ضعيفة", "مقبولة", "جيدة", "جيدة جداً", "ممتازة"][hovered || rating]}
          </p>
        )}

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شاركنا تجربتك أو أي ملاحظة (اختياري)..."
          maxLength={500}
          rows={3}
          className="w-full text-sm rounded-xl px-4 py-2.5 resize-none outline-none transition-all duration-200"
          style={{
            direction: "rtl",
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#84e4a8")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />

        <Button
          onPress={handleSubmit}
          isDisabled={!rating || submitting}
          variant="primary"
          className="w-full rounded-xl py-4 text-sm font-medium"
        >
          {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Result() {
  const [, params] = useRoute("/result/:sessionId");
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!params?.sessionId) return;

    async function loadSession() {
      const sessionId = params!.sessionId;

      // 1. Try localStorage immediately — no auth needed, data is local
      let s = getSession(sessionId);

      if (s?.recommendation) {
        setSession(s);
        setLoading(false);
        return;
      }

      // Steps 2 & 3 require auth — wait until auth is resolved
      if (authLoading || !isAuthenticated) return;

      // 2. Sync from server interview_sessions table
      if (!s || !s.recommendation) {
        try {
          const serverSessions = await loadSessionsFromServer();
          if (serverSessions.length > 0) {
            await mergeServerSessions(serverSessions);
            s = getSession(sessionId);
          }
        } catch {
          // ignore server errors
        }
      }

      // 3. Fallback: completed_interviews table
      if (!s?.recommendation) {
        try {
          const res = await fetch(`/api/interview-result/${encodeURIComponent(sessionId)}`);
          if (res.ok) {
            const record = await res.json() as {
              recommendation: NonNullable<StoredSession["recommendation"]>;
              fullConversation: StoredSession["messages"];
              sessionId: string;
              savedAt: string;
            };
            if (record.recommendation) {
              const recovered: StoredSession = s ?? {
                id: sessionId,
                createdAt: record.savedAt,
                updatedAt: record.savedAt,
                messages: record.fullConversation ?? [],
              };
              recovered.recommendation = record.recommendation;
              s = recovered;
              saveSession(recovered);
            }
          }
        } catch {
          // ignore fallback errors
        }
      }

      if (!s) { setLoading(false); setLocation("/"); return; }
      if (!s.recommendation) { setLoading(false); setLocation(`/interview/${s.id}`); return; }
      setSession(s);
      setLoading(false);
    }

    loadSession();
  }, [params?.sessionId, authLoading, isAuthenticated]);

  const countedScore = useCountUp(session?.recommendation?.matchScore ?? 0, 1400);



  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground animate-pulse">جاري تحميل نتائجك...</div>
      </div>
    );
  }

  if (!session || !session.recommendation) return null;
  const r = session.recommendation;
  const altScores = r.alternativeMajors.map((_, i) => {
    const drop = [15, 23, 30, 37][i] ?? 40;
    return Math.max(r.matchScore - drop, 40);
  });

  return (
    <div className="min-h-[100dvh] bg-background selection:bg-[--accent]/30">

      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b border-[--border]"
        style={{
          background: "color-mix(in oklab, var(--background) 90%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setLocation("/")}
              className="text-muted-foreground hover:text-foreground -mr-2"
            >
              <ArrowRight className="w-4 h-4 ml-1.5" /> الرئيسية
            </Button>
            <img src={logoUrl} alt="MajorMind" className="h-7 w-auto object-contain hidden sm:block opacity-70" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 pb-24 pt-10 space-y-6">

        {/* Title badge */}
        <FadeIn delay={0} className="text-center space-y-3">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
            style={{
              background: "color-mix(in oklab, var(--accent) 12%, transparent)",
              borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)",
              color: "var(--accent-foreground)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            نتيجتك بالذكاء الاصطناعي
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-foreground" style={{ color: "#71151a" }}>
            التخصص الموصى به
          </h1>
        </FadeIn>

        {/* Hero match card */}
        <FadeIn delay={150}>
          <div
            className="relative rounded-2xl p-6 md:p-8 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a5c3a 0%, #2d9b6b 55%, #3db87f 100%)" }}
          >
            <div
              className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-[0.12]"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <p className="text-white/60 text-xs font-semibold tracking-widest uppercase">الأفضل توافقاً</p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white leading-tight"
                  style={{ direction: "rtl", color: "white" }}
                >
                  {CLEAN(r.recommendedMajor)}
                </h2>
                {r.whyItFits[0] && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.72)", direction: "rtl" }}
                  >
                    {CLEAN(r.whyItFits[0])}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-left">
                <div className="text-5xl md:text-6xl font-bold leading-none tabular-nums" style={{ color: "white" }}>
                  {countedScore}<span className="text-2xl" style={{ color: "rgba(255,255,255,0.65)" }}>%</span>
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>نسبة التوافق</p>
              </div>
            </div>
            {r.admissionNote && (
              <div
                className="relative mt-4 pt-4 border-t flex items-start gap-2"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <GraduationCap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }} />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.85)", direction: "rtl" }}
                >
                  {CLEAN(r.admissionNote)}
                </p>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Why this major */}
          <FadeIn delay={300} className="h-full">
            <Card className="h-full" style={{ boxShadow: "var(--surface-shadow)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium" style={{ color: "#71151a" }}>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)" }}
                  >
                    <GraduationCap className="w-4 h-4" style={{ color: "var(--accent-foreground)" }} />
                  </div>
                  لماذا هذا التخصص؟
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2.5">
                  {r.whyItFits.slice(1).map((reason, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                      <span style={{ direction: "rtl" }}>{CLEAN(reason)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Advice + strengths */}
          <FadeIn delay={400} className="h-full">
            <Card className="h-full" style={{ boxShadow: "var(--surface-shadow)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium" style={{ color: "#71151a" }}>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)" }}
                  >
                    <Lightbulb className="w-4 h-4" style={{ color: "var(--accent-foreground)" }} />
                  </div>
                  نصائح لك
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">
                <ul className="space-y-2">
                  {r.careerAdvice.slice(0, 3).map((advice, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed" style={{ direction: "rtl" }}>
                      {CLEAN(advice)}
                    </li>
                  ))}
                </ul>

                <div
                  className="border-t pt-4 space-y-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#71151a" }}>
                    <TrendingUp className="w-4 h-4" style={{ color: "var(--accent-foreground)" }} />
                    نقاط القوة الأكاديمية
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.academicStrengths.map((s, i) => (
                      <Chip
                        key={i}
                        color="success"
                        variant="soft"
                        size="sm"
                        style={{ direction: "rtl" }}
                      >
                        {CLEAN(s)}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Alternative majors */}
        <FadeIn delay={550} className="space-y-4">
          <div className="flex items-center gap-2 font-medium" style={{ color: "#71151a" }}>
            <GraduationCap className="w-5 h-5" style={{ color: "var(--accent-foreground)" }} />
            التخصصات البديلة
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {r.alternativeMajors.map((major, i) => (
              <Card
                key={i}
                className="hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                style={{ boxShadow: "var(--surface-shadow)" }}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="font-medium text-sm leading-snug text-foreground"
                      style={{ direction: "rtl" }}
                    >
                      {CLEAN(major)}
                    </span>
                    <span
                      className="text-sm font-bold shrink-0"
                      style={{ color: "var(--accent-foreground)" }}
                    >
                      {altScores[i]}%
                    </span>
                  </div>
                  <AnimatedBar value={altScores[i]} delay={600 + i * 120} />
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        {/* Closing note */}
        <FadeIn delay={700}>
          <Card style={{ boxShadow: "var(--surface-shadow)" }}>
            <CardContent
              className="p-6 space-y-2 rounded-2xl"
              style={{
                background: "color-mix(in oklab, var(--accent) 6%, var(--surface))",
                border: "1px solid color-mix(in oklab, var(--accent) 20%, transparent)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--accent-foreground)" }}
              >
                رسالة المستشار
              </p>
              <p
                className="text-muted-foreground leading-relaxed italic"
                style={{ direction: "rtl" }}
              >
                "{CLEAN(r.closingMessage)}"
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Feedback */}
        <FadeIn delay={820}>
          <FeedbackForm sessionId={params?.sessionId} />
        </FadeIn>

        {/* AAUP CTA */}
        <FadeIn delay={780}>
          <a
            href="https://www.aaup.edu/ar"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 w-full rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #71151a 0%, #a01f26 100%)",
              boxShadow: "0 4px 24px color-mix(in oklab, #71151a 30%, transparent)",
            }}
          >
            <div className="flex items-center gap-3" style={{ direction: "rtl" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-snug">تعرّف على الجامعة العربية الأمريكية</p>
                <p className="text-white/60 text-xs mt-0.5">aaup.edu — استكشف تخصصاتك وفرص القبول</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/70 shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
          </a>
        </FadeIn>

        {/* Actions */}
        <FadeIn delay={900} className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onPress={() => { const s = createSession(); setLocation(`/interview/${s.id}`); }}
            variant="primary"
            className="flex-1 py-5 rounded-xl font-medium group"
          >
            <RefreshCw className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-500" />
            بدء مقابلة جديدة
          </Button>
        </FadeIn>
      </main>
    </div>
  );
}
