import { useLocation } from "wouter";
import { Button } from "@heroui/react";
import { UserCircle, MessageSquare, Award, ArrowLeft, X } from "lucide-react";

const ONBOARDING_KEY = "majormind.welcomed.v1";

export function hasBeenWelcomed(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

export function markWelcomed(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
}

const STEPS = [
  {
    icon: UserCircle,
    number: "١",
    title: "أكمل ملفك الشخصي",
    desc: "أخبرنا عن نفسك — مسارك الدراسي، مواضيعك المفضلة، وطموحاتك.",
  },
  {
    icon: MessageSquare,
    number: "٢",
    title: "ابدأ المقابلة",
    desc: "تحدّث مع مستشارنا الذكي في محادثة طبيعية تستغرق أقل من ثلاث دقائق.",
  },
  {
    icon: Award,
    number: "٣",
    title: "احصل على توصيتك",
    desc: "تلقّ توصية شخصية بالتخصص الأنسب لك مع أسباب تفصيلية وخارطة طريق مهنية.",
  },
];

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [, setLocation] = useLocation();

  const handleStart = () => {
    markWelcomed();
    onClose();
    setLocation("/profile");
  };

  const handleDismiss = () => {
    markWelcomed();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div
          className="relative px-8 pt-10 pb-8 text-center"
          style={{ background: "linear-gradient(160deg, #71151a 0%, #5a1015 100%)" }}
        >
          <button
            onClick={handleDismiss}
            className="absolute top-4 left-4 text-white/50 hover:text-white/90 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.12]"
              style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 70%)" }}
            />
          </div>

          <div className="relative space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-1"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
            >
              مرحباً بك في MajorMind 🎓
            </div>
            <h2 className="text-2xl font-serif text-white leading-snug">
              ثلاث خطوات إلى تخصصك المثالي
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
              نحن هنا لنساعدك في اتخاذ أهم قرار أكاديمي في حياتك.
            </p>
          </div>
        </div>

        <div className="px-8 py-6 space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in oklab, #71151a 12%, transparent)", border: "1px solid color-mix(in oklab, #71151a 20%, transparent)" }}
              >
                <step.icon className="w-5 h-5" style={{ color: "#71151a" }} />
              </div>
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "color-mix(in oklab, #71151a 12%, transparent)", color: "#71151a" }}
                  >
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 pb-8 flex flex-col gap-2">
          <Button
            onPress={handleStart}
            size="lg"
            className="btn-shimmer w-full py-5 text-base rounded-2xl group"
          >
            ابدأ الآن — أكمل ملفك الشخصي
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          </Button>
          <button
            onClick={handleDismiss}
            className="text-xs text-center py-2 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            تصفّح أولاً، سأكمل لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}
