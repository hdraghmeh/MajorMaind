import { useLocation } from "wouter";
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useAuth } from "@workspace/replit-auth-web";
import logoUrl from "/logo.png";
import { LogOut, User, Archive } from "lucide-react";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "app" }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  const isHome = location === "/";

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "حسابي"
    : null;

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
              الرئيسية
            </Button>
          )}

          {!isLoading && (
            isAuthenticated && user ? (
              <Dropdown>
                <DropdownTrigger>
                  <button className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-[--surface-secondary] transition-colors text-sm font-medium">
                    {user.profileImageUrl ? (
                      <Avatar
                        src={user.profileImageUrl}
                        size="sm"
                        className="w-7 h-7"
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "color-mix(in oklab, var(--accent) 20%, transparent)" }}
                      >
                        <User className="w-4 h-4" style={{ color: "var(--accent-foreground)" }} />
                      </div>
                    )}
                    <span className="hidden sm:block text-foreground max-w-[120px] truncate">{displayName}</span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="قائمة المستخدم">
                  <DropdownItem
                    key="sessions"
                    startContent={<Archive className="w-4 h-4" />}
                    onPress={() => setLocation("/sessions")}
                    className="text-foreground"
                  >
                    جلساتي
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    startContent={<LogOut className="w-4 h-4" />}
                    onPress={logout}
                    className="text-foreground"
                  >
                    تسجيل الخروج
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setLocation("/login")}
                className="rounded-full px-4 font-medium flex items-center gap-1.5"
              >
                تسجيل الدخول
              </Button>
            )
          )}

        </div>
      </div>
    </nav>
  );
}
