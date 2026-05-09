import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { getSession, createSession, type StoredSession } from "@/lib/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Result() {
  const [, params] = useRoute("/result/:sessionId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    if (!params?.sessionId) return;
    const s = getSession(params.sessionId);
    if (!s) {
      setLocation("/");
      return;
    }
    if (!s.recommendation) {
      setLocation(`/interview/${s.id}`);
      return;
    }
    setSession(s);
  }, [params?.sessionId, setLocation]);

  if (!session || !session.recommendation) return null;

  const { recommendation } = session;

  const handleNewInterview = () => {
    const newSess = createSession();
    setLocation(`/interview/${newSess.id}`);
  };

  const handleCopy = () => {
    const text = `
Recommended Major: ${recommendation.recommendedMajor}
Match Score: ${recommendation.matchScore}%

Why it fits:
${recommendation.whyItFits.map((r) => `- ${r}`).join('\n')}

Alternative Majors:
${recommendation.alternativeMajors.map((m) => `- ${m}`).join('\n')}

Academic Strengths:
${recommendation.academicStrengths.map((s) => `- ${s}`).join('\n')}

Career Advice:
${recommendation.careerAdvice.map((c) => `- ${c}`).join('\n')}

Advisor's Note:
${recommendation.closingMessage}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleDownload = () => {
    const json = JSON.stringify(session, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `majormind-${recommendation.recommendedMajor.replace(/\s+/g, '-').toLowerCase()}-${session.id.substring(0,8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[100dvh] bg-background selection:bg-primary/30">
      <header className="p-4 md:p-6 max-w-4xl mx-auto flex items-center justify-between">
        <Button variant="ghost" onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24 space-y-12">
        <div className="text-center space-y-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium border border-primary/20">
            {recommendation.matchScore}% Match
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-destructive tracking-tight">
            {recommendation.recommendedMajor}
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-serif text-foreground">Why this fits you</h2>
              <ul className="space-y-4">
                {recommendation.whyItFits.map((reason, i) => (
                  <li key={i} className="flex items-start gap-4 text-muted-foreground text-lg leading-relaxed">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span style={{ direction: /[\u0600-\u06FF]/.test(reason) ? "rtl" : "ltr" }}>{reason.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-2xl font-serif text-foreground">Academic Strengths</h2>
              <ul className="space-y-4">
                {recommendation.academicStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-4 text-muted-foreground text-lg leading-relaxed">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span style={{ direction: /[\u0600-\u06FF]/.test(str) ? "rtl" : "ltr" }}>{str.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <Separator />

            <section className="space-y-4">
              <h2 className="text-2xl font-serif text-foreground">Career Trajectory</h2>
              <ul className="space-y-4">
                {recommendation.careerAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-4 text-muted-foreground text-lg leading-relaxed">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span style={{ direction: /[\u0600-\u06FF]/.test(advice) ? "rtl" : "ltr" }}>{advice.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-8">
            <Card className="bg-accent/50 border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-lg text-foreground">Alternative Paths</h3>
                <ul className="space-y-3">
                  {recommendation.alternativeMajors.map((major, i) => (
                    <li key={i} className="text-muted-foreground border-l-2 border-primary/30 pl-3 py-1">
                      <span style={{ direction: /[\u0600-\u06FF]/.test(major) ? "rtl" : "ltr" }}>{major.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
              <h3 className="font-serif text-lg text-primary-foreground">Advisor's Note</h3>
              <p className="text-muted-foreground leading-relaxed italic" style={{ direction: /[\u0600-\u06FF]/.test(recommendation.closingMessage) ? "rtl" : "ltr" }}>
                "{recommendation.closingMessage.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}"
              </p>
            </div>
            
            <Button onClick={handleNewInterview} className="w-full py-6 text-base rounded-xl" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start new interview
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
