import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { getSession, createSession, type StoredSession } from "@/lib/sessions";
import { Button, Card, CardContent, CardHeader, CardTitle, Chip } from "@heroui/react";
import { ArrowLeft, Copy, Download, GraduationCap, Lightbulb, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "/logo.png";

const CLEAN = (s: string) => s.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();
const IS_AR = (s: string) => /[\u0600-\u06FF]/.test(s);

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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

export default function Result() {
  const [, params] = useRoute("/result/:sessionId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    if (!params?.sessionId) return;
    const s = getSession(params.sessionId);
    if (!s) { setLocation("/"); return; }
    if (!s.recommendation) { setLocation(`/interview/${s.id}`); return; }
    setSession(s);
  }, [params?.sessionId]);

  const countedScore = useCountUp(session?.recommendation?.matchScore ?? 0, 1400);

  if (!session || !session.recommendation) return null;
  const { recommendation: r } = session;

  const altScores = r.alternativeMajors.map((_, i) => {
    const drop = [15, 23, 30, 37][i] ?? 40;
    return Math.max(r.matchScore - drop, 40);
  });

  const handleCopy = () => {
    const text = [
      `Recommended Major: ${r.recommendedMajor}`,
      `Match Score: ${r.matchScore}%`,
      `\nWhy it fits:\n${r.whyItFits.map((x) => `- ${x}`).join("\n")}`,
      `\nAlternative Majors:\n${r.alternativeMajors.map((x) => `- ${x}`).join("\n")}`,
      `\nAcademic Strengths:\n${r.academicStrengths.map((x) => `- ${x}`).join("\n")}`,
      `\nCareer Advice:\n${r.careerAdvice.map((x) => `- ${x}`).join("\n")}`,
      `\nAdvisor's Note:\n${r.closingMessage}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `majormind-${r.recommendedMajor.replace(/\s+/g, "-").toLowerCase()}-${session.id.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Home
            </Button>
            <img src={logoUrl} alt="MajorMind" className="h-7 w-auto object-contain hidden sm:block opacity-70" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onPress={handleCopy}>
              <Copy className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="outline" size="sm" onPress={handleDownload}>
              <Download className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
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
            Your AI-powered result
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-foreground" style={{ color: "#71151a" }}>
            Recommended Major
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
                <p className="text-white/60 text-xs font-semibold tracking-widest uppercase">Top Match</p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white leading-tight"
                  style={{ direction: IS_AR(r.recommendedMajor) ? "rtl" : "ltr", color: "white" }}
                >
                  {CLEAN(r.recommendedMajor)}
                </h2>
                {r.whyItFits[0] && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.72)", direction: IS_AR(r.whyItFits[0]) ? "rtl" : "ltr" }}
                  >
                    {CLEAN(r.whyItFits[0])}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-5xl md:text-6xl font-bold leading-none tabular-nums" style={{ color: "white" }}>
                  {countedScore}<span className="text-2xl" style={{ color: "rgba(255,255,255,0.65)" }}>%</span>
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>Match score</p>
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
                  style={{ color: "rgba(255,255,255,0.85)", direction: IS_AR(r.admissionNote) ? "rtl" : "ltr" }}
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
                  Why this major?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2.5">
                  {r.whyItFits.slice(1).map((reason, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                      <span style={{ direction: IS_AR(reason) ? "rtl" : "ltr" }}>{CLEAN(reason)}</span>
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
                  Advice for you
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">
                <ul className="space-y-2">
                  {r.careerAdvice.slice(0, 3).map((advice, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed" style={{ direction: IS_AR(advice) ? "rtl" : "ltr" }}>
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
                    Academic strengths
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.academicStrengths.map((s, i) => (
                      <Chip
                        key={i}
                        color="success"
                        variant="soft"
                        size="sm"
                        style={{ direction: IS_AR(s) ? "rtl" : "ltr" }}
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
            Alternative majors
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
                      style={{ direction: IS_AR(major) ? "rtl" : "ltr" }}
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
                Advisor's note
              </p>
              <p
                className="text-muted-foreground leading-relaxed italic"
                style={{ direction: IS_AR(r.closingMessage) ? "rtl" : "ltr" }}
              >
                "{CLEAN(r.closingMessage)}"
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Actions */}
        <FadeIn delay={800} className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onPress={() => { const s = createSession(); setLocation(`/interview/${s.id}`); }}
            variant="primary"
            className="flex-1 py-5 rounded-xl font-medium group"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Start new interview
          </Button>
          <Button
            variant="outline"
            onPress={() => window.print()}
            className="py-5 rounded-xl"
          >
            Print results
          </Button>
        </FadeIn>
      </main>
    </div>
  );
}
