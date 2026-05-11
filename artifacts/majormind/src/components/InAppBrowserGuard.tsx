import { useState, useEffect } from "react";

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
  const [pulse, setPulse] = useState(false);

  // Pulse the copy button after 1.5s to draw attention
  useEffect(() => {
    if (!isInApp) return;
    const t = setTimeout(() => setPulse(true), 1500);
    return () => clearTimeout(t);
  }, [isInApp]);

  if (!isInApp) return <>{children}</>;

  const currentUrl = window.location.href;

  const openHref = isIOS
    ? currentUrl.replace(/^https:\/\//, "x-safari-https://")
    : `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;

  // Step 2 instruction — platform specific
  const step2 =
    isInstagram ? 'اضغط ··· أعلى الشاشة ← "فتح في المتصفح"'
    : isFacebook ? 'اضغط ··· أو السهم ← "فتح في Safari"'
    : `افتح ${isIOS ? "Safari" : "Chrome"} والصق الرابط`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = currentUrl;
      el.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(el);
      el.focus(); el.select();
      try { document.execCommand("copy"); } catch {/* */}
      document.body.removeChild(el);
    }
    setCopied(true);
    setPulse(false);
    setTimeout(() => setCopied(false), 4000);
  }

  const btnBg = copied ? "#84e4a8" : "#71151a";
  const btnColor = copied ? "#1a5c3a" : "#fff";

  return (
    <>
      <style>{`
        @keyframes btn-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(113,21,26,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(113,21,26,0); }
        }
        .copy-btn-pulse { animation: btn-pulse 1.1s ease-in-out 3; }
        @keyframes step-in {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .step-card { animation: step-in 0.4s ease forwards; }
        .step-card:nth-child(2) { animation-delay: 0.1s; opacity:0; }
        .step-card:nth-child(3) { animation-delay: 0.2s; opacity:0; }
      `}</style>

      <div dir="rtl" style={{
        fontFamily: "'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#f5f5f0", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      }}>
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "32px 22px 26px",
          maxWidth: "380px", width: "100%",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)", textAlign: "center",
        }}>

          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg,#84e4a8,#3db87f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontSize: 30,
          }}>🌐</div>

          <h1 style={{ fontSize: "20px", color: "#71151a", marginBottom: "4px", fontWeight: 700 }}>
            افتح التطبيق في متصفحك
          </h1>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "22px" }}>
            اتبع الخطوات أدناه للدخول بشكل صحيح
          </p>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px", textAlign: "right" }}>

            {/* Step 1 */}
            <div className="step-card" style={{
              display: "flex", alignItems: "center", gap: "14px",
              background: copied ? "#f0fff6" : "#fff8f0",
              border: `1.5px solid ${copied ? "#84e4a8" : "#ffe0b2"}`,
              borderRadius: "12px", padding: "12px 14px",
              transition: "background 0.3s, border-color 0.3s",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: copied ? "#84e4a8" : "#71151a",
                color: copied ? "#1a5c3a" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 800,
                transition: "background 0.3s",
              }}>
                {copied ? "✓" : "1"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#333", marginBottom: "2px" }}>
                  انسخ رابط الموقع
                </div>
                <div style={{
                  fontSize: "11px", color: "#888", direction: "ltr",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {currentUrl}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-card" style={{
              display: "flex", alignItems: "center", gap: "14px",
              background: "#f8f8f6", border: "1.5px solid #ebebeb",
              borderRadius: "12px", padding: "12px 14px",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "#5d5a52", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 800,
              }}>2</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#444", lineHeight: "1.5" }}>
                {step2}
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-card" style={{
              display: "flex", alignItems: "center", gap: "14px",
              background: "#f8f8f6", border: "1.5px solid #ebebeb",
              borderRadius: "12px", padding: "12px 14px",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "#5d5a52", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 800,
              }}>3</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>
                {isIOS ? "في Safari: اضغط مطولاً ← لصق وانتقال" : "في Chrome: الصق الرابط في شريط العنوان"}
              </div>
            </div>
          </div>

          {/* Copy button — main CTA */}
          <button
            onClick={handleCopy}
            className={pulse && !copied ? "copy-btn-pulse" : ""}
            style={{
              display: "block", width: "100%",
              background: btnBg, color: btnColor,
              border: "none", padding: "15px 0",
              borderRadius: "13px", fontSize: "17px", fontWeight: 800,
              cursor: "pointer", marginBottom: "10px",
              fontFamily: "inherit",
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {copied ? "✓ تم نسخ الرابط — اتبع الخطوة 2" : "① نسخ الرابط"}
          </button>

          {/* Fallback open link */}
          <a
            href={openHref}
            style={{
              display: "block", width: "100%",
              background: "#f0f0ea", color: "#777",
              textDecoration: "none", padding: "11px 0",
              borderRadius: "12px", fontSize: "13px", fontWeight: 600,
              boxSizing: "border-box",
            }}
          >
            تجربة الفتح التلقائي
          </a>
        </div>
      </div>
    </>
  );
}
