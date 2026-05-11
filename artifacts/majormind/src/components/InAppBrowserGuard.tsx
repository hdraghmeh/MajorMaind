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

function Step({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#333" }}>
      <span style={{
        background: "#71151a", color: "#fff",
        borderRadius: "50%", width: 24, height: 24, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 800,
      }}>{n}</span>
      <span style={{ textAlign: "right", flex: 1 }}>{children}</span>
    </div>
  );
}

function Dots() {
  return (
    <strong style={{
      background: "#e8e8e8", padding: "1px 8px",
      borderRadius: "6px", fontFamily: "monospace", fontSize: "15px",
    }}>···</strong>
  );
}

export default function InAppBrowserGuard({ children }: { children: React.ReactNode }) {
  const { isInApp, isIOS, isInstagram, isFacebook } = detectEnv();
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

  const appName = isInstagram ? "Instagram" : isFacebook ? "Facebook" : null;

  // ── iOS ──────────────────────────────────────────────────────────────
  if (isIOS) {
    const menuLocation = isInstagram ? "أعلى يمين الشاشة" : isFacebook ? "أسفل يمين الشاشة" : null;
    const menuLabel    = isInstagram ? "فتح في المتصفح الخارجي" : isFacebook ? "فتح في Safari" : null;

    return (
      <>
        <style>{sharedStyles}</style>
        <div dir="rtl" style={pageStyle}>
          <div style={{ ...cardStyle, padding: "28px 20px 24px" }}>
            <h1 style={{ fontSize: "19px", color: "#71151a", marginBottom: "4px", fontWeight: 800 }}>
              لا يمكن فتح الموقع هنا
            </h1>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px", lineHeight: "1.6" }}>
              {appName ? `متصفح ${appName} المدمج لا يدعم تسجيل الدخول` : "المتصفح المدمج لا يدعم تسجيل الدخول"}
            </p>

            {/* الطريقة الأسهل: قائمة ··· */}
            {menuLocation && menuLabel && (
              <div style={{
                background: "#f0fdf4", border: "2px solid #84e4a8",
                borderRadius: "14px", padding: "16px 14px", marginBottom: "16px", textAlign: "right",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#1a5c3a", marginBottom: "10px" }}>
                  الطريقة الأسهل — ضغطة واحدة
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Step n="١">اضغط <Dots /> من {menuLocation}</Step>
                  <Step n="٢">اختر <strong>"{menuLabel}"</strong></Step>
                </div>
              </div>
            )}

            {/* فاصل */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
              <span style={{ fontSize: "12px", color: "#aaa" }}>أو</span>
              <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
            </div>

            {/* QR */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>
                صوّر الـ QR بكاميرا هاتفك — يفتح في Safari تلقائياً
              </div>
              {qrDataUrl ? (
                <div className="qr-box qr-ring" style={{
                  display: "inline-block", borderRadius: "14px",
                  border: "3px solid #84e4a8", padding: "5px", background: "#fff",
                }}>
                  <img src={qrDataUrl} alt="QR code" width={160} height={160}
                    style={{ display: "block", borderRadius: "9px" }} />
                </div>
              ) : (
                <div style={{
                  width: 160, height: 160, margin: "0 auto", borderRadius: "14px",
                  background: "#f0f0ea", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "12px", color: "#bbb",
                }}>
                  جارٍ التحميل...
                </div>
              )}
            </div>

            {/* رابط قابل للنسخ */}
            <div style={{
              background: "#f8f8f6", borderRadius: "10px", padding: "10px 12px",
              fontSize: "11px", color: "#888", wordBreak: "break-all", direction: "ltr",
              textAlign: "left", userSelect: "all",
            }}>
              {currentUrl}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Android ──────────────────────────────────────────────────────────
  const steps = isFacebook
    ? [
        { n: "١", el: <><Dots /> من الزاوية العلوية</> },
        { n: "٢", el: <>اختر <strong>"فتح في Chrome"</strong> أو <strong>"فتح في المتصفح"</strong></> },
      ]
    : isInstagram
    ? [
        { n: "١", el: <><Dots /> من أعلى الشاشة</> },
        { n: "٢", el: <>اختر <strong>"فتح في المتصفح الخارجي"</strong></> },
      ]
    : [
        { n: "١", el: <>انسخ الرابط من شريط العنوان أعلاه</> },
        { n: "٢", el: <>افتح <strong>Chrome</strong> أو أي متصفح</> },
        { n: "٣", el: <>الصق الرابط وافتح الموقع</> },
      ];

  return (
    <>
      <style>{sharedStyles}</style>
      <div dir="rtl" style={pageStyle}>
        <div style={{ ...cardStyle, padding: "30px 20px 26px" }}>
          <h1 style={{ fontSize: "19px", color: "#71151a", marginBottom: "4px", fontWeight: 800 }}>
            افتح الموقع في متصفحك
          </h1>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px", lineHeight: "1.6" }}>
            {appName
              ? `لا يمكن تسجيل الدخول من داخل تطبيق ${appName}`
              : "لا يمكن تسجيل الدخول من داخل تطبيقات التواصل الاجتماعي"}
          </p>

          <div style={{
            background: "#f0fdf4", border: "2px solid #84e4a8",
            borderRadius: "14px", padding: "16px 14px", marginBottom: "20px", textAlign: "right",
          }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#1a5c3a", marginBottom: "12px" }}>
              كيف تفتحه؟
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {steps.map((s) => (
                <Step key={s.n} n={s.n}>{s.el}</Step>
              ))}
            </div>
          </div>

          {/* رابط قابل للنسخ */}
          <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px" }}>
            أو انسخ الرابط يدوياً:
          </div>
          <div style={{
            background: "#f8f8f6", borderRadius: "10px", padding: "10px 12px",
            fontSize: "11px", color: "#888", wordBreak: "break-all", direction: "ltr",
            textAlign: "left", userSelect: "all",
          }}>
            {currentUrl}
          </div>
        </div>
      </div>
    </>
  );
}
