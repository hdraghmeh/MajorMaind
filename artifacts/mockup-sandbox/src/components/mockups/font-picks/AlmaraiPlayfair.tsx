export function AlmaraiPlayfair() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Almarai', sans-serif",
        background: "#fff",
        minHeight: "100vh",
        color: "#1a1816",
      }}
    >
      {/* Nav */}
      <nav style={{ padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, color: "#71151a", fontWeight: 700 }}>
          MajorMind
        </span>
        <div style={{ display: "flex", gap: 30, fontSize: 14, color: "#5d5a52" }}>
          <span>كيف يعمل؟</span>
          <span>التخصصات</span>
          <span>تواصل معنا</span>
        </div>
        <button style={{ background: "#84e4a8", color: "#1a5c3a", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontFamily: "'Almarai', sans-serif", fontWeight: 700, cursor: "pointer" }}>
          سجّل الدخول
        </button>
      </nav>

      {/* Decorative line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #84e4a8, #71151a)", margin: "0 44px" }} />

      {/* Hero */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "72px 40px 56px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, letterSpacing: "3px", color: "#84e4a8", fontStyle: "italic", marginBottom: 20, fontWeight: 400 }}>
          — المستشار الأكاديمي الذكي —
        </p>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, lineHeight: 1.15, color: "#1a1816", margin: "0 0 20px", fontWeight: 900 }}>
          فكّر بذكاء
          <span style={{ color: "#71151a", display: "block" }}>في مستقبلك</span>
        </h1>

        <p style={{ fontSize: 16, lineHeight: 2, color: "#5d5a52", maxWidth: 500, margin: "0 auto 44px", fontWeight: 300, letterSpacing: "0.1px" }}>
          مقابلة ذكاء اصطناعي تحلّل شخصيتك ومعدلك وتطلعاتك، لتوصيك بأنسب تخصص جامعي لمسيرتك.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button style={{ background: "#71151a", color: "white", border: "none", borderRadius: 8, padding: "15px 36px", fontSize: 16, fontFamily: "'Almarai', sans-serif", fontWeight: 700, cursor: "pointer" }}>
            ابدأ مقابلتك الآن
          </button>
          <button style={{ background: "white", color: "#71151a", border: "2px solid #71151a", borderRadius: 8, padding: "14px 28px", fontSize: 15, fontFamily: "'Almarai', sans-serif", fontWeight: 400, cursor: "pointer" }}>
            اعرف المزيد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#71151a", margin: "0 44px", borderRadius: 16, padding: "32px 0", display: "flex" }}>
        {[
          { value: "+2000", label: "طالب استفاد" },
          { value: "96%", label: "دقة التوصية" },
          { value: "45", label: "تخصصاً متاحاً" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: "#84e4a8", fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "#bbb", letterSpacing: 1 }}>
        BODY: Almarai · HEADINGS: Playfair Display
      </div>
    </div>
  );
}
