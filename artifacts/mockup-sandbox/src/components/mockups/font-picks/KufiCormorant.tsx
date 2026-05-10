export function KufiCormorant() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Noto Kufi Arabic', sans-serif",
        background: "#fbf8f3",
        minHeight: "100vh",
        color: "#2c2517",
      }}
    >
      {/* Nav */}
      <nav style={{ padding: "22px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#71151a", fontWeight: 600, letterSpacing: "0.5px" }}>
          MajorMind
        </span>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "#8c7f6e", fontWeight: 400 }}>
          <span>كيف يعمل؟</span>
          <span>التخصصات</span>
          <span>تواصل معنا</span>
        </div>
        <button style={{ background: "transparent", color: "#71151a", border: "1px solid #71151a60", borderRadius: 100, padding: "9px 22px", fontSize: 13, fontFamily: "'Noto Kufi Arabic', sans-serif", fontWeight: 400, cursor: "pointer" }}>
          سجّل الدخول
        </button>
      </nav>

      {/* Ornamental divider */}
      <div style={{ textAlign: "center", margin: "0 0 8px", color: "#84e4a8", fontSize: 20, letterSpacing: "8px" }}>
        ❧ ✦ ❧
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 40px 56px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, letterSpacing: "4px", color: "#b09c80", marginBottom: 24, fontWeight: 400 }}>
          المستشار الأكاديمي الذكي
        </p>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 72, lineHeight: 1.12, color: "#71151a", margin: "0 0 20px", fontWeight: 600 }}>
          فكّر بذكاء
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 300, fontSize: 66 }}>في مستقبلك</span>
        </h1>

        <div style={{ width: 60, height: 2, background: "#84e4a8", margin: "0 auto 28px" }} />

        <p style={{ fontSize: 14, lineHeight: 2.1, color: "#8c7f6e", maxWidth: 480, margin: "0 auto 44px", fontWeight: 400 }}>
          مقابلة ذكاء اصطناعي تحلّل شخصيتك ومعدلك وتطلعاتك، لتوصيك بأنسب تخصص جامعي لمسيرتك.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button style={{ background: "#71151a", color: "#fbf8f3", border: "none", borderRadius: 100, padding: "15px 36px", fontSize: 14, fontFamily: "'Noto Kufi Arabic', sans-serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px" }}>
            ابدأ مقابلتك الآن
          </button>
          <button style={{ background: "transparent", color: "#8c7f6e", border: "1px solid #c8bfb0", borderRadius: 100, padding: "14px 28px", fontSize: 13, fontFamily: "'Noto Kufi Arabic', sans-serif", fontWeight: 400, cursor: "pointer" }}>
            اعرف المزيد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", borderTop: "1px solid #e4ddd2", borderBottom: "1px solid #e4ddd2" }}>
        {[
          { value: "+2000", label: "طالب استفاد" },
          { value: "96%", label: "دقة التوصية" },
          { value: "45", label: "تخصصاً متاحاً" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "28px 0", textAlign: "center", borderRight: i < 2 ? "1px solid #e4ddd2" : "none" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, color: "#71151a", fontWeight: 600, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#b09c80", marginTop: 8, fontWeight: 400, letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "#bbb", letterSpacing: 1 }}>
        BODY: Noto Kufi Arabic · HEADINGS: Cormorant Garamond
      </div>
    </div>
  );
}
