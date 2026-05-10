import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-destructive">404</h1>
          <h2 className="text-2xl font-serif text-foreground">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            يبدو أنك ابتعدت عن مسارك الأكاديمي. دعنا نعيدك إلى المقابلة.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 font-serif">
            العودة إلى الرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
