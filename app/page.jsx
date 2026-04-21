"use client";

import { useEffect, useState } from "react";
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
  Fnac:      { bg: "#fff0e0", color: "#9a6000" },
  Amazon:    { bg: "#fff8e0", color: "#8a6000" },
  Decathlon: { bg: "#e8f4ff", color: "#004899" },
  Zalando:   { bg: "#fff0f3", color: "#9b1b30" },
};

function RankBadge({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥉</span>;
  return <span style={{ fontSize: 14, fontWeight: 700, color: "#aaa", minWidth: 24, textAlign: "center", display: "inline-block" }}>{rank}</span>;
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

      // Fetch all lists, get most recent per slug
      const { data } = await supabase
        .from("daily_lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const seen = new Set();
        const unique = data.filter(row => {
          if (seen.has(row.slug || row.category)) return false;
          seen.add(row.slug || row.category);
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #f0ede8; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .fade-1 { animation: fadeUp 0.4s ease both 0.1s; }
        .fade-2 { animation: fadeUp 0.4s ease both 0.2s; }
        .fade-3 { animation: fadeUp 0.4s ease both 0.3s; }
        .fade-4 { animation: fadeUp 0.4s ease both 0.4s; }

        /* Scrollable tabs */
        .tabs-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
        .tab-btn { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); cursor: pointer; white-space: nowrap; transition: all 0.15s; text-decoration: none; display: inline-block; letter-spacing: 0.3px; }
        .tab-btn:hover { border-color: #e8593c; color: #e8593c; }

        /* Category cards */
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .cat-card { background: #141414; border: 1px solid #222; border-radius: 16px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; text-decoration: none; display: block; }
        .cat-card:hover { transform: translateY(-3px); border-color: #e8593c; }

        /* Featured product rows */
        .product-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #1a1a1a; transition: background 0.15s; }
        .product-row:last-child { border-bottom: none; }
        .product-row:hover { background: #1a1a1a; }

        /* Ticker */
        .ticker-wrap { overflow: hidden; background: #e8593c; padding: 8px 0; }
        .ticker-inner { display: flex; width: max-content; animation: ticker 30s linear infinite; }
        .ticker-item { font-size: 12px; font-weight: 600; color: #fff; padding: 0 32px; white-space: nowrap; letter-spacing: 0.5px; }

        /* Stats bar */
        .stat-box { background: #141414; border: 1px solid #222; border-radius: 12px; padding: 16px 20px; flex: 1; min-width: 120px; }

        @media (max-width: 640px) {
          .cat-grid { grid-template-columns: 1fr; }
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

        {/* Header */}
        <header style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 1 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#f0ede8", letterSpacing: "-1px" }}>ai</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#e8593c", letterSpacing: "-1px" }}>10</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#f0ede8", letterSpacing: "-1px" }}>pt</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "-1px" }}>.top</span>
            </a>

            {/* Scrollable category tabs in header */}
            <div style={{ flex: 1, margin: "0 32px", overflow: "hidden" }}>
              <div className="tabs-scroll">
                {allLists.map(list => (
                  <a
                    key={list.slug || list.category}
                    href={`/${list.slug || list.category}`}
                    className="tab-btn"
                  >
                    {list.category_pt}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Ao vivo</span>
            </div>
          </div>
        </header>

        {/* Trending ticker */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {allLists.concat(allLists).map((list, i) => (
              <span key={i} className="ticker-item">
                🔥 TOP 10 {list.category_pt?.toUpperCase()} &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

          {/* Hero section */}
          <div className="fade-1" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ background: "#e8593c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: "1px", textTransform: "uppercase" }}>
                Trending agora
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{todayFormatted}</span>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1.5px", color: "#f0ede8", marginBottom: 12 }}>
              Os melhores produtos<br />
              <span style={{ color: "#e8593c" }}>selecionados por IA</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7 }}>
              Todos os dias, a nossa inteligência artificial analisa o que os portugueses mais procuram e cria automaticamente o Top 10 mais relevante do momento — com preços reais e links diretos para as melhores lojas.
            </p>
          </div>

          {/* Stats bar */}
          <div className="fade-2" style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
            <div className="stat-box">
              <div style={{ fontSize: 24, fontWeight: 700, color: "#e8593c", fontFamily: "'Syne', sans-serif" }}>{allLists.length}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Categorias ativas</div>
            </div>
            <div className="stat-box">
              <div style={{ fontSize: 24, fontWeight: 700, color: "#e8593c", fontFamily: "'Syne', sans-serif" }}>10</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Produtos por lista</div>
            </div>
            <div className="stat-box">
              <div style={{ fontSize: 24, fontWeight: 700, color: "#e8593c", fontFamily: "'Syne', sans-serif" }}>24h</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Atualização automática</div>
            </div>
            <div className="stat-box">
              <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e", fontFamily: "'Syne', sans-serif" }}>100%</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Gratuito</div>
            </div>
          </div>

          {/* Featured banner — most recent list */}
          {!loading && featuredList && (
            <div className="fade-3" style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: "#e8593c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: "1px" }}>
                    EM DESTAQUE
                  </span>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#f0ede8" }}>
                    {featuredList.category_pt}
                  </h2>
                </div>
                <a href={`/${featuredList.slug || featuredList.category}`}
                  style={{ fontSize: 12, color: "#e8593c", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Ver lista completa →
                </a>
              </div>

              {featuredList.headline && (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 16, fontStyle: "italic" }}>
                  "{featuredList.headline}"
                </p>
              )}

              <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 16, overflow: "hidden" }}>
                {featuredList.items?.slice(0, 5).map((item, i) => {
                  const tag = TAG_STYLES[item.tag] || { bg: "#333", color: "#fff" };
                  const store = STORE_COLORS[item.store] || { bg: "#222", color: "#aaa" };
                  const url = buildAffiliateUrl(item.store, item.store_url_hint);
                  return (
                    <div key={i} className="product-row">
                      <div style={{ minWidth: 28, display: "flex", justifyContent: "center" }}>
                        <RankBadge rank={item.rank} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#f0ede8" }}>{item.name}</span>
                          {item.tag && (
                            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: tag.bg, color: tag.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2, lineHeight: 1.4 }}>{item.reason_pt}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#f0ede8" }}>€{item.price_eur}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
                          style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", background: "#e8593c", color: "#fff", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap" }}>
                          Ver →
                        </a>
                      </div>
                    </div>
                  );
                })}
                <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
                  <a href={`/${featuredList.slug || featuredList.category}`}
                    style={{ fontSize: 13, color: "#e8593c", textDecoration: "none", fontWeight: 600 }}>
                    Ver os 10 produtos completos →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* How it works story */}
          <div className="fade-3" style={{ marginBottom: 48, background: "#141414", border: "1px solid #222", borderRadius: 16, padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#f0ede8" }}>
                Como funciona o ai10pt.top?
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f0ede8", marginBottom: 4 }}>1. Análise de tendências</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  Todos os dias às 06:00, o nosso sistema analisa automaticamente o que os portugueses mais pesquisam no Google e em motores de IA.
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🧠</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f0ede8", marginBottom: 4 }}>2. IA decide a categoria</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  A inteligência artificial cruza as tendências do momento com a época do ano, eventos atuais e padrões de consumo em Portugal.
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🛒</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f0ede8", marginBottom: 4 }}>3. Top 10 gerado</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  São selecionados os 10 melhores produtos disponíveis em Portugal com preços reais na Worten, Fnac, Amazon e mais.
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f0ede8", marginBottom: 4 }}>4. Publicado automaticamente</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  A lista aparece aqui sem intervenção humana. Cada dia uma nova categoria, sempre relevante, sempre atualizada.
                </div>
              </div>
            </div>
          </div>

          {/* All categories grid */}
          <div className="fade-4">
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#f0ede8", marginBottom: 20 }}>
              Todas as categorias
            </h2>

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: "#141414", borderRadius: 16, height: 180, border: "1px solid #222" }} />
                ))}
              </div>
            ) : (
              <div className="cat-grid">
                {allLists.map((list, i) => (
                  <a
                    key={list.slug || list.category}
                    href={`/${list.slug || list.category}`}
                    className="cat-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Card header */}
                    <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid #1a1a1a" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Top 10
                        </span>
                        <span style={{ fontSize: 10, background: "#1a1a1a", color: "rgba(255,255,255,0.4)", padding: "2px 8px", borderRadius: 4 }}>
                          {new Date(list.created_at).toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 6, lineHeight: 1.2 }}>
                        {list.category_pt}
                      </h3>
                      {list.headline && (
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                          {list.headline.length > 80 ? list.headline.slice(0, 80) + "..." : list.headline}
                        </p>
                      )}
                    </div>

                    {/* Top 3 preview */}
                    <div style={{ padding: "12px 20px 16px" }}>
                      {list.items?.slice(0, 3).map((item, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: j < 2 ? "1px solid #1a1a1a" : "none" }}>
                          <RankBadge rank={item.rank} />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#e8593c", flexShrink: 0 }}>
                            €{item.price_eur}
                          </span>
                        </div>
                      ))}
                      <div style={{ marginTop: 12, fontSize: 11, color: "#e8593c", fontWeight: 600 }}>
                        Ver lista completa →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div style={{ marginTop: 64, background: "#141414", border: "1px solid #222", borderRadius: 16, padding: "32px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#f0ede8", marginBottom: 8, letterSpacing: "-0.5px" }}>
              Recebe o Top 10 todos os dias
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
              Newsletter gratuita. Sem spam. Cancela quando quiseres.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: "12px 20px", borderRadius: 10, border: "1px solid #333", background: "#0a0a0a", color: "#f0ede8", outline: "none", width: 260 }} />
              <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 10, background: "#e8593c", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                Subscrever grátis
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
              ai<span style={{ color: "#e8593c" }}>10</span>pt.top
            </span>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", maxWidth: 500, textAlign: "right", lineHeight: 1.5 }}>
              Os links são links de afiliado. Ao comprar através deles apoias o ai10pt.top sem custo adicional. Listas geradas por IA — sempre verifique os preços nas lojas.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
