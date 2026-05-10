export function TajawalDMSerif() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Tajawal', sans-serif",
        background: "#fafaf8",
        minHeight: "100vh",
        color: "#1a1816",
      }}
    >
      {/* Nav */}
      <nav style={{ padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e8e4dc" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#71151a", letterSpacing: "-0.3px" }}>
          MajorMind AI
        </span>
        <div style={{ display: "flex", gap: 28, fontSize: 15, fontWeight: 400, color: "#5d5a52" }}>
          <span>كيف يعمل؟</span>
          <span>التخصصات</span>
          <span>تواصل معنا</span>
        </div>
        <button style={{ background: "#71151a", color: "white", border: "none", borderRadius: 100, padding: "9px 22px", fontSize: 14, fontFamily: "'Tajawal', sans-serif", fontWeight: 500, cursor: "pointer" }}>
          سجّل الدخول
        </button>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 40px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 100, border: "1px solid #84e4a8", background: "#84e4a820", color: "#1a5c3a", fontSize: 13, fontWeight: 500, marginBottom: 32 }}>
          مخصص لطلاب التوجيهي الفلسطيني
        </div>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 62, lineHeight: 1.18, color: "#71151a", margin: "0 0 24px", fontWeight: 400, letterSpacing: "-0.5px" }}>
          فكّر بذكاء
          <br />
          <em style={{ fontStyle: "italic" }}>في مستقبلك</em>
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.85, color: "#5d5a52", maxWidth: 520, margin: "0 auto 40px", fontWeight: 300 }}>
          مقابلة ذكاء اصطناعي تحلّل شخصيتك ومعدلك وتطلعاتك، لتوصي بأنسب تخصص في جامعة الأمة العربية الأمريكية.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ background: "#71151a", color: "white", border: "none", borderRadius: 100, padding: "14px 32px", fontSize: 16, fontFamily: "'Tajawal', sans-serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.2px" }}>
            ابدأ مقابلتك الآن
          </button>
          <button style={{ background: "transparent", color: "#5d5a52", border: "1.5px solid #d4cfc7", borderRadius: 100, padding: "14px 28px", fontSize: 15, fontFamily: "'Tajawal', sans-serif", fontWeight: 400, cursor: "pointer" }}>
            اعرف المزيد
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", gap: 0, borderTop: "1px solid #e8e4dc", borderBottom: "1px solid #e8e4dc" }}>
        {[
          { value: "+2000", label: "طالب استفاد" },
          { value: "96%", label: "دقة التوصية" },
          { value: "45", label: "تخصصاً متاحاً" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "28px 0", textAlign: "center", borderRight: i < 2 ? "1px solid #e8e4dc" : "none" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#71151a", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#5d5a52", marginTop: 6, fontWeight: 400 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Font label */}
      <div style={{ textAlign: "center", padding: "28px", fontSize: 12, color: "#aaa", letterSpacing: 1 }}>
        BODY: Tajawal · HEADINGS: DM Serif Display
      </div>
    </div>
  );
}
