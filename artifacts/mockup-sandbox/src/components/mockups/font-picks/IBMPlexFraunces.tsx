export function IBMPlexFraunces() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'IBM Plex Arabic', sans-serif",
        background: "#0f0e0d",
        minHeight: "100vh",
        color: "#f0ebe3",
      }}
    >
      {/* Nav */}
      <nav style={{ padding: "22px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ffffff0f" }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#84e4a8", fontWeight: 600, fontStyle: "italic" }}>
          MajorMind
        </span>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "#a8a29e", fontWeight: 300, letterSpacing: "0.5px" }}>
          <span>كيف يعمل؟</span>
          <span>التخصصات</span>
          <span>تواصل معنا</span>
        </div>
        <button style={{ background: "transparent", color: "#84e4a8", border: "1px solid #84e4a840", borderRadius: 6, padding: "9px 22px", fontSize: 13, fontFamily: "'IBM Plex Arabic', sans-serif", fontWeight: 400, cursor: "pointer", letterSpacing: "0.5px" }}>
          سجّل الدخول
        </button>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "88px 40px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 4, background: "#84e4a815", border: "1px solid #84e4a830", fontSize: 11, color: "#84e4a8", letterSpacing: "2px", fontWeight: 500, marginBottom: 36, textTransform: "uppercase" }}>
          ذكاء اصطناعي · توجيهي فلسطين
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 68, lineHeight: 1.1, color: "#f0ebe3", margin: "0 0 28px", fontWeight: 300, letterSpacing: "-1px" }}>
          فكّر بذكاء
          <br />
          <span style={{ color: "#84e4a8", fontStyle: "italic", fontWeight: 500 }}>في مستقبلك</span>
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#a8a29e", maxWidth: 500, margin: "0 auto 48px", fontWeight: 300, letterSpacing: "0.2px" }}>
          مقابلة ذكاء اصطناعي تحلّل شخصيتك ومعدلك وتطلعاتك، لتوصيك بأنسب تخصص جامعي لمسيرتك.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button style={{ background: "#84e4a8", color: "#0a1f12", border: "none", borderRadius: 6, padding: "14px 32px", fontSize: 15, fontFamily: "'IBM Plex Arabic', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.3px" }}>
            ابدأ مقابلتك الآن
          </button>
          <button style={{ background: "transparent", color: "#f0ebe3", border: "1px solid #ffffff20", borderRadius: 6, padding: "14px 24px", fontSize: 14, fontFamily: "'IBM Plex Arabic', sans-serif", fontWeight: 300, cursor: "pointer" }}>
            اعرف المزيد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: 0, border: "1px solid #ffffff10", borderRadius: 12 }}>
        {[
          { value: "+2000", label: "طالب استفاد" },
          { value: "96%", label: "دقة التوصية" },
          { value: "45", label: "تخصصاً متاحاً" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "28px 0", textAlign: "center", borderRight: i < 2 ? "1px solid #ffffff10" : "none" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 38, color: "#84e4a8", fontWeight: 300, fontStyle: "italic" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6b6663", marginTop: 6, fontWeight: 300, letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "#444", letterSpacing: 1 }}>
        BODY: IBM Plex Arabic · HEADINGS: Fraunces
      </div>
    </div>
  );
}
