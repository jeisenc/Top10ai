"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function buildAffiliateUrl(store, hint) {
  const encoded = encodeURIComponent(hint);
  switch (store) {
    case "Amazon":    return `https://www.amazon.es/s?k=${encoded}&tag=aitop10pt-21`;
    case "Worten":    return `https://www.worten.pt/search?query=${encoded}`;
    case "Fnac":      return `https://www.fnac.pt/SearchResult/ResultList.aspx?SCat=0&Search=${encoded}`;
    case "Decathlon": return `https://www.decathlon.pt/search?Ntt=${encoded}`;
    case "Zalando":   return `https://www.zalando.pt/catalog/?q=${encoded}`;
    default:          return `https://www.google.pt/search?q=${encoded}`;
  }
}

const TAG_STYLES = {
  "Melhor escolha": { bg: "#e8593c", color: "#fff" },
  "Melhor preço":   { bg: "#0f6e56", color: "#fff" },
  "Mais vendido":   { bg: "#185fa5", color: "#fff" },
  "Premium":        { bg: "#534ab7", color: "#fff" },
  "Económico":      { bg: "#ba7517", color: "#fff" },
};

const STORE_COLORS = {
  Worten:    { bg: "#fff0e6", color: "#b34700" },
  Fnac:      { bg: "#fff8e0", color: "#8a6000" },
  Amazon:    { bg: "#fff8e0", color: "#8a6000" },
  Decathlon: { bg: "#e8f4ff", color: "#004899" },
  Zalando:   { bg: "#fff0f3", color: "#9b1b30" },
};

function RankBadge({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥉</span>;
  return <span style={{ fontSize: 13, fontWeight: 700, color: "#bbb", minWidth: 24, textAlign: "center", display: "inline-block" }}>{rank}</span>;
}

// Live questions feed component
function LiveQuestionsFeed({ allLists }) {
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const allQuestionsRef = useRef([]);
  const indexRef = useRef(0);

  // Build all questions from FAQs across all lists
  useEffect(() => {
    if (!allLists.length) return;

    const questions = [];
    allLists.forEach(list => {
      if (list.faqs?.length) {
        list.faqs.forEach(faq => {
          questions.push({
            question: faq.question,
            category_pt: list.category_pt,
            slug: list.slug || list.category,
            id: Math.random().toString(36).slice(2),
          });
        });
      }
    });

    // Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    allQuestionsRef.current = shuffled;

    // Show first 5 immediately
    setVisibleQuestions(shuffled.slice(0, 5).map((q, i) => ({ ...q, key: `init-${i}`, isNew: false })));
    indexRef.current = 5;
  }, [allLists]);

  // Drop in a new question every 4 seconds
  useEffect(() => {
    if (!allQuestionsRef.current.length) return;

    const interval = setInterval(() => {
      const questions = allQuestionsRef.current;
      if (!questions.length) return;

      const next = { ...questions[indexRef.current % questions.length], key: `q-${Date.now()}`, isNew: true };
      indexRef.current = (indexRef.current + 1) % questions.length;

      setVisibleQuestions(prev => {
        const updated = [next, ...prev].slice(0, 8);
        // Remove isNew after animation
        setTimeout(() => {
          setVisibleQuestions(curr => curr.map(q => q.key === next.key ? { ...q, isNew: false } : q));
        }, 600);
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [allLists]);

  const hasQuestions = visibleQuestions.length > 0;

  return (
    <div style={{ background: "#fff", border: "1.5px solid #ede9e4", borderRadius: 20, overflow: "hidden" }}>
      {/* Feed header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1.5px solid #f5f2ee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "4px 10px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#15803d", fontWeight: 700 }}>Ao vivo</span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.3px" }}>
            O que Portugal está a perguntar
          </h3>
        </div>
        <p style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>
          Perguntas reais que os portugueses estão a fazer sobre os produtos em destaque hoje — geradas a partir das pesquisas mais comuns no Google e em motores de IA. Atualiza automaticamente a cada poucos segundos.
        </p>
      </div>

      {/* Questions feed */}
      <div style={{ padding: "12px 16px", minHeight: 300, maxHeight: 420, overflowY: "hidden" }}>
        {!hasQuestions ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 52, background: "#f8f7f4", borderRadius: 10, border: "1px solid #f0ede8" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visibleQuestions.map((q) => (
              <a
                key={q.key}
                href={`/${q.slug}`}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  background: q.isNew ? "#fff8f6" : "#faf9f7",
                  border: q.isNew ? "1.5px solid #fdd0c4" : "1px solid #f0ede8",
                  borderRadius: 10,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  animation: q.isNew ? "dropIn 0.5s ease both" : "none",
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>🔍</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {q.question}
                  </p>
                  <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {q.category_pt}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#e8593c", fontWeight: 700, flexShrink: 0 }}>Ver →</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Ad slot placeholder */}
      <div style={{
        margin: "0 16px 16px",
        padding: "14px 16px",
        background: "#f8f7f4",
        border: "1.5px dashed #e0ddd8",
        borderRadius: 10,
        textAlign: "center",
      }}>
        <span style={{ fontSize: 10, color: "#ccc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
          Espaço publicitário
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [featuredList, setFeaturedList] = useState(null);
  const [allLists, setAllLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayFormatted = new Date().toLocaleDateString("pt-PT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase
        .from("daily_lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const seen = new Set();
        const unique = data.filter(row => {
          const key = row.slug || row.category;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setFeaturedList(unique[0] || null);
        setAllLists(unique);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .fade-1 { animation: fadeUp 0.5s ease both 0.05s; opacity: 0; }
        .fade-2 { animation: fadeUp 0.5s ease both 0.15s; opacity: 0; }
        .fade-3 { animation: fadeUp 0.5s ease both 0.25s; opacity: 0; }
        .fade-4 { animation: fadeUp 0.5s ease both 0.35s; opacity: 0; }
        .tabs-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
        .tab-pill { font-size: 13px; font-weight: 600; padding: 7px 18px; border-radius: 999px; border: 1.5px solid #e0ddd8; background: #fff; color: #666; cursor: pointer; white-space: nowrap; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .tab-pill:hover { border-color: #e8593c; color: #e8593c; background: #fff8f6; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .cat-card { background: #fff; border: 1.5px solid #ede9e4; border-radius: 20px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; text-decoration: none; display: block; }
        .cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); border-color: #e8593c; }
        .product-row { display: flex; align-items: center; gap: 14px; padding: 13px 20px; border-bottom: 1px solid #f0ede8; transition: background 0.12s; }
        .product-row:last-child { border-bottom: none; }
        .product-row:hover { background: #faf9f7; }
        .how-step { background: #fff; border: 1.5px solid #ede9e4; border-radius: 16px; padding: 24px; }
        .stat-card { background: #fff; border: 1.5px solid #ede9e4; border-radius: 16px; padding: 20px 24px; flex: 1; min-width: 120px; }
        @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 680px) { .cat-grid { grid-template-columns: 1fr; } .how-grid { grid-template-columns: 1fr 1fr !important; } .hero-cols { flex-direction: column !important; } }
        @media (max-width: 400px) { .how-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #ede9e4", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 24 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 0, flexShrink: 0 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>ai</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#e8593c", letterSpacing: "-0.5px" }}>10</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>pt</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#ccc", letterSpacing: "-0.5px" }}>.top</span>
            </a>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="tabs-scroll">
                {allLists.map(list => (
                  <a key={list.slug || list.category} href={`/${list.slug || list.category}`} className="tab-pill">
                    {list.category_pt}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "5px 12px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: "#15803d", fontWeight: 600 }}>Ao vivo</span>
            </div>
          </div>
        </header>

        {/* Ticker */}
        <div style={{ overflow: "hidden", background: "#e8593c", padding: "9px 0" }}>
          <div style={{ display: "flex", width: "max-content", animation: "ticker 35s linear infinite" }}>
            {[...allLists, ...allLists].map((list, i) => (
              <a key={i} href={`/${list.slug || list.category}`} style={{ fontSize: 11, fontWeight: 700, color: "#fff", padding: "0 28px", whiteSpace: "nowrap", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>
                ▸ TOP 10 {list.category_pt?.toUpperCase()} &nbsp;·
              </a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "48px 24px" }}>

          {/* Hero */}
          <div className="fade-1" style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff8f6", border: "1.5px solid #fdd0c4", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e8593c" }}>Atualizado diariamente por IA</span>
            </div>
            <div className="hero-cols" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div style={{ maxWidth: 600 }}>
                <h1 style={{ fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", color: "#1a1a1a", marginBottom: 16 }}>
                  Os melhores produtos<br />
                  <span style={{ color: "#e8593c" }}>escolhidos por IA</span><br />
                  para Portugal
                </h1>
                <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, maxWidth: 520 }}>
                  Todos os dias analisamos tendências de pesquisa em Portugal e geramos automaticamente o Top 10 mais relevante — com preços reais e links diretos.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="stat-card">
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#e8593c", letterSpacing: "-1px", lineHeight: 1 }}>{allLists.length}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4, fontWeight: 500 }}>Categorias</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#e8593c", letterSpacing: "-1px", lineHeight: 1 }}>10</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4, fontWeight: 500 }}>Produtos / lista</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#e8593c", letterSpacing: "-1px", lineHeight: 1 }}>24h</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4, fontWeight: 500 }}>Atualização</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-column layout: Featured + Live Feed */}
          <div className="fade-2 main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, marginBottom: 56, alignItems: "start" }}>

            {/* Featured banner */}
            {!loading && featuredList && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ background: "#e8593c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      Em destaque hoje
                    </span>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.3px" }}>
                      {featuredList.category_pt}
                    </h2>
                  </div>
                  <a href={`/${featuredList.slug || featuredList.category}`} style={{ fontSize: 13, color: "#e8593c", textDecoration: "none", fontWeight: 700 }}>
                    Ver lista completa →
                  </a>
                </div>
                {featuredList.headline && (
                  <p style={{ fontSize: 14, color: "#888", marginBottom: 16, fontStyle: "italic" }}>"{featuredList.headline}"</p>
                )}
                <div style={{ background: "#fff", border: "1.5px solid #ede9e4", borderRadius: 20, overflow: "hidden" }}>
                  {featuredList.items?.slice(0, 5).map((item, i) => {
                    const tag = TAG_STYLES[item.tag] || { bg: "#eee", color: "#666" };
                    const store = STORE_COLORS[item.store] || { bg: "#f5f5f5", color: "#666" };
                    const url = buildAffiliateUrl(item.store, item.store_url_hint);
                    return (
                      <div key={i} className="product-row">
                        <div style={{ minWidth: 28, display: "flex", justifyContent: "center" }}>
                          <RankBadge rank={item.rank} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{item.name}</span>
                            {item.tag && (
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: tag.bg, color: tag.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 12, color: "#999", lineHeight: 1.4 }}>{item.reason_pt}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>€{item.price_eur}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer sponsored"
                            style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", background: "#e8593c", color: "#fff", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap" }}>
                            Ver →
                          </a>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ padding: "14px 20px", background: "#faf9f7", borderTop: "1px solid #f0ede8", textAlign: "center" }}>
                    <a href={`/${featuredList.slug || featuredList.category}`} style={{ fontSize: 13, color: "#e8593c", textDecoration: "none", fontWeight: 700 }}>
                      Ver todos os 10 produtos →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Live questions feed */}
            <LiveQuestionsFeed allLists={allLists} />
          </div>

          {/* How it works */}
          <div className="fade-3" style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Como funciona?</h2>
              <div style={{ flex: 1, height: 1, background: "#ede9e4" }} />
            </div>
            <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { icon: "📈", title: "Análise de tendências", desc: "Às 06:00, o sistema analisa automaticamente o que os portugueses mais pesquisam no Google e em motores de IA." },
                { icon: "🧠", title: "IA decide a categoria", desc: "A inteligência artificial cruza tendências, época do ano e eventos atuais para escolher a categoria mais relevante." },
                { icon: "🛒", title: "Top 10 gerado", desc: "São selecionados os 10 melhores produtos disponíveis em Portugal com preços reais na Worten, Fnac, Amazon e mais." },
                { icon: "⚡", title: "Publicado automaticamente", desc: "A lista aparece sem intervenção humana. Cada dia uma nova categoria, sempre relevante, sempre atual." },
              ].map((step, i) => (
                <div key={i} className="how-step">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff8f6", border: "1.5px solid #fdd0c4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{step.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.4 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* All categories */}
          <div className="fade-4">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Todas as categorias</h2>
              <div style={{ flex: 1, height: 1, background: "#ede9e4" }} />
              <span style={{ fontSize: 13, color: "#999", fontWeight: 500 }}>{allLists.length} listas</span>
            </div>
            {loading ? (
              <div className="cat-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 20, height: 200, border: "1.5px solid #ede9e4" }} />
                ))}
              </div>
            ) : (
              <div className="cat-grid">
                {allLists.map((list) => (
                  <a key={list.slug || list.category} href={`/${list.slug || list.category}`} className="cat-card">
                    <div style={{ padding: "22px 22px 16px", borderBottom: "1px solid #f5f2ee" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#e8593c", textTransform: "uppercase", letterSpacing: "1px" }}>Top 10</span>
                        <span style={{ fontSize: 11, color: "#bbb", fontWeight: 500 }}>
                          {new Date(list.created_at).toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 19, fontWeight: 800, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.2, letterSpacing: "-0.3px" }}>
                        {list.category_pt}
                      </h3>
                      {list.headline && (
                        <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>
                          {list.headline?.length > 75 ? list.headline.slice(0, 75) + "..." : list.headline}
                        </p>
                      )}
                    </div>
                    <div style={{ padding: "14px 22px 18px" }}>
                      {list.items?.slice(0, 3).map((item, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: j < 2 ? "1px solid #f5f2ee" : "none" }}>
                          <RankBadge rank={item.rank} />
                          <span style={{ fontSize: 12, color: "#555", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", flexShrink: 0 }}>€{item.price_eur}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 14, fontSize: 12, color: "#e8593c", fontWeight: 700 }}>Ver lista completa →</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div style={{ marginTop: 64, background: "#1a1a1a", borderRadius: 24, padding: "40px", textAlign: "center" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.5px" }}>
              Recebe o Top 10 todos os dias
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28, lineHeight: 1.6 }}>
              Newsletter gratuita. O melhor de Portugal direto na tua caixa de entrada.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontSize: 14, padding: "13px 20px", borderRadius: 10, border: "1px solid #333", background: "#2a2a2a", color: "#fff", outline: "none", width: 280 }} />
              <button style={{ fontSize: 14, fontWeight: 700, padding: "13px 28px", borderRadius: 10, background: "#e8593c", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                Subscrever grátis
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1.5px solid #ede9e4", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#e8593c" }}>10</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#ccc" }}>.top</span>
            </div>
            <p style={{ fontSize: 11, color: "#bbb", maxWidth: 500, textAlign: "right", lineHeight: 1.6 }}>
              Os links são links de afiliado. Ao comprar através deles apoias o ai10pt.top sem custo adicional. Listas geradas por IA — verifique sempre os preços nas lojas.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
