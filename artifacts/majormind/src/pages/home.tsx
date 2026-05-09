import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getSessions, createSession, type StoredSession } from "@/lib/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [, setLocation] = useLocation();
  const [sessions, setSessions] = useState<StoredSession[]>([]);

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

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full space-y-12">
        <div className="space-y-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-4">
            AI Academic Advisor
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-destructive">
            MajorMind AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            A thoughtful conversation about your future. We'll explore your strengths, interests, and style to find the university major that fits you perfectly.
          </p>
          <Button onClick={handleStart} size="lg" className="px-8 py-6 text-lg rounded-full font-serif">
            Start your interview
          </Button>
        </div>

        {sessions.length > 0 && (
          <div className="space-y-6 pt-12">
            <h2 className="text-2xl font-serif text-foreground/80">Recent Sessions</h2>
            <div className="grid gap-4">
              {sessions.map((session) => {
                const isComplete = !!session.recommendation;
                return (
                  <Link
                    key={session.id}
                    href={isComplete ? `/result/${session.id}` : `/interview/${session.id}`}
                    className="block"
                  >
                    <Card className="hover:bg-accent/50 transition-colors border-border/50">
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg text-foreground font-sans">
                              {session.title || `Interview · ${new Date(session.createdAt).toLocaleDateString()}`}
                            </CardTitle>
                            <CardDescription>
                              {new Date(session.updatedAt).toLocaleString()}
                            </CardDescription>
                          </div>
                          <Badge variant={isComplete ? "default" : "secondary"}>
                            {isComplete ? "Complete" : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
