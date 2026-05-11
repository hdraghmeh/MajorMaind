import { useState } from "react";

function detectEnv() {
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isFacebook = /FBAN|FBAV|FB_IAB/i.test(ua);
  const isWhatsApp = /WhatsApp/i.test(ua);
  const isMessenger = /Messenger/i.test(ua);
  const isAndroidWebView = /\bwv\b/.test(ua) && /Android/i.test(ua);
  const isInApp = isInstagram || isFacebook || isWhatsApp || isMessenger || isAndroidWebView;
  return { isInApp, isIOS, isInstagram, isFacebook };
}

export default function InAppBrowserGuard({ children }: { children: React.ReactNode }) {
  const { isInApp, isIOS, isInstagram, isFacebook } = detectEnv();
  const [copied, setCopied] = useState(false);

  if (!isInApp) return <>{children}</>;

  const currentUrl = window.location.href;

  // Build platform-specific open URL
  const openHref = isIOS
    ? currentUrl.replace(/^https:\/\//, "x-safari-https://").replace(/^http:\/\//, "x-safari-http://")
    : `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = currentUrl;
      el.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  // Platform-specific instructions
  const hint = isInstagram
    ? "اضغط على (···) أعلى الشاشة ثم اختر «فتح في المتصفح»"
    : isFacebook
    ? "اضغط على (···) أو السهم أعلى اليمين ثم «فتح في Safari»"
    : "انسخ الرابط ثم افتحه في متصفح Safari أو Chrome";

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#f5f5f0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "36px 24px 28px",
        maxWidth: "390px",
        width: "100%",
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
        textAlign: "center",
      }}>
        {/* Icon */}
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg,#84e4a8,#3db87f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px", fontSize: 32,
        }}>🌐</div>

        <h1 style={{ fontSize: "21px", color: "#71151a", marginBottom: "8px", fontWeight: 700 }}>
          افتح التطبيق في متصفحك
        </h1>
        <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.8", marginBottom: "20px" }}>
          لا يمكن تسجيل الدخول من داخل تطبيقات التواصل الاجتماعي.
        </p>

        {/* Tip box */}
        <div style={{
          background: "#fff8e1",
          border: "1px solid #ffe082",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "20px",
          textAlign: "right",
          fontSize: "13px",
          color: "#5d4037",
          lineHeight: "1.7",
        }}>
          <strong>الحل السريع:</strong><br />{hint}
        </div>

        {/* URL box — selectable */}
        <div
          onClick={handleCopy}
          style={{
            background: "#f8f8f6",
            border: `1.5px solid ${copied ? "#84e4a8" : "#e0e0da"}`,
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "14px",
            textAlign: "left",
            direction: "ltr",
            wordBreak: "break-all",
            fontSize: "11px",
            color: "#555",
            cursor: "pointer",
            transition: "border-color 0.25s",
            userSelect: "all",
          }}
        >
          {currentUrl}
        </div>

        {/* Copy button — most reliable */}
        <button
          onClick={handleCopy}
          style={{
            display: "block",
            width: "100%",
            background: copied ? "#84e4a8" : "#71151a",
            color: copied ? "#1a5c3a" : "#fff",
            border: "none",
            padding: "15px 0",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "10px",
            fontFamily: "inherit",
            transition: "background 0.25s, color 0.25s",
          }}
        >
          {copied ? "✓ تم نسخ الرابط!" : "نسخ الرابط"}
        </button>

        {/* Try open link — secondary */}
        <a
          href={openHref}
          style={{
            display: "block",
            width: "100%",
            background: "#f0f0ea",
            color: "#444",
            textDecoration: "none",
            padding: "13px 0",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            boxSizing: "border-box",
          }}
        >
          تجربة الفتح المباشر
        </a>

        <p style={{ fontSize: "11px", color: "#bbb", marginTop: "14px", lineHeight: "1.6" }}>
          {isIOS
            ? "بعد النسخ: افتح Safari ثم اضغط مطولاً على شريط العنوان ← لصق وانتقال"
            : "بعد النسخ: افتح Chrome ثم الصق الرابط في شريط العنوان"}
        </p>
      </div>
    </div>
  );
}
