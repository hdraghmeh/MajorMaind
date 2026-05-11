function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || "";
  return (
    /FBAN|FBAV|FB_IAB/i.test(ua) ||
    /Instagram/i.test(ua) ||
    /WhatsApp/i.test(ua) ||
    /Messenger/i.test(ua) ||
    /\bwv\b/.test(ua) && /Android/i.test(ua)
  );
}

export default function InAppBrowserGuard({ children }: { children: React.ReactNode }) {
  if (!isInAppBrowser()) return <>{children}</>;

  const currentUrl = window.location.href;

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "36px 28px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>🌐</div>
        <h1
          style={{
            fontSize: "22px",
            color: "#1a1a2e",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          افتح التطبيق في متصفحك
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            lineHeight: "1.7",
            marginBottom: "20px",
          }}
        >
          لا يمكن تسجيل الدخول من داخل واتساب أو تطبيقات التواصل الاجتماعي.
          يرجى فتح الرابط في متصفح Safari أو Chrome لتجربة أفضل.
        </p>
        <div
          style={{
            background: "#f0f4ff",
            borderRadius: "12px",
            padding: "16px 20px",
            textAlign: "right",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
            📋 <strong>انسخ الرابط من الأعلى</strong>
          </p>
          <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
            🌐 <strong>افتح Safari أو Chrome</strong>
          </p>
          <p style={{ fontSize: "14px", color: "#333" }}>
            🔗 <strong>الصق الرابط وافتح التطبيق</strong>
          </p>
        </div>
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#4f46e5",
            color: "#fff",
            textDecoration: "none",
            padding: "13px 28px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          فتح في المتصفح
        </a>
      </div>
    </div>
  );
}
