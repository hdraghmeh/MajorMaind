import { useLocation } from "wouter";
import { Button } from "@heroui/react";
import { createSession } from "@/lib/sessions";
import logoUrl from "/logo.png";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "app" }: NavbarProps) {
  const [location, setLocation] = useLocation();

  const handleStart = () => {
    const session = createSession();
    setLocation(`/interview/${session.id}`);
  };

  const isHome = location === "/";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[--border]"
      style={{
        background: "color-mix(in oklab, var(--background) 85%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logoUrl} alt="MajorMind" className="h-10 w-auto object-contain" />
        </button>

        <div className="flex items-center gap-2">
          {!isHome && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setLocation("/")}
              className="text-[--muted] hover:text-[--foreground]"
            >
              Home
            </Button>
          )}
          {variant === "landing" && (
            <Button
              variant="primary"
              size="sm"
              onPress={handleStart}
              className="rounded-full px-5 font-medium"
            >
              Start Free Interview
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
