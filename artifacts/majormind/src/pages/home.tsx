import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { getSessions, createSession, loadSessionsFromServer, mergeServerSessions, reconcileCompletedSessions, type StoredSession } from "@/lib/sessions";
import { getStudentProfile } from "@/lib/studentProfile";
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { useAuth } from "@workspace/replit-auth-web";
import Navbar from "@/components/Navbar";
import WelcomeModal, { hasBeenWelcomed, markWelcomed } from "@/components/WelcomeModal";
import logoUrl from "/logo.png";
import { ArrowLeft, Brain, MessageSquare, Award, BookOpen, TrendingUp, Sparkles, ChevronDown, UserCircle, Archive } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "محادثة حقيقية",
    desc: "يطرح عليك MajorMind أسئلة مدروسة واحدة تلو الأخرى — عن نقاط قوتك وشغفك وشخصيتك. بلا نماذج. بلا خانات اختيار.",
  },
  {
    number: "02",
    icon: Brain,
    title: "تحليل عميق",
    desc: "أثناء حديثك، يبني مستشارنا الذكي ملفاً خفياً لنقاط قوتك الأكاديمية وأسلوب تعلمك واهتماماتك المهنية.",
  },
  {
    number: "03",
    icon: Award,
    title: "نتيجتك الشخصية",
    desc: "تحصل على التخصص الموصى به، ونسبة التوافق، والأسباب التفصيلية، والبدائل، وخارطة طريق مهنية قابلة للتنفيذ.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "مصمم للتوجيهي",
    desc: "مُصمَّم خصيصاً لطلاب التوجيهي الفلسطيني — العلمي والأدبي والتجاري والصناعي وجميع الفروع.",
  },
  {
    icon: Brain,
    title: "رؤية بالذكاء الاصطناعي",
    desc: "يستخدم الذكاء الاصطناعي المتقدم لفهم إجاباتك في سياقها الكامل، لا مجرد كلمات مفتاحية. يتحدث العربية بطلاقة.",
  },
  {
    icon: TrendingUp,
    title: "خارطة طريق مهنية",
    desc: "بعد التخصص مباشرةً، تحصل على خطوات ملموسة: مهارات تبنيها، مقررات تستكشفها، وتوجه أكاديمي واضح.",
  },
  {
    icon: Sparkles,
    title: "توصية شخصية ١٠٠٪",
    desc: "لا إجابات جاهزة ولا قوالب — كل توصية تُبنى على إجاباتك أنت، وتراعي معدلك وميولك وطموحاتك.",
  },
];

const STATS = [
  { value: "٨–١٢", label: "سؤالاً في كل مقابلة" },
  { value: "+١٠٠", label: "تخصص جامعي مغطى" },
  { value: "٣ دقائق", label: "متوسط وقت الجلسة" },
  { value: "مجاني", label: "دائماً، بلا بطاقة ائتمان" },
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
  const [showSessions, setShowSessions] = useState<boolean>(() => {
    try {
      return localStorage.getItem("majormind.sessionsOpen") === "true";
    } catch {
      return false;
    }
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const sessionsGridRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef(false);
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();

  const toggleSessions = (next?: boolean) => {
    const val = next !== undefined ? next : !showSessions;
    setShowSessions(val);
    try {
      localStorage.setItem("majormind.sessionsOpen", String(val));
    } catch {}
  };

  useEffect(() => {
    if (showSessions && pendingScrollRef.current) {
      pendingScrollRef.current = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" });
        });
      });
    }
  }, [showSessions]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasBeenWelcomed() && !getStudentProfile()?.name) {
      setShowWelcome(true);
    } else if (!authLoading && isAuthenticated && !hasBeenWelcomed() && getStudentProfile()?.name) {
      markWelcomed();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    let active = true;

    async function loadSessions() {
      if (isAuthenticated) {
        const serverSessions = await loadSessionsFromServer();
        if (!active) return;
        await mergeServerSessions(serverSessions);
        await reconcileCompletedSessions();
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

  const hasProfile = !!getStudentProfile()?.name;

  const handleStart = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    if (!hasProfile) {
      setLocation("/profile");
    } else {
      const session = createSession();
      setLocation(`/interview/${session.id}`);
    }
  };

  const scrollToHow = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] bg-background" style={{ scrollBehavior: "smooth" }}>
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      <Navbar variant="landing" />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden"
      >
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
          <img
            src={logoUrl}
            alt="MajorMind"
            className="animate-float mx-auto h-28 w-auto object-contain drop-shadow-lg"
          />

          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[--accent]/40 bg-[--accent]/10 text-sm font-medium" style={{ color: "var(--accent-foreground)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
              </span>
              مستشار أكاديمي بالذكاء الاصطناعي لطلاب التوجيهي
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
              <span className="gradient-text">فكّر بذكاء</span>
              <br />
              <span className="text-foreground">في مستقبلك.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              يجري MajorMind محادثة حقيقية معك — عن نقاط قوتك واهتماماتك وطموحاتك — ثم يوصيك بالتخصص الجامعي الذي وُلدت له.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              onPress={handleStart}
              size="lg"
              className="btn-shimmer px-8 py-6 text-lg rounded-full group"
            >
              {hasProfile ? "ابدأ مقابلتك المجانية" : "أعدّ ملفك وابدأ"}
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-200" />
            </Button>
            {hasProfile && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setLocation("/profile")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <UserCircle className="w-4 h-4" />
                تعديل الملف الشخصي
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onPress={scrollToHow}
              className="px-8 py-6 text-lg rounded-full"
            >
              كيف يعمل؟
            </Button>
          </div>

          {!authLoading && !isAuthenticated && (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
              <button
                onClick={() => { window.location.href = "/api/login"; }}
                className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors"
              >
                سجّل الدخول لبدء مقابلتك
              </button>
            </p>
          )}

          {sessions.length > 0 && (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
              لديك {sessions.length} جلسة{sessions.length > 1 ? "" : ""} سابقة —{" "}
              <button
                onClick={() => {
                  if (!showSessions) {
                    pendingScrollRef.current = true;
                    toggleSessions(true);
                  } else {
                    document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                استئناف إحداها
              </button>
            </p>
          )}
        </div>

        <button
          onClick={scrollToHow}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
          aria-label="تمرير لأسفل"
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
          <h2 className="text-4xl md:text-5xl font-serif" style={{ color: "#71151a" }}>كيف يعمل؟</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            ثلاث خطوات بسيطة من "لا أعرف ماذا أدرس" إلى توجه واضح ومدعوم بالبيانات.
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
            <h2 className="text-4xl md:text-5xl font-serif" style={{ color: "#71151a" }}>لماذا MajorMind؟</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              مبني من الصفر لطلاب يواجهون أهم قرار في حياتهم الأكاديمية.
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
                مستقبلك يبدأ بمحادثة واحدة.
              </h2>
              <p className="text-xl font-light max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
                تستغرق أقل من ثلاث دقائق. بلا تكلفة، بلا ضغط.
              </p>
            </div>
            <div className="relative">
              <Button
                onPress={handleStart}
                size="lg"
                className="btn-shimmer px-10 py-6 text-lg rounded-full group"
              >
                ابدأ مقابلتك الآن
                <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Session Archive ── */}
      {sessions.length > 0 && (
        <section id="sessions" className="max-w-6xl mx-auto px-6 pb-24">
          <button
            onClick={() => toggleSessions()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            aria-expanded={showSessions}
          >
            <Archive className="w-3.5 h-3.5 opacity-60" />
            <span>أرشيف الجلسات</span>
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-[--surface-secondary] border border-[--border] leading-none">
              {sessions.length}
            </span>
            <ChevronDown
              className="w-3.5 h-3.5 opacity-60 transition-transform duration-300"
              style={{ transform: showSessions ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: showSessions ? `${sessionsGridRef.current?.scrollHeight ?? 9999}px` : "0px",
              opacity: showSessions ? 1 : 0,
            }}
          >
            <div ref={sessionsGridRef} className="grid sm:grid-cols-2 gap-4 pt-2">
              {sessions.map((session, i) => {
                const isComplete = !!session.recommendation;
                return (
                  <Link key={session.id} href={isComplete ? `/result/${session.id}` : `/interview/${session.id}`} className="block group">
                    <Card
                      className="hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      style={{ boxShadow: "var(--surface-shadow)" }}
                    >
                      <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {session.title || `مقابلة · ${new Date(session.createdAt).toLocaleDateString("ar-SA")}`}
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(session.updatedAt).toLocaleString("ar-SA")}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Chip
                            color={isComplete ? "success" : "default"}
                            variant="soft"
                            size="sm"
                          >
                            {isComplete ? "مكتملة" : "قيد التقدم"}
                          </Chip>
                          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-[--border]" style={{ background: "var(--surface-secondary)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="MajorMind" className="h-10 w-auto object-contain" />
            <div>
              <p className="font-serif text-sm font-semibold" style={{ color: "#71151a" }}>فكّر بذكاء في مستقبلك.</p>
              <p className="text-xs text-muted-foreground">نظام إرشاد أكاديمي بالذكاء الاصطناعي</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">مبني لطلاب التوجيهي الفلسطيني.</p>
            <Link href="/admin" className="text-xs text-muted-foreground opacity-30 hover:opacity-70 transition-opacity">لوحة الإدارة</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
