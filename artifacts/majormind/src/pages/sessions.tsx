import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, Chip } from "@heroui/react";
import { ArrowLeft, Archive, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getSessions, loadSessionsFromServer, mergeServerSessions, reconcileCompletedSessions, type StoredSession } from "@/lib/sessions";
import { useAuth } from "@workspace/replit-auth-web";
import logoUrl from "/logo.png";

export default function Sessions() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLocation("/"); return; }

    (async () => {
      try {
        const serverSessions = await loadSessionsFromServer();
        await mergeServerSessions(serverSessions);
        await reconcileCompletedSessions();
      } catch {}
      const all = Object.values(getSessions()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setSessions(all);
      setLoading(false);
    })();
  }, [isAuthenticated, authLoading]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar variant="app" />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20 space-y-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-muted-foreground mb-1">
            <Archive className="w-4 h-4" />
            <span className="text-sm">أرشيف الجلسات</span>
          </div>
          <h1 className="text-3xl font-serif" style={{ color: "#71151a" }}>جلساتي</h1>
          <p className="text-muted-foreground text-sm">جميع مقابلاتك السابقة في مكان واحد.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-[--surface-secondary] animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)" }}
            >
              <Clock className="w-8 h-8" style={{ color: "var(--accent-foreground)" }} />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">لا توجد جلسات بعد</p>
              <p className="text-sm text-muted-foreground">ابدأ أول مقابلة وستظهر هنا.</p>
            </div>
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              style={{ color: "#71151a" }}
            >
              <ArrowLeft className="w-4 h-4" />
              ابدأ من الصفحة الرئيسية
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => {
              const isComplete = !!session.recommendation;
              return (
                <Link
                  key={session.id}
                  href={isComplete ? `/result/${session.id}` : `/interview/${session.id}`}
                  className="block group"
                >
                  <Card
                    className="hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    style={{ boxShadow: "var(--surface-shadow)" }}
                  >
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {session.title || `مقابلة · ${new Date(session.createdAt).toLocaleDateString("ar-SA")}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.updatedAt).toLocaleString("ar-SA")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Chip color={isComplete ? "success" : "default"} variant="soft" size="sm">
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
        )}
      </div>
    </div>
  );
}
