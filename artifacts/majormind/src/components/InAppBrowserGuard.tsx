import { useState } from "react";

function detectEnv(): { isInApp: boolean; isIOS: boolean; isFacebook: boolean } {
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isFacebook = /FBAN|FBAV|FB_IAB/i.test(ua);
  const isInApp =
    isFacebook ||
    /Instagram/i.test(ua) ||
    /WhatsApp/i.test(ua) ||
    /Messenger/i.test(ua) ||
    (/\bwv\b/.test(ua) && /Android/i.test(ua));
  return { isInApp, isIOS, isFacebook };
}

export default function InAppBrowserGuard({ children }: { children: React.ReactNode }) {
  const { isInApp, isIOS } = detectEnv();
  const [copied, setCopied] = useState(false);

  if (!isInApp) return <>{children}</>;

  const currentUrl = window.location.href;

  function handleOpen() {
    if (isIOS) {
      // x-safari-https:// opens Safari directly on iOS from in-app browsers
      window.location.href = currentUrl.replace(/^https?:\/\//, "x-safari-https://");
    } else {
      // Android: intent scheme opens Chrome
      const encoded = encodeURIComponent(currentUrl);
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encoded};end`;
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      // fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = currentUrl;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#f5f5f0",
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
          borderRadius: "20px",
          padding: "40px 28px 32px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          textAlign: "center",
        }}
      >
        {/* Globe icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #84e4a8 0%, #3db87f 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 34,
        }}>
          🌐
        </div>

        <h1 style={{ fontSize: "22px", color: "#71151a", marginBottom: "10px", fontWeight: 700 }}>
          افتح التطبيق في متصفحك
        </h1>
        <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.8", marginBottom: "24px" }}>
          لا يمكن تسجيل الدخول من داخل تطبيقات التواصل الاجتماعي.
          <br />
          افتح الرابط في Safari أو Chrome لتجربة كاملة.
        </p>

        {/* URL display box */}
        <div style={{
          background: "#f8f8f6",
          border: "1px solid #e0e0da",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          textAlign: "right",
          direction: "ltr",
          wordBreak: "break-all",
          fontSize: "12px",
          color: "#444",
          userSelect: "all",
        }}>
          {currentUrl}
        </div>

        {/* Primary button — open in browser */}
        <button
          onClick={handleOpen}
          style={{
            display: "block",
            width: "100%",
            background: "#71151a",
            color: "#fff",
            border: "none",
            padding: "14px 0",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "10px",
            fontFamily: "inherit",
          }}
        >
          فتح في {isIOS ? "Safari" : "Chrome"}
        </button>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            display: "block",
            width: "100%",
            background: copied ? "#84e4a8" : "#f0f0ea",
            color: copied ? "#1a5c3a" : "#444",
            border: "none",
            padding: "13px 0",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.25s, color 0.25s",
            fontFamily: "inherit",
          }}
        >
          {copied ? "تم النسخ!" : "نسخ الرابط"}
        </button>

        <p style={{ fontSize: "12px", color: "#aaa", marginTop: "16px" }}>
          {isIOS
            ? "بعد فتح Safari، الصق الرابط في شريط العنوان"
            : "افتح Chrome ثم الصق الرابط في شريط العنوان"}
        </p>
      </div>
    </div>
  );
}
