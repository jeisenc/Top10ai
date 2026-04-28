"use client";

import { useState, useEffect } from "react";

export default function ArticleLayout({ meta, children }) {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(100, pct));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        .article-body { font-size: clamp(15px, 3.5vw, 17px); color: #2a2a2a; line-height: 1.85; }
        .article-body p { margin-bottom: 22px; }
        .article-body h2 { font-size: clamp(20px, 5vw, 26px); font-weight: 800; color: #1a1a1a; margin: 40px 0 14px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-body h3 { font-size: clamp(16px, 4vw, 20px); font-weight: 700; color: #1a1a1a; margin: 28px 0 10px; letter-spacing: -0.3px; }
        .article-body blockquote { border-left: 3px solid #c0392b; margin: 28px 0; padding: 16px 20px; background: #fff8f6; border-radius: 0 10px 10px 0; }
        .article-body blockquote p { font-size: clamp(16px, 4vw, 19px); font-weight: 600; color: #1a1a1a; font-style: italic; margin: 0; line-height: 1.5; }
        .article-body ul, .article-body ol { padding-left: 22px; margin-bottom: 22px; }
        .article-body li { margin-bottom: 8px; }
        .article-body a { color: #c0392b; text-decoration: underline; text-underline-offset: 3px; }
        .article-body a:hover { opacity: 0.8; }
        .article-body strong { font-weight: 700; color: #1a1a1a; }
        .article-body .callout { background: #fff; border: 1.5px solid #d4d0cb; border-radius: 14px; padding: 20px 22px; margin: 28px 0; }
        .article-body .callout-title { font-size: 13px; font-weight: 700; color: #c0392b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }

        .footer-link { font-size: 13px; color: #595959; text-decoration: none; }
        .footer-link:hover { color: #c0392b; }

        .progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: #c0392b; z-index: 999; transition: width 0.1s linear; }
      `}</style>

      {/* Reading progress bar */}
      <div className="progress-bar" style={{ width: scrollPct + "%" }} />

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #d4d0cb", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, gap: 12, justifyContent: "space-between" }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#767676" }}>.top</span>
            </a>
            <a href="/artigos" style={{ fontSize: 13, fontWeight: 600, color: "#595959", textDecoration: "none", background: "#f5f2ee", padding: "6px 14px", borderRadius: 999, border: "1.5px solid #d4d0cb" }}>
              ← Todos os artigos
            </a>
          </div>
        </header>

        <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px 64px" }}>

          {/* Article header */}
          <div style={{ marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {meta.category}
              </span>
              <span style={{ fontSize: 12, color: "#767676" }}>{meta.readTime} de leitura</span>
              <span style={{ fontSize: 12, color: "#767676" }}>·</span>
              <span style={{ fontSize: 12, color: "#767676" }}>{meta.date}</span>
            </div>

            <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 16, letterSpacing: "-1px" }}>
              {meta.title}
            </h1>

            <p style={{ fontSize: "clamp(15px, 3.5vw, 18px)", color: "#595959", lineHeight: 1.6, marginBottom: 24 }}>
              {meta.excerpt}
            </p>

            {/* Hero image / YouTube embed */}
            {meta.youtubeId && (
              <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 8, position: "relative", paddingBottom: "56.25%", background: "#1a1a1a" }}>
                <iframe
                  src={"https://www.youtube.com/embed/" + meta.youtubeId + "?rel=0"}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={meta.title}
                />
              </div>
            )}

            {meta.heroEmoji && !meta.youtubeId && (
              <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "48px 24px", textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 80, marginBottom: 12 }}>{meta.heroEmoji}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>{meta.heroCaption}</p>
              </div>
            )}
          </div>

          {/* Article body */}
          <div className="article-body" style={{ animation: "fadeUp 0.5s ease both 0.1s", opacity: 0 }}>
            {children}
          </div>

          {/* Author / disclaimer */}
          <div style={{ marginTop: 48, padding: "20px", background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 14 }}>
            <p style={{ fontSize: 12, color: "#767676", lineHeight: 1.6 }}>
              <strong style={{ color: "#595959" }}>Nota editorial:</strong> Este artigo foi escrito com o auxílio de inteligência artificial e revisto para o contexto português. O objetivo é provocar reflexão — não substituir aconselhamento profissional. Partilha se achares que faz sentido.
            </p>
          </div>

          {/* Related articles */}
          {meta.related && meta.related.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 14, letterSpacing: "-0.2px" }}>Continua a ler</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {meta.related.map((r, i) => (
                  <a key={i} href={"/artigos/" + r.slug} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 12, textDecoration: "none", transition: "border-color 0.15s" }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{r.emoji}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{r.title}</p>
                      <p style={{ fontSize: 12, color: "#767676" }}>{r.readTime}</p>
                    </div>
                    <span style={{ fontSize: 16, color: "#c0392b", marginLeft: "auto", flexShrink: 0 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1.5px solid #d4d0cb", padding: "24px 16px", background: "#f8f7f4" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#c0392b" }}>10</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#767676" }}>.top</span>
              </a>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <a href="/artigos" className="footer-link">Artigos</a>
                <a href="/sobre" className="footer-link">Sobre</a>
                <a href="/privacidade" className="footer-link">Privacidade</a>
                <a href="/contacto" className="footer-link">Contacto</a>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#767676", lineHeight: 1.6 }}>
              Links de afiliado. Ao comprar através deles apoias o ai10pt.top sem custo adicional. Listas geradas por IA.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
