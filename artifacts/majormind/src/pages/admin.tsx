import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button, Input } from "@heroui/react";
import {
  Users, Award, MessageSquare,
  ChevronRight, ArrowLeft, Search,
  RefreshCw, ShieldAlert, Mail, User, Hash
} from "lucide-react";
import logoUrl from "/logo.png";

interface StudentRecord {
  recordId: string;
  savedAt: string;
  _filename: string;
  user: {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  totalMessages: number;
  studentAnswers: Array<{ question: string; answer: string }>;
  recommendation: {
    recommendedMajor: string;
    matchScore: number;
    whyItFits: string[];
    alternativeMajors: string[];
    academicStrengths: string[];
    careerAdvice: string[];
    closingMessage: string;
  };
  fullConversation: Array<{ role: string; content: string }>;
}

const GREEN = "#84e4a8";
const RED = "#71151a";

function scoreColor(score: number) {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#ca8a04";
  return "#dc2626";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-SA", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function studentName(rec: StudentRecord) {
  if (!rec.user) return "زائر";
  const name = [rec.user.firstName, rec.user.lastName].filter(Boolean).join(" ");
  return name || rec.user.email || "مستخدم مسجّل";
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/interviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        sessionStorage.setItem("mm_admin_token", token);
        onLogin(token);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `color-mix(in oklab, ${RED} 12%, transparent)` }}
          >
            <ShieldAlert className="w-7 h-7" style={{ color: RED }} />
          </div>
          <div>
            <h1 className="text-2xl font-serif" style={{ color: RED }}>
              لوحة الإدارة
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              أدخل كلمة السر للوصول للبيانات
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[--border] p-7 space-y-4"
          style={{ background: "var(--surface)", boxShadow: "var(--surface-shadow)" }}
        >
          <Input
            type="password"
            value={token}
            onChange={(e) => { setToken(e.target.value); setError(false); }}
            placeholder="رمز المدير"
            className="w-full"
          />
          {error && (
            <p className="text-sm text-center font-medium" style={{ color: "#dc2626" }}>
              كلمة السر غير صحيحة
            </p>
          )}
          <Button
            type="submit"
            isDisabled={!token.trim() || loading}
            className="w-full"
            style={{ background: RED, color: "white" }}
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ record, onClose }: { record: StudentRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="mr-auto h-full w-full max-w-2xl flex flex-col"
        style={{ background: "var(--background)", boxShadow: "4px 0 30px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[--border]"
          style={{ background: "var(--surface)" }}>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[--surface-secondary] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg truncate" style={{ color: RED }}>
              {record.recommendation.recommendedMajor}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(record.savedAt)}</p>
          </div>
          <div className="shrink-0 text-left">
            <span className="text-2xl font-bold" style={{ color: scoreColor(record.recommendation.matchScore) }}>
              {record.recommendation.matchScore}%
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          {/* Student info */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">معلومات الطالب</h2>
            <div className="rounded-xl border border-[--border] divide-y divide-[--border]"
              style={{ background: "var(--surface)" }}>
              <Row icon={User} label="الاسم" value={studentName(record)} />
              <Row icon={Mail} label="البريد" value={record.user?.email ?? "زائر"} />
              <Row icon={Hash} label="رقم السجل" value={record.recordId} mono />
            </div>
          </section>

          {/* Recommendation */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">التوصية</h2>
            <div className="rounded-xl border border-[--border] p-5 space-y-4"
              style={{ background: "var(--surface)" }}>
              <div>
                <p className="text-xs text-muted-foreground mb-1">لماذا يناسبه</p>
                <ul className="space-y-1.5">
                  {record.recommendation.whyItFits.map((r, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span style={{ color: GREEN }}>•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">التخصصات البديلة</p>
                <div className="flex flex-wrap gap-2">
                  {record.recommendation.alternativeMajors.map((m, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-[--border]"
                      style={{ background: "var(--surface-secondary)" }}>{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">نقاط القوة</p>
                <ul className="space-y-1.5">
                  {record.recommendation.academicStrengths.map((s, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span style={{ color: RED }}>•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-[--border]">
                <p className="text-xs italic text-muted-foreground leading-relaxed">
                  {record.recommendation.closingMessage}
                </p>
              </div>
            </div>
          </section>

          {/* Q&A */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              أسئلة وأجوبة ({record.studentAnswers.length})
            </h2>
            <div className="space-y-3">
              {record.studentAnswers.map((qa, i) => (
                <div key={i} className="rounded-xl border border-[--border] overflow-hidden"
                  style={{ background: "var(--surface)" }}>
                  <div className="px-4 py-3 border-b border-[--border]"
                    style={{ background: `color-mix(in oklab, ${GREEN} 8%, var(--surface))` }}>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">سؤال {i + 1}</p>
                    <p className="text-sm leading-relaxed">{qa.question}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">الإجابة</p>
                    <p className="text-sm leading-relaxed">{qa.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono = false }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <span className={`text-sm truncate ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</span>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
function Dashboard({ token }: { token: string }) {
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<StudentRecord | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/interviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data.interviews ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const name = studentName(r).toLowerCase();
    const email = (r.user?.email ?? "").toLowerCase();
    const major = r.recommendation.recommendedMajor.toLowerCase();
    return name.includes(q) || email.includes(q) || major.includes(q);
  });

  const totalStudents = records.length;
  const avgScore = records.length
    ? Math.round(records.reduce((s, r) => s + r.recommendation.matchScore, 0) / records.length)
    : 0;
  const guests = records.filter((r) => !r.user).length;

  return (
    <div className="min-h-[100dvh]" style={{ background: "var(--background)" }}>

      {/* Top nav */}
      <header className="border-b border-[--border] sticky top-0 z-40"
        style={{ background: "color-mix(in oklab, var(--background) 90%, transparent)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/")} className="hover:opacity-70 transition-opacity">
              <img src={logoUrl} alt="MajorMind" className="h-8 w-auto object-contain" />
            </button>
            <div className="h-5 w-px" style={{ background: "var(--border)" }} />
            <span className="text-sm font-semibold" style={{ color: RED }}>لوحة الإدارة</span>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-[--surface-secondary] transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: "إجمالي المقابلات", value: totalStudents },
            { icon: Award, label: "متوسط التوافق", value: `${avgScore}%` },
            { icon: MessageSquare, label: "زوار (بدون تسجيل)", value: guests },
          ].map((stat) => (
            <div key={stat.label}
              className="rounded-2xl border border-[--border] px-5 py-5 flex items-center gap-4"
              style={{ background: "var(--surface)", boxShadow: "var(--surface-shadow)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in oklab, ${GREEN} 14%, transparent)` }}>
                <stat.icon className="w-5 h-5" style={{ color: "#2a8f60" }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: RED }}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد أو التخصص..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[--border] text-sm outline-none focus:ring-2 transition-all"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[--border] overflow-hidden"
          style={{ background: "var(--surface)", boxShadow: "var(--surface-shadow)" }}>

          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_80px_80px_44px] gap-4 px-5 py-3 border-b border-[--border]"
            style={{ background: "var(--surface-secondary)" }}>
            {["الطالب", "التخصص الموصى به", "التوافق", "الأسئلة", ""].map((h) => (
              <span key={h} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                جاري التحميل...
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {records.length === 0 ? "لا توجد مقابلات مكتملة بعد." : "لا نتائج تطابق البحث."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[--border]">
              {filtered.map((rec) => (
                <div
                  key={rec.recordId}
                  className="grid grid-cols-[1fr_1fr_80px_80px_44px] gap-4 px-5 py-4 items-center hover:bg-[--surface-secondary] transition-colors cursor-pointer"
                  onClick={() => setSelected(rec)}
                >
                  {/* Student */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{studentName(rec)}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {rec.user?.email ?? "زائر"} · {formatDate(rec.savedAt)}
                    </p>
                  </div>

                  {/* Major */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{rec.recommendation.recommendedMajor}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {rec.recommendation.alternativeMajors.slice(0, 2).join("، ")}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <span className="text-lg font-bold" style={{ color: scoreColor(rec.recommendation.matchScore) }}>
                      {rec.recommendation.matchScore}%
                    </span>
                  </div>

                  {/* Q count */}
                  <div className="text-center">
                    <span className="text-sm font-medium">{rec.studentAnswers.length}</span>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {filtered.length} من {totalStudents} مقابلة
        </p>
      </main>

      {selected && (
        <DetailPanel record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// ── Entry ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("mm_admin_token"),
  );

  if (!token) return <LoginScreen onLogin={setToken} />;
  return <Dashboard token={token} />;
}
