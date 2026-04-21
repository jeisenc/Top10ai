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
  if (rank === 1) return <span style={{ fontSize: 18, lineHeight: 1 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 18, lineHeight: 1 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 18, lineHeight: 1 }}>🥉</span>;
  return <span style={{ fontSize: 13, fontWeight: 700, color: "#bbb", minWidth: 22, textAlign: "center", display: "inline-block" }}>{rank}</span>;
}

function LiveQuestionsFeed({ allLists }) {
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const allQuestionsRef = useRef([]);
  const indexRef = useRef(0);

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
          });
        });
      }
    });
    const shuffled = questions.sort(() => Math.random() - 0.5);
    allQuestionsRef.current = shuffled;
    setVisibleQuestions(shuffled.slice(0, 4).map((q, i) => ({ ...q, key: `init-${i}`, isNew: false })));
    indexRef.current = 4;
  }, [allLists]);

  useEffect(() => {
    if (!allQuestionsRef.current.length) return;
    const interval = setInterval(() => {
      const questions = allQuestionsRef.current;
      if (!questions.length) return;
      const next = { ...questions[indexRef.current % questions.length], key: `q-${Date.now()}`, isNew: true };
      indexRef.current = (indexRef.current + 1) % questions.length;
      setVisibleQuestions(prev => {
        const updated = [next, ...prev].slice(0, 5);
        setTimeout(() => {
          setVisibleQuestions(curr => curr.map(q => q.key === next.key ? { ...q, isNew: false } : q));
        }, 600);
        return updated;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [allLists]);

  return (
    <div style={{ background: "#fff", border: "1.5px solid #ede9e4", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: "1.5px solid #f5f2ee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "3px 8px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, color: "#15803d", fontWeight: 700 }}>Ao vivo</span>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px" }}>
            O que Portugal pergunta
          </h3>
        </div>
        <p style={{ fontSize: 11, color: "#999", lineHeight: 1.5 }}>
          Perguntas reais que os portugueses fazem sobre os produtos em destaque. Atualiza automaticamente.
        </p>
      </div>

      <div style={{ padding: "10px 12px" }}>
        {visibleQuestions.length === 0 ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 56, background: "#f8f7f4", borderRadius: 8, marginBottom: 6, border: "1px solid #f0ede8" }} />
          ))
        ) : (
          visibleQuestions.map(q => (
            <a key={q.key} href={`/${q.slug}`} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 12px", marginBottom: 6,
              background: q.isNew ? "#fff8f6" : "#faf9f7",
              border: q.isNew ? "1.5px solid #fdd0c4" : "1px solid #f0ede8",
              borderRadius: 8, textDecoration: "none",
              animation: q.isNew ? "dropIn 0.5s ease both" : "none",
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🔍</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.5, marginBottom: 2, wordBreak: "break-word" }}>
                  {q.question}
                </p>
                <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {q.category_pt}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#e8593c", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>Ver →</span>
            </a>
          ))
        )}
      </div>

      {/* Ad slot */}
      <div style={{ margin: "0 12px 12px", padding: "12px", background: "#f8f7f4", border: "1.5px dashed #e0ddd8", borderRadius: 8, textAlign: "center" }}>
        <span style={{ fontSize: 9, color: "#ccc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Espaço publicitário</span>
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
        html { font-size: 16px; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        .fade-up { animation: fadeUp 0.4s ease both; opacity: 0; }

        /* Scrollable tabs — touch friendly */
        .tabs-scroll {
          display: flex; gap: 8px;
          overflow-x: auto; overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 2px 0;
        }
        .tabs-scroll::-webkit-scrollbar { display: none; }

        .tab-pill {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 999px;
          border: 1.5px solid #e0ddd8; background: #fff; color: #666;
          cursor: pointer; white-space: nowrap;
          transition: all 0.15s; text-decoration: none;
          display: inline-block;
          /* Minimum touch target 44px */
          min-height: 36px; line-height: 1;
          display: inline-flex; align-items: center;
        }
        .tab-pill:hover, .tab-pill:active { border-color: #e8593c; color: #e8593c; background: #fff8f6; }

        /* Product rows */
        .product-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-bottom: 1px solid #f0ede8;
          transition: background 0.12s;
        }
        .product-row:last-child { border-bottom: none; }
        .product-row:active { background: #faf9f7; }

        /* Category cards */
        .cat-card {
          background: #fff; border: 1.5px solid #ede9e4;
          border-radius: 16px; overflow: hidden;
          text-decoration: none; display: block;
          transition: transform 0.2s, border-color 0.2s;
        }
        .cat-card:active { transform: scale(0.98); border-color: #e8593c; }

        /* Buttons — minimum 44px touch targets */
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 44px; padding: 0 20px;
          background: #e8593c; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          border: none; border-radius: 10px;
          cursor: pointer; text-decoration: none;
          white-space: nowrap; -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:active { opacity: 0.85; }

        .btn-outline {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 44px; padding: 0 16px;
          background: #fff; color: #e8593c;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          border: 1.5px solid #e8593c; border-radius: 10px;
          cursor: pointer; text-decoration: none;
          white-space: nowrap; -webkit-tap-highlight-color: transparent;
        }

        /* Responsive grid */
        .cat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .stat-card {
          background: #fff; border: 1.5px solid #ede9e4;
          border-radius: 12px; padding: 14px 12px;
          text-align: center;
        }

        /* How it works */
        .how-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .how-step {
          background: #fff; border: 1.5px solid #ede9e4;
          border-radius: 12px; padding: 16px;
        }

        /* Desktop enhancements — only kick in above 768px */
        @media (min-width: 768px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .how-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .stats-row { gap: 14px; }
          .stat-card { padding: 20px 24px; }
          .product-row { padding: 13px 20px; }
        }

        @media (min-width: 1100px) {
          .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .desktop-two-col { display: grid !important; grid-template-columns: 1fr 380px; gap: 24px; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header — compact for mobile */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #ede9e4", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, gap: 12 }}>

            {/* Logo */}
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#e8593c", letterSpacing: "-0.5px" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#ccc", letterSpacing: "-0.5px" }}>.top</span>
            </a>

            {/* Scrollable tabs */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="tabs-scroll">
                {allLists.map(list => (
                  <a key={list.slug || list.category} href={`/${list.slug || list.category}`} className="tab-pill">
                    {list.category_pt}
                  </a>
                ))}
              </div>
            </div>

            {/* Live badge — hidden on very small screens */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "4px 10px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: "#15803d", fontWeight: 700 }}>Ao vivo</span>
            </div>
          </div>
        </header>

        {/* Ticker */}
        <div style={{ overflow: "hidden", background: "#e8593c", padding: "8px 0" }}>
          <div style={{ display: "flex", width: "max-content", animation: "ticker 30s linear infinite" }}>
            {[...allLists, ...allLists].map((list, i) => (
              <a key={i} href={`/${list.slug || list.category}`} style={{
                fontSize: 10, fontWeight: 700, color: "#fff",
                padding: "0 20px", whiteSpace: "nowrap",
                letterSpacing: "0.8px", textTransform: "uppercase",
                textDecoration: "none",
              }}>
                ▸ TOP 10 {list.category_pt?.toUpperCase()} ·
              </a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 16px" }}>

          {/* Hero — mobile first: single column, smaller text */}
          <div className="fade-up" style={{ marginBottom: 28, animationDelay: "0.05s" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #fdd0c4", borderRadius: 999, padding: "4px 12px", marginBottom: 14 }}>
              <span style={{ fontSize: 12 }}>🔥</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#e8593c" }}>Atualizado diariamente por IA</span>
            </div>
            <h1 style={{ fontSize: "clamp(26px, 7vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px", color: "#1a1a1a", marginBottom: 12 }}>
              Os melhores produtos<br />
              <span style={{ color: "#e8593c" }}>escolhidos por IA</span><br />
              para Portugal
            </h1>
            <p style={{ fontSize: "clamp(14px, 3.5vw, 17px)", color: "#666", lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>
              Todos os dias analisamos o que os portugueses mais pesquisam e geramos automaticamente o Top 10 mais relevante — com preços reais e links diretos.
            </p>

            {/* Stats row */}
            <div className="stats-row">
              <div className="stat-card">
                <div style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 800, color: "#e8593c", letterSpacing: "-1px", lineHeight: 1 }}>{allLists.length}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 3, fontWeight: 500 }}>Categorias</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 800, color: "#e8593c", letterSpacing: "-1px", lineHeight: 1 }}>10</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 3, fontWeight: 500 }}>Por lista</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 800, color: "#e8593c", letterSpacing: "-1px", lineHeight: 1 }}>24h</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 3, fontWeight: 500 }}>Atualização</div>
              </div>
            </div>
          </div>

          {/* Featured + Live Feed
              Mobile: stacked vertically
              Desktop (1100px+): side by side */}
          <div className="fade-up desktop-two-col" style={{ display: "block", marginBottom: 40, animationDelay: "0.1s" }}>

            {/* Featured list */}
            {!loading && featuredList && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#e8593c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 5, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      Em destaque
                    </span>
                    <h2 style={{ fontSize: "clamp(15px, 4vw, 20px)", fontWeight: 700, color: "#1a1a1a" }}>
                      {featuredList.category_pt}
                    </h2>
                  </div>
                  <a href={`/${featuredList.slug || featuredList.category}`} style={{ fontSize: 12, color: "#e8593c", textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>
                    Ver tudo →
                  </a>
                </div>

                {featuredList.headline && (
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 12, fontStyle: "italic", lineHeight: 1.5 }}>
                    "{featuredList.headline}"
                  </p>
                )}

                <div style={{ background: "#fff", border: "1.5px solid #ede9e4", borderRadius: 16, overflow: "hidden" }}>
                  {featuredList.items?.slice(0, 5).map((item, i) => {
                    const tag = TAG_STYLES[item.tag] || { bg: "#eee", color: "#666" };
                    const store = STORE_COLORS[item.store] || { bg: "#f5f5f5", color: "#666" };
                    const url = buildAffiliateUrl(item.store, item.store_url_hint);
                    return (
                      <div key={i} className="product-row">
                        <div style={{ minWidth: 26, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                          <RankBadge rank={item.rank} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{item.name}</span>
                            {item.tag && (
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: tag.bg, color: tag.color, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 11, color: "#999", lineHeight: 1.4 }}>{item.reason_pt}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>€{item.price_eur}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer sponsored" className="btn-primary" style={{ fontSize: 11, padding: "0 10px", minHeight: 32, borderRadius: 6 }}>
                            Ver →
                          </a>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ padding: "12px 16px", background: "#faf9f7", borderTop: "1px solid #f0ede8", textAlign: "center" }}>
                    <a href={`/${featuredList.slug || featuredList.category}`} style={{ fontSize: 13, color: "#e8593c", textDecoration: "none", fontWeight: 700 }}>
                      Ver os 10 produtos completos →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Live feed */}
            <LiveQuestionsFeed allLists={allLists} />
          </div>

          {/* How it works */}
          <div className="fade-up" style={{ marginBottom: 40, animationDelay: "0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontSize: "clamp(18px, 4.5vw, 24px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Como funciona?</h2>
              <div style={{ flex: 1, height: 1, background: "#ede9e4" }} />
            </div>
            <div className="how-grid">
              {[
                { icon: "📈", title: "Analisa tendências", desc: "Às 06:00 verifica o que os portugueses mais pesquisam." },
                { icon: "🧠", title: "IA escolhe a categoria", desc: "Cruza tendências, época do ano e eventos atuais." },
                { icon: "🛒", title: "Gera o Top 10", desc: "10 produtos reais com preços na Worten, Fnac, Amazon." },
                { icon: "⚡", title: "Publica automaticamente", desc: "Sem intervenção humana. Sempre relevante." },
              ].map((step, i) => (
                <div key={i} className="how-step">
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{step.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 5, lineHeight: 1.3 }}>{step.title}</div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* All categories */}
          <div className="fade-up" style={{ marginBottom: 40, animationDelay: "0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontSize: "clamp(18px, 4.5vw, 24px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Todas as categorias</h2>
              <div style={{ flex: 1, height: 1, background: "#ede9e4" }} />
              <span style={{ fontSize: 12, color: "#999", fontWeight: 500, flexShrink: 0 }}>{allLists.length}</span>
            </div>

            {loading ? (
              <div className="cat-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 16, height: 160, border: "1.5px solid #ede9e4" }} />
                ))}
              </div>
            ) : (
              <div className="cat-grid">
                {allLists.map((list) => (
                  <a key={list.slug || list.category} href={`/${list.slug || list.category}`} className="cat-card">
                    <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f5f2ee" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#e8593c", textTransform: "uppercase", letterSpacing: "1px" }}>Top 10</span>
                        <span style={{ fontSize: 10, color: "#bbb", fontWeight: 500 }}>
                          {new Date(list.created_at).toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 800, color: "#1a1a1a", marginBottom: 6, lineHeight: 1.2, letterSpacing: "-0.3px" }}>
                        {list.category_pt}
                      </h3>
                      {list.headline && (
                        <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.4 }}>
                          {list.headline?.length > 70 ? list.headline.slice(0, 70) + "..." : list.headline}
                        </p>
                      )}
                    </div>
                    <div style={{ padding: "10px 16px 14px" }}>
                      {list.items?.slice(0, 3).map((item, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: j < 2 ? "1px solid #f5f2ee" : "none" }}>
                          <RankBadge rank={item.rank} />
                          <span style={{ fontSize: 12, color: "#555", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: "#1a1a1a", flexShrink: 0 }}>€{item.price_eur}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, fontSize: 12, color: "#e8593c", fontWeight: 700 }}>Ver lista completa →</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "28px 20px", textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.5px" }}>
              Recebe o Top 10 todos os dias
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20, lineHeight: 1.5 }}>
              Newsletter gratuita. Cancela quando quiseres.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, margin: "0 auto" }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, padding: "14px 16px", borderRadius: 10, border: "1px solid #333", background: "#2a2a2a", color: "#fff", outline: "none", width: "100%", minHeight: 48 }} />
              <button className="btn-primary" style={{ width: "100%", fontSize: 15, minHeight: 48, borderRadius: 10 }}>
                Subscrever grátis
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: 20, borderTop: "1.5px solid #ede9e4", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#e8593c" }}>10</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#ccc" }}>.top</span>
            </div>
            <p style={{ fontSize: 10, color: "#bbb", lineHeight: 1.6, maxWidth: 280 }}>
              Links de afiliado. Ao comprar através deles apoias o ai10pt.top sem custo adicional. Listas geradas por IA — verifique os preços nas lojas.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
