import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { getSessions, createSession, loadSessionsFromServer, mergeServerSessions, backfillLocalSessionsToServer, type StoredSession } from "@/lib/sessions";
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { useAuth } from "@workspace/replit-auth-web";
import Navbar from "@/components/Navbar";
import logoUrl from "/logo.png";
import { ArrowRight, Brain, MessageSquare, Award, BookOpen, TrendingUp, Users, ChevronDown, LogIn } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "A real conversation",
    desc: "MajorMind asks you thoughtful questions one at a time — about your strengths, passions, and personality. No forms. No checkboxes.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Deep analysis",
    desc: "As you talk, our AI builds a hidden profile of your academic strengths, learning style, and career interests.",
  },
  {
    number: "03",
    icon: Award,
    title: "Your personalized result",
    desc: "You receive a recommended major, a match score, detailed reasoning, alternatives, and an actionable career roadmap.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Built for Tawjihi",
    desc: "Designed specifically around the Palestinian Tawjihi system — scientific, literary, and all streams.",
  },
  {
    icon: Brain,
    title: "AI-powered insight",
    desc: "Uses advanced language AI to understand your answers in context, not just keywords. Speaks English and Arabic.",
  },
  {
    icon: TrendingUp,
    title: "Career roadmap",
    desc: "Beyond the major, you get concrete next steps: skills to build, courses to explore, and a clear academic direction.",
  },
  {
    icon: Users,
    title: "Private by default",
    desc: "No account required. Sign in to save your sessions across devices — your data is never shared or sold.",
  },
];

const STATS = [
  { value: "8–12", label: "Questions per interview" },
  { value: "100+", label: "University majors covered" },
  { value: "3 min", label: "Average session time" },
  { value: "Free", label: "Always, no credit card" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();

  useEffect(() => {
    let active = true;

    async function loadSessions() {
      if (isAuthenticated) {
        const serverSessions = await loadSessionsFromServer();
        if (!active) return;
        await backfillLocalSessionsToServer(serverSessions);
        await mergeServerSessions(serverSessions);
      }

      if (!active) return;
      const all = Object.values(getSessions()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setSessions(all);
    }

    if (!authLoading) {
      loadSessions();
    }

    return () => { active = false; };
  }, [isAuthenticated, authLoading]);

  const handleStart = () => {
    const session = createSession();
    setLocation(`/interview/${session.id}`);
  };

  const scrollToHow = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] bg-background" style={{ scrollBehavior: "smooth" }}>
      <Navbar variant="landing" />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden"
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="animate-orb-drift absolute top-1/4 left-1/2 w-[680px] h-[680px] rounded-full opacity-[0.16]"
            style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 68%)" }}
          />
          <div
            className="animate-orb-drift-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.10]"
            style={{ background: "radial-gradient(circle, #71151a 0%, transparent 68%)" }}
          />
          <div
            className="animate-orb-drift-2 absolute top-2/3 left-[15%] w-[220px] h-[220px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 70%)", animationDelay: "4s" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-8">
          {/* Floating logo */}
          <img
            src={logoUrl}
            alt="MajorMind"
            className="animate-float mx-auto h-28 w-auto object-contain drop-shadow-lg"
          />

          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[--accent]/40 bg-[--accent]/10 text-sm font-medium" style={{ color: "var(--accent-foreground)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
              </span>
              AI Academic Advisor for Tawjihi Students
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
              <span className="gradient-text">Think smarter</span>
              <br />
              <span className="text-foreground">about your future.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              MajorMind has a real conversation with you — about your strengths, interests, and ambitions — then recommends the university major you were made for.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              onPress={handleStart}
              size="lg"
              className="btn-shimmer px-8 py-6 text-lg rounded-full group"
            >
              Start your free interview
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onPress={scrollToHow}
              className="px-8 py-6 text-lg rounded-full"
            >
              How it works
            </Button>
          </div>

          {!authLoading && !isAuthenticated && (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
              <button
                onClick={() => setLocation("/login")}
                className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Sign in to save your sessions across devices
              </button>
            </p>
          )}

          {sessions.length > 0 && (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
              You have {sessions.length} previous session{sessions.length > 1 ? "s" : ""} —{" "}
              <button
                onClick={() => document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" })}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                resume one
              </button>
            </p>
          )}
        </div>

        <button
          onClick={scrollToHow}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[--border] bg-[--surface-secondary]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="text-center space-y-1">
              <div className="text-3xl md:text-4xl font-serif" style={{ color: "#71151a" }}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        <Reveal className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif" style={{ color: "#71151a" }}>How it works</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three simple steps from "I don't know what to study" to a clear, data-backed direction.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 120}>
              <Card
                className="h-full group hover:-translate-y-2 transition-all duration-300 cursor-default"
                style={{ boxShadow: "var(--surface-shadow)" }}
              >
                <CardContent className="p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)" }}
                    >
                      <step.icon className="w-6 h-6" style={{ color: "var(--accent-foreground)" }} />
                    </div>
                    <span
                      className="text-4xl font-serif opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                      style={{ color: "var(--accent)" }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif" style={{ color: "#71151a" }}>{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Why MajorMind ── */}
      <section className="border-y border-[--border]" style={{ background: "var(--surface-secondary)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24 space-y-16">
          <Reveal className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif" style={{ color: "#71151a" }}>Why MajorMind</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Built from the ground up for students navigating the most important decision of their academic life.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 100}>
                <Card
                  className="group hover:-translate-y-1.5 transition-all duration-300 cursor-default h-full"
                  style={{ boxShadow: "var(--surface-shadow)" }}
                >
                  <CardContent className="p-7 flex gap-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)" }}
                    >
                      <feat.icon className="w-5 h-5" style={{ color: "var(--accent-foreground)" }} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif" style={{ color: "#71151a" }}>{feat.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div
            className="relative rounded-3xl overflow-hidden text-center px-8 py-20 space-y-8"
            style={{ background: "linear-gradient(135deg, #71151a 0%, #5a1015 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div
                className="animate-orb-drift-2 absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.15]"
                style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 70%)" }}
              />
              <div
                className="animate-orb-drift absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-[0.10]"
                style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 70%)", animationDelay: "2s" }}
              />
            </div>
            <div className="relative space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white" style={{ color: "white" }}>
                Your future starts with one conversation.
              </h2>
              <p className="text-xl font-light max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
                It takes less than three minutes. No signup, no cost, no pressure.
              </p>
            </div>
            <div className="relative">
              <Button
                onPress={handleStart}
                size="lg"
                className="btn-shimmer px-10 py-6 text-lg rounded-full group"
              >
                Begin your interview now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Previous Sessions ── */}
      {sessions.length > 0 && (
        <section id="sessions" className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
          <Reveal>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif" style={{ color: "#71151a" }}>Your previous sessions</h2>
              {isAuthenticated && (
                <span className="text-xs text-muted-foreground bg-[--surface-secondary] px-3 py-1 rounded-full border border-[--border]">
                  Synced across devices
                </span>
              )}
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {sessions.map((session, i) => {
              const isComplete = !!session.recommendation;
              return (
                <Reveal key={session.id} delay={i * 80}>
                  <Link href={isComplete ? `/result/${session.id}` : `/interview/${session.id}`} className="block group">
                    <Card
                      className="hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      style={{ boxShadow: "var(--surface-shadow)" }}
                    >
                      <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {session.title || `Interview · ${new Date(session.createdAt).toLocaleDateString()}`}
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(session.updatedAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Chip
                            color={isComplete ? "success" : "default"}
                            variant="soft"
                            size="sm"
                          >
                            {isComplete ? "Complete" : "In Progress"}
                          </Chip>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-[--border]" style={{ background: "var(--surface-secondary)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="MajorMind" className="h-10 w-auto object-contain" />
            <div>
              <p className="font-serif text-sm font-semibold" style={{ color: "#71151a" }}>Think smarter about your future.</p>
              <p className="text-xs text-muted-foreground">AI Academic System</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">Built for Tawjihi students. Sign in to sync your sessions.</p>
        </div>
      </footer>
    </div>
  );
}
