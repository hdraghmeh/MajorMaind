import { useState, useEffect } from "react";
import QRCode from "qrcode";

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

const sharedStyles = `
  @keyframes qr-appear {
    from { opacity:0; transform:scale(0.88); }
    to   { opacity:1; transform:scale(1); }
  }
  .qr-box { animation: qr-appear 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(132,228,168,0.6); }
    70%  { box-shadow: 0 0 0 14px rgba(132,228,168,0); }
    100% { box-shadow: 0 0 0 0 rgba(132,228,168,0); }
  }
  .qr-ring { animation: pulse-ring 2s ease-out infinite; }
  @keyframes btn-pop {
    0%,100% { transform:scale(1); }
    50% { transform:scale(0.96); }
  }
  .android-btn:active { animation: btn-pop 0.15s ease; }
`;

const pageStyle: React.CSSProperties = {
  fontFamily: "'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif",
  background: "#f5f5f0",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "22px",
  maxWidth: "370px",
  width: "100%",
  boxShadow: "0 6px 40px rgba(0,0,0,0.10)",
  textAlign: "center",
};

export default function InAppBrowserGuard({ children }: { children: React.ReactNode }) {
  const { isInApp, isIOS, isInstagram, isFacebook } = detectEnv();
  const [copied, setCopied] = useState(false);
  const [androidOpened, setAndroidOpened] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!isInApp || !isIOS || !currentUrl) return;
    QRCode.toDataURL(currentUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#71151a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [isInApp, isIOS, currentUrl]);

  if (!isInApp) return <>{children}</>;

  const androidIntent = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;

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
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  }

  function handleAndroidOpen() {
    window.location.href = androidIntent;
    setAndroidOpened(true);
  }

  const menuHint = isInstagram
    ? 'اضغط ··· أعلى الشاشة ← "فتح في المتصفح"'
    : isFacebook
    ? 'اضغط ··· في الزاوية ← "فتح في Safari"'
    : null;

  if (isIOS) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div dir="rtl" style={pageStyle}>
          <div style={{ ...cardStyle, padding: "30px 22px 26px" }}>
            <h1 style={{ fontSize: "20px", color: "#71151a", marginBottom: "4px", fontWeight: 700 }}>
              افتح الموقع في Safari
            </h1>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px", lineHeight: "1.6" }}>
              صوّر الـ QR بكاميرا هاتفك ← يفتح في Safari مباشرةً
            </p>

            {qrDataUrl ? (
              <div
                className="qr-box qr-ring"
                style={{
                  display: "inline-block",
                  borderRadius: "16px",
                  border: "3px solid #84e4a8",
                  padding: "6px",
                  marginBottom: "18px",
                  background: "#fff",
                }}
              >
                <img
                  src={qrDataUrl}
                  alt="QR code"
                  width={188}
                  height={188}
                  style={{ display: "block", borderRadius: "10px" }}
                />
              </div>
            ) : (
              <div style={{
                width: 200, height: 200, margin: "0 auto 18px",
                borderRadius: "16px", background: "#f0f0ea",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", color: "#aaa",
              }}>
                جارٍ التحميل...
              </div>
            )}

            <div style={{
              fontSize: "13px", color: "#555", lineHeight: "1.7",
              background: "#f0fdf4", borderRadius: "10px",
              padding: "10px 14px", marginBottom: "14px", textAlign: "right",
            }}>
              افتح تطبيق الكاميرا ← وجّهه للـ QR ← اضغط الرابط الذي يظهر
            </div>

            {menuHint && (
              <div style={{
                background: "#fff8e1", border: "1px solid #ffe082",
                borderRadius: "10px", padding: "10px 14px", marginBottom: "14px",
                fontSize: "12px", color: "#5d4037", textAlign: "right",
              }}>
                أو أسرع: {menuHint}
              </div>
            )}

            <button
              onClick={handleCopy}
              style={{
                display: "block", width: "100%",
                background: copied ? "#84e4a8" : "#f0f0ea",
                color: copied ? "#1a5c3a" : "#666",
                border: "none", padding: "13px 0",
                borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.25s, color 0.25s",
              }}
            >
              {copied ? "✓ تم نسخ الرابط" : "نسخ الرابط يدوياً"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{sharedStyles}</style>
      <div dir="rtl" style={pageStyle}>
        <div style={{ ...cardStyle, padding: "32px 22px 26px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg,#84e4a8,#3db87f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 30,
          }}>
            🌐
          </div>

          <h1 style={{ fontSize: "20px", color: "#71151a", marginBottom: "6px", fontWeight: 700 }}>
            افتح في المتصفح
          </h1>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
            اضغط الزر أدناه لفتح الموقع في Chrome
          </p>

          <button
            className="android-btn"
            onClick={handleAndroidOpen}
            style={{
              display: "block", width: "100%",
              background: androidOpened ? "#84e4a8" : "#71151a",
              color: androidOpened ? "#1a5c3a" : "#fff",
              border: "none", padding: "16px 0",
              borderRadius: "14px", fontSize: "17px", fontWeight: 800,
              cursor: "pointer", marginBottom: "12px", fontFamily: "inherit",
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {androidOpened ? "✓ جارٍ الفتح..." : "فتح في Chrome"}
          </button>

          {androidOpened && (
            <p style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>
              لم يفتح؟ انسخ الرابط وافتح Chrome يدوياً
            </p>
          )}

          <button
            onClick={handleCopy}
            style={{
              display: "block", width: "100%",
              background: copied ? "#84e4a8" : "#f0f0ea",
              color: copied ? "#1a5c3a" : "#666",
              border: "none", padding: "13px 0",
              borderRadius: "12px", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.25s, color 0.25s",
            }}
          >
            {copied ? "✓ تم نسخ الرابط" : "نسخ الرابط"}
          </button>
        </div>
      </div>
    </>
  );
}
