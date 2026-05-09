import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { getSessions, createSession, type StoredSession } from "@/lib/sessions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import logoUrl from "/logo.png";
import { ArrowRight, Brain, MessageSquare, Award, BookOpen, TrendingUp, Users, ChevronDown } from "lucide-react";

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
    desc: "Designed specifically around the Jordanian and Palestinian secondary school system — scientific, literary, and all streams.",
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
    title: "Completely private",
    desc: "Your conversations stay on your device. No account required, no data shared, no ads. Just honest guidance.",
  },
];

const STATS = [
  { value: "8–12", label: "Questions per interview" },
  { value: "100+", label: "University majors covered" },
  { value: "3 min", label: "Average session time" },
  { value: "Free", label: "Always, no credit card" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const all = Object.values(getSessions()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setSessions(all);
  }, []);

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

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #71151a 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <img src={logoUrl} alt="MajorMind" className="mx-auto h-28 w-auto object-contain" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-foreground text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI Academic Advisor for Tawjihi Students
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-destructive leading-tight tracking-tight">
              Think smarter<br />about your future.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              MajorMind has a real conversation with you — about your strengths, interests, and ambitions — then recommends the university major you were made for.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleStart} size="lg" className="px-8 py-6 text-lg rounded-full font-medium group">
              Start your free interview
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToHow} className="px-8 py-6 text-lg rounded-full">
              How it works
            </Button>
          </div>

          {sessions.length > 0 && (
            <p className="text-sm text-muted-foreground">
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

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-accent/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="text-3xl md:text-4xl font-serif text-destructive">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-destructive">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three simple steps from "I don't know what to study" to a clear, data-backed direction.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="group">
              <div className="space-y-5 p-8 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-serif text-border group-hover:text-primary/40 transition-colors">{step.number}</span>
                </div>
                <h3 className="text-xl font-serif text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why MajorMind */}
      <section className="bg-accent/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-24 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-destructive">Why MajorMind</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Built from the ground up for students navigating the most important decision of their academic life.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="flex gap-5 p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <feat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif text-foreground">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div
          className="relative rounded-3xl overflow-hidden text-center px-8 py-20 space-y-8"
          style={{ background: "linear-gradient(135deg, hsl(var(--destructive)) 0%, hsl(356deg 68% 18%) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 70%)" }} />
          </div>
          <div className="relative space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-white">Your future starts with one conversation.</h2>
            <p className="text-xl text-white/70 max-w-xl mx-auto">It takes less than three minutes. No signup, no cost, no pressure.</p>
          </div>
          <div className="relative">
            <Button onClick={handleStart} size="lg" className="px-10 py-6 text-lg rounded-full bg-primary hover:bg-primary/90 font-medium group">
              Begin your interview now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Previous Sessions */}
      {sessions.length > 0 && (
        <section id="sessions" className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
          <h2 className="text-3xl font-serif text-destructive">Your previous sessions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const isComplete = !!session.recommendation;
              return (
                <Link key={session.id} href={isComplete ? `/result/${session.id}` : `/interview/${session.id}`} className="block group">
                  <Card className="hover:border-primary/40 hover:shadow-sm transition-all duration-300">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {session.title || `Interview · ${new Date(session.createdAt).toLocaleDateString()}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{new Date(session.updatedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={isComplete ? "default" : "secondary"}>
                          {isComplete ? "Complete" : "In Progress"}
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 bg-accent/20">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="MajorMind" className="h-10 w-auto object-contain" />
            <div>
              <p className="font-serif text-foreground text-sm">Think smarter about your future.</p>
              <p className="text-xs text-muted-foreground">AI Academic System</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">Built for Tawjihi students. No data stored on servers.</p>
        </div>
      </footer>
    </div>
  );
}
