import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import logoUrl from "/logo.png";

export default function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, setLocation] = useLocation();

  // Already signed in — go home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="animate-orb-drift absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #84e4a8 0%, transparent 68%)" }}
        />
      </div>

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={logoUrl}
            alt="MajorMind"
            className="animate-float h-20 w-auto object-contain drop-shadow-lg"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-serif" style={{ color: "#71151a" }}>
              Sign in to MajorMind
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Save your interviews and access them from any device.
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-[--border] p-8 space-y-5"
          style={{ background: "var(--surface)", boxShadow: "var(--surface-shadow)" }}
        >
          {/* Google sign-in button */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            style={{
              background: "#fff",
              border: "1.5px solid #dadce0",
              color: "#3c4043",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            {/* Official Google "G" logo */}
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Email sign-in (same OIDC, different framing) */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-80 active:scale-[0.98]"
            style={{
              background: "color-mix(in oklab, #84e4a8 14%, var(--surface))",
              border: "1.5px solid color-mix(in oklab, #84e4a8 30%, transparent)",
              color: "var(--foreground)",
            }}
          >
            Continue with email
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground leading-relaxed px-4">
          Your interviews are always saved locally without signing in.
          <br />
          Sign in only to sync across devices.
        </p>

        {/* Back link */}
        <div className="text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
