import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@heroui/react";
import { getStudentProfile, saveStudentProfile, EMPTY_PROFILE, type StudentProfile, type TawjihiStream, type LearningStyle, type PersonalityType } from "@/lib/studentProfile";
import { createSession, getSession, saveSession } from "@/lib/sessions";
import logoUrl from "/logo.png";
import { ChevronRight, ChevronLeft, Check, User, BookOpen, Brain, Target } from "lucide-react";

const GREEN = "#84e4a8";
const RED = "#71151a";

const STREAMS: { value: TawjihiStream; label: string; labelAr: string }[] = [
  { value: "scientific", label: "scientific", labelAr: "علمي" },
  { value: "literary", label: "literary", labelAr: "أدبي" },
  { value: "commercial", label: "commercial", labelAr: "تجاري" },
  { value: "industrial", label: "industrial", labelAr: "صناعي" },
  { value: "other", label: "other", labelAr: "آخر" },
];

const SUBJECTS = [
  "الرياضيات", "الفيزياء", "الكيمياء", "الأحياء",
  "اللغة العربية", "اللغة الإنجليزية", "التاريخ", "الجغرافيا",
  "الحاسوب والمعلوماتية", "التربية الإسلامية", "الفنون", "الاقتصاد",
];

const CAREER_OPTIONS = [
  "التقنية والبرمجة", "الطب والرعاية الصحية", "الهندسة",
  "الأعمال والإدارة", "القانون", "التعليم والتدريس",
  "الفنون والتصميم", "الإعلام والتواصل", "العلوم والبحث",
  "الهندسة المعمارية", "المالية والمحاسبة", "علم النفس والعمل الاجتماعي",
];

const HOBBIES_OPTIONS = [
  "البرمجة والتقنية", "القراءة والكتابة", "الرياضة واللياقة",
  "الرسم والفنون", "الموسيقى", "الألعاب الإلكترونية",
  "التصوير والفيديو", "الطبخ", "العمل التطوعي",
  "الخطابة والنقاش", "الرياضيات والألغاز", "متابعة الأخبار والسياسة",
  "السفر والاستكشاف", "تصميم الجرافيك", "الروبوتيكس",
];

const ASPIRATIONS_OPTIONS = [
  "أبني مشروعاً خاصاً بي",
  "أعمل في شركة أو مؤسسة كبرى",
  "أخدم مجتمعي وبلدي",
  "أطور الرعاية الطبية والصحية",
  "أبني حلولاً تقنية تغير الواقع",
  "أصبح باحثاً أو أكاديمياً",
  "أعمل في القطاع الحكومي أو العام",
  "أنتج محتوى إبداعياً أو فنياً",
  "أعمل على المستوى الدولي",
  "أحقق الاستقلال المالي والنجاح الشخصي",
];

const CONCERNS_OPTIONS = [
  "لا أعرف أي تخصص يناسبني",
  "قلق من سوق العمل وفرص التوظيف",
  "خائف من صعوبة الدراسة الجامعية",
  "أريد أن أوازن بين شغفي وقدراتي",
  "قلق من التكاليف المادية للجامعة",
  "ضغط من توقعات الأهل والعائلة",
  "قلق من الابتعاد عن المنزل",
  "لست متأكداً من نقاط قوتي الأكاديمية",
  "المنافسة الشديدة في التخصصات المطلوبة",
  "المستقبل غير واضح ولا أعرف من أين أبدأ",
];

const LEARNING_STYLES: { value: LearningStyle; label: string; desc: string }[] = [
  { value: "practical", label: "تطبيقي", desc: "أتعلم بالتطبيق والتجربة" },
  { value: "visual", label: "بصري", desc: "أتعلم بالصور والمخططات" },
  { value: "reading", label: "قراءة وكتابة", desc: "أتعلم بالقراءة والكتابة" },
  { value: "discussion", label: "نقاش وحوار", desc: "أتعلم بالنقاش والحوار" },
];

const PERSONALITIES: { value: PersonalityType; label: string; desc: string }[] = [
  { value: "analytical", label: "تحليلي", desc: "أحب التحليل والمنطق والأرقام" },
  { value: "creative", label: "إبداعي", desc: "أحب الإبداع والأفكار الجديدة" },
  { value: "balanced", label: "متوازن", desc: "بين الاثنين" },
];

const STEPS = [
  { id: "personal", label: "المعلومات الشخصية", icon: User },
  { id: "academic", label: "المسيرة الأكاديمية", icon: BookOpen },
  { id: "personality", label: "الشخصية وأسلوب التعلم", icon: Brain },
  { id: "interests", label: "الاهتمامات والتطلعات", icon: Target },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>{children}</p>;
}

function SelectDropdown({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-3 rounded-xl border border-[--border] text-sm outline-none transition-all pr-10"
        style={{
          background: "var(--surface)",
          color: value ? "var(--foreground)" : "var(--muted-foreground)",
        }}
      >
        <option value="" disabled>{placeholder ?? "اختر..."}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-[--border] text-sm outline-none transition-all focus:ring-2"
      style={{ background: "var(--surface)", color: "var(--foreground)", focusRingColor: GREEN }}
    />
  );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border"
      style={{
        background: selected ? `color-mix(in oklab, ${GREEN} 20%, var(--surface))` : "var(--surface)",
        border: selected ? `1.5px solid ${GREEN}` : "1.5px solid var(--border)",
        color: selected ? "#1a5c3a" : "var(--foreground)",
      }}
    >
      {label}
    </button>
  );
}

function Card({ selected, onClick, label, desc }: { selected: boolean; onClick: () => void; label: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 space-y-0.5"
      style={{
        background: selected ? `color-mix(in oklab, ${GREEN} 14%, var(--surface))` : "var(--surface)",
        border: selected ? `1.5px solid ${GREEN}` : "1.5px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {selected && <Check className="w-4 h-4" style={{ color: "#2a8f60" }} />}
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

const DRAFT_SESSION_KEY = "majormind.profile-draft-session-id";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>(() => getStudentProfile() ?? { ...EMPTY_PROFILE });

  // Create or reuse a draft session for this profile form (lazy init, stable across renders)
  const [draftSessionId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem(DRAFT_SESSION_KEY);
      if (existing && getSession(existing)) return existing;
      const s = createSession();
      localStorage.setItem(DRAFT_SESSION_KEY, s.id);
      return s.id;
    } catch {
      return crypto.randomUUID();
    }
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const persistProfileToSession = (p: StudentProfile) => {
    const existing = getSession(draftSessionId);
    if (!existing) return;
    saveSession({ ...existing, profileData: p as unknown as Record<string, unknown> });
  };

  const set = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleArray = (key: "favoriteSubjects" | "leastFavoriteSubjects" | "careerInterests" | "hobbies", val: string) => {
    setProfile((p) => {
      const arr = p[key] as string[];
      return { ...p, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const handleNext = () => {
    saveStudentProfile(profile);
    persistProfileToSession(profile);
    setStep(step + 1);
  };

  const handleStart = () => {
    saveStudentProfile(profile);
    persistProfileToSession(profile);
    // Clear draft session so next profile visit creates a fresh one
    localStorage.removeItem(DRAFT_SESSION_KEY);
    setLocation(`/interview/${draftSessionId}`);
  };

  const canNext = () => {
    if (step === 0) return profile.name.trim().length > 0;
    if (step === 1) return profile.tawjihiStream !== "";
    if (step === 2) return profile.learningStyle !== "" && profile.personality !== "";
    return true;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="px-5 py-3 flex items-center gap-3"
        style={{ background: "var(--surface)" }}>
        <button onClick={() => setLocation("/")} className="hover:opacity-70 transition-opacity">
          <img src={logoUrl} alt="MajorMind" className="h-8 w-auto object-contain" />
        </button>
        <div className="h-5 w-px" style={{ background: "var(--border)" }} />
        <span className="text-sm font-medium text-muted-foreground">ملفك الشخصي</span>
      </header>

      {/* Progress bar */}
      <div className="flex" style={{ background: "var(--surface-secondary)" }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <button
              key={s.id}
              onClick={() => i < step && setStep(i)}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs relative overflow-hidden group"
              style={{
                color: active ? RED : done ? "#2a8f60" : "var(--muted-foreground)",
                transition: "color 0.25s ease, transform 0.12s ease",
                cursor: done ? "pointer" : "default",
              }}
              onMouseDown={(e) => { if (done) (e.currentTarget as HTMLElement).style.transform = "scale(0.93)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              {/* hover background */}
              {done && (
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "color-mix(in oklab, #2a8f60 10%, transparent)" }} />
              )}
              {active && (
                <span className="absolute inset-0 rounded-lg"
                  style={{ background: `color-mix(in oklab, ${RED} 6%, transparent)` }} />
              )}

              <Icon
                key={`icon-${s.id}-${step}`}
                className={`w-4 h-4 relative z-10 ${active ? "tab-icon-active" : done ? "tab-icon-done" : ""}`}
              />
              <span className="hidden sm:block font-medium relative z-10">{s.label}</span>

              {/* animated bottom border */}
              <span
                key={`bar-${s.id}-${step}`}
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${active ? "tab-bar-active" : ""}`}
                style={{
                  background: active ? RED : done ? GREEN : "transparent",
                  opacity: active || done ? 1 : 0,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 py-8 space-y-6">

          {/* Step 0 — Personal info */}
          {step === 0 && (
            <div className="space-y-5" style={{ animation: "fade-slide-up 0.35s ease forwards" }}>
              <div>
                <h2 className="text-2xl font-serif mb-1" style={{ color: RED }}>أهلاً بك</h2>
                <p className="text-sm text-muted-foreground">أخبرنا قليلاً عن نفسك لنخصّص تجربتك</p>
              </div>

              <div>
                <FieldLabel>اسمك الكريم *</FieldLabel>
                <TextInput value={profile.name} onChange={(v) => set("name", v)} placeholder="مثال: أحمد محمد" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>العمر</FieldLabel>
                  <TextInput value={profile.age} onChange={(v) => set("age", v)} placeholder="مثال: 18" />
                </div>
                <div>
                  <FieldLabel>المدينة</FieldLabel>
                  <TextInput value={profile.city} onChange={(v) => set("city", v)} placeholder="مثال: رام الله" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Academic */}
          {step === 1 && (
            <div className="space-y-6" style={{ animation: "fade-slide-up 0.35s ease forwards" }}>
              <div>
                <h2 className="text-2xl font-serif mb-1" style={{ color: RED }}>مسيرتك الأكاديمية</h2>
                <p className="text-sm text-muted-foreground">هذه المعلومات تساعد المستشار على فهم نقاط قوتك</p>
              </div>

              <div>
                <FieldLabel>فرع التوجيهي *</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {STREAMS.map((s) => (
                    <Chip key={s.value} label={s.labelAr}
                      selected={profile.tawjihiStream === s.value}
                      onClick={() => set("tawjihiStream", s.value)} />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>معدلك التراكمي (إن عرفته)</FieldLabel>
                <TextInput value={profile.tawjihiAverage} onChange={(v) => set("tawjihiAverage", v)} placeholder="مثال: 88.5" />
              </div>

              <div>
                <FieldLabel>موادك المفضّلة (اختر ما تريد)</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <Chip key={s} label={s}
                      selected={profile.favoriteSubjects.includes(s)}
                      onClick={() => toggleArray("favoriteSubjects", s)} />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>المواد الأقل تفضيلاً</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.filter((s) => !profile.favoriteSubjects.includes(s)).map((s) => (
                    <Chip key={s} label={s}
                      selected={profile.leastFavoriteSubjects.includes(s)}
                      onClick={() => toggleArray("leastFavoriteSubjects", s)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Personality */}
          {step === 2 && (
            <div className="space-y-6" style={{ animation: "fade-slide-up 0.35s ease forwards" }}>
              <div>
                <h2 className="text-2xl font-serif mb-1" style={{ color: RED }}>شخصيتك وأسلوبك</h2>
                <p className="text-sm text-muted-foreground">لا إجابة صحيحة أو خاطئة — كن صادقاً مع نفسك</p>
              </div>

              <div>
                <FieldLabel>كيف تتعلم أفضل؟ *</FieldLabel>
                <div className="space-y-2">
                  {LEARNING_STYLES.map((l) => (
                    <Card key={l.value} label={l.label} desc={l.desc}
                      selected={profile.learningStyle === l.value}
                      onClick={() => set("learningStyle", l.value)} />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>شخصيتك الأقرب؟ *</FieldLabel>
                <div className="space-y-2">
                  {PERSONALITIES.map((p) => (
                    <Card key={p.value} label={p.label} desc={p.desc}
                      selected={profile.personality === p.value}
                      onClick={() => set("personality", p.value)} />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>تفضّل العمل</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {([["alone", "منفرداً"], ["team", "ضمن فريق"], ["both", "كلاهما"]] as const).map(([v, l]) => (
                    <Chip key={v} label={l} selected={profile.workPreference === v} onClick={() => set("workPreference", v)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Interests */}
          {step === 3 && (
            <div className="space-y-6" style={{ animation: "fade-slide-up 0.35s ease forwards" }}>
              <div>
                <h2 className="text-2xl font-serif mb-1" style={{ color: RED }}>اهتماماتك وتطلعاتك</h2>
                <p className="text-sm text-muted-foreground">أخبرنا عن أحلامك ومخاوفك — هذا أهم جزء</p>
              </div>

              <div>
                <FieldLabel>المجالات التي تستهويك (اختر ما تريد)</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {CAREER_OPTIONS.map((c) => (
                    <Chip key={c} label={c}
                      selected={profile.careerInterests.includes(c)}
                      onClick={() => toggleArray("careerInterests", c)} />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>هواياتك واهتماماتك (اختر ما ينطبق عليك)</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {HOBBIES_OPTIONS.map((h) => (
                    <Chip key={h} label={h}
                      selected={(profile.hobbies ?? []).includes(h)}
                      onClick={() => toggleArray("hobbies", h)} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>ما الذي تحلم بتحقيقه؟</FieldLabel>
                <SelectDropdown
                  value={profile.aspirations}
                  onChange={(v) => set("aspirations", v)}
                  options={ASPIRATIONS_OPTIONS}
                  placeholder="اختر ما يعبّر عن طموحك..."
                />
                <input
                  value={profile.aspirationsCustom ?? ""}
                  onChange={(e) => set("aspirationsCustom", e.target.value)}
                  placeholder="أو أضف طموحاً آخر بكلماتك الخاصة..."
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] text-sm outline-none transition-all"
                  style={{ background: "var(--surface)", color: "var(--foreground)" }}
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>أكبر مخاوفك حول مستقبلك الدراسي</FieldLabel>
                <SelectDropdown
                  value={profile.concerns}
                  onChange={(v) => set("concerns", v)}
                  options={CONCERNS_OPTIONS}
                  placeholder="اختر ما يعبّر عن مخاوفك..."
                />
                <input
                  value={profile.concernsCustom ?? ""}
                  onChange={(e) => set("concernsCustom", e.target.value)}
                  placeholder="أو أضف ما يقلقك بكلماتك الخاصة..."
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] text-sm outline-none transition-all"
                  style={{ background: "var(--surface)", color: "var(--foreground)" }}
                  dir="rtl"
                />
              </div>

              {/* Summary card before starting */}
              <div className="rounded-2xl border border-[--border] p-5 space-y-2"
                style={{ background: `color-mix(in oklab, ${GREEN} 7%, var(--surface))` }}>
                <p className="text-sm font-semibold" style={{ color: "#1a5c3a" }}>ملخص ملفك</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {profile.name && <p>الاسم: <span className="text-foreground font-medium">{profile.name}</span></p>}
                  {profile.tawjihiStream && <p>الفرع: <span className="text-foreground font-medium">{STREAMS.find(s => s.value === profile.tawjihiStream)?.labelAr}</span></p>}
                  {profile.favoriteSubjects.length > 0 && <p>المواد المفضلة: <span className="text-foreground font-medium">{profile.favoriteSubjects.slice(0, 3).join("، ")}{profile.favoriteSubjects.length > 3 ? "..." : ""}</span></p>}
                  {profile.careerInterests.length > 0 && <p>الاهتمامات: <span className="text-foreground font-medium">{profile.careerInterests.slice(0, 2).join("، ")}{profile.careerInterests.length > 2 ? "..." : ""}</span></p>}
                  {(profile.hobbies ?? []).length > 0 && <p>الهوايات: <span className="text-foreground font-medium">{profile.hobbies.slice(0, 2).join("، ")}{profile.hobbies.length > 2 ? "..." : ""}</span></p>}
                  {(profile.aspirations || profile.aspirationsCustom) && (
                    <p>الطموح: <span className="text-foreground font-medium">
                      {[profile.aspirations, profile.aspirationsCustom].filter(Boolean).join(" — ")}
                    </span></p>
                  )}
                  {(profile.concerns || profile.concernsCustom) && (
                    <p>المخاوف: <span className="text-foreground font-medium">
                      {[profile.concerns, profile.concernsCustom].filter(Boolean).join(" — ")}
                    </span></p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer navigation */}
      <footer className="px-5 py-4"
        style={{ background: "var(--surface)" }}>
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => step === 0 ? setLocation("/") : setStep(step - 1)}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? "رجوع" : "السابق"}
          </Button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i === step ? RED : i < step ? GREEN : "var(--border)" }} />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <Button
              size="sm"
              isDisabled={!canNext()}
              onPress={handleNext}
              className="flex items-center gap-1.5"
              style={{ background: canNext() ? RED : undefined, color: canNext() ? "white" : undefined }}
            >
              التالي
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onPress={handleStart}
              className="flex items-center gap-1.5 px-5"
              style={{ background: RED, color: "white" }}
            >
              ابدأ المقابلة
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
