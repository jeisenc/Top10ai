"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";

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
  Worten:    { bg: "#2a1a0a", color: "#f0a070" },
  Fnac:      { bg: "#1a1500", color: "#d4a020" },
  Amazon:    { bg: "#1a1500", color: "#d4a020" },
  Decathlon: { bg: "#0a1525", color: "#4090d0" },
  Zalando:   { bg: "#1a0a10", color: "#d04070" },
};

const SEO = {
  "auscultadores": {
    title: "Top 10 Melhores Auscultadores Wireless Portugal 2026",
    description: "Descobre os 10 melhores auscultadores wireless disponíveis em Portugal em 2026. Lista atualizada diariamente por IA com preços e onde comprar.",
  },
  "robots-aspiradores": {
    title: "Top 10 Melhores Robots Aspiradores Portugal 2026",
    description: "Os 10 melhores robots aspiradores disponíveis em Portugal em 2026. Comparação de preços na Worten, Fnac e Amazon. Atualizado diariamente por IA.",
  },
  "sapatilhas": {
    title: "Top 10 Melhores Sapatilhas de Corrida Portugal 2026",
    description: "As 10 melhores sapatilhas de corrida disponíveis em Portugal em 2026. Lista atualizada diariamente por inteligência artificial.",
  },
  "fritadeiras-de-ar": {
    title: "Top 10 Melhores Fritadeiras de Ar Portugal 2026",
    description: "As 10 melhores fritadeiras de ar disponíveis em Portugal em 2026. Preços e lojas atualizados diariamente por IA.",
  },
  "portateis": {
    title: "Top 10 Melhores Portáteis até 800€ Portugal 2026",
    description: "Os 10 melhores portáteis disponíveis em Portugal em 2026. Lista atualizada diariamente com preços reais na Worten, Fnac e Amazon.",
  },
  "protetor-solar": {
    title: "Top 10 Melhores Protetores Solares Portugal 2026",
    description: "Os 10 melhores protetores solares disponíveis em Portugal em 2026. Lista atualizada diariamente por inteligência artificial.",
  },
  "moda-verao": {
    title: "Top 10 Melhores Vestidos de Verão Portugal 2026",
    description: "Os 10 vestidos de verão mais populares disponíveis em Portugal em 2026. Lista atualizada diariamente por IA com preços e onde comprar.",
  },
};

function RankBadge({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 22, lineHeight: 1 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 22, lineHeight: 1 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 22, lineHeight: 1 }}>🥉</span>;
  return (
    <span style={{ fontSize: 15, fontWeight: 600, color: "#555", minWidth: 28, textAlign: "center", display: "inline-block" }}>
      {rank}
    </span>
  );
}

function ProductCard({ item, index }) {
  const tag = TAG_STYLES[item.tag] || { bg: "#333", color: "#fff" };
  const store = STORE_COLORS[item.store] || { bg: "#1a1a1a", color: "#aaa" };
  const url = buildAffiliateUrl(item.store, item.store_url_hint);
  const isTop3 = item.rank <= 3;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 16,
      padding: "18px 20px", background: "#141414",
      border: isTop3 ? "1.5px solid #e8593c" : "1px solid #222",
      borderRadius: 12,
      animation: "fadeUp 0.3s ease both",
      animationDelay: `${index * 60}ms`,
    }}>
      <div style={{ minWidth: 32, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 2 }}>
        <RankBadge rank={item.rank} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f0ede8", fontFamily: "'Syne', sans-serif", lineHeight: 1.3 }}>
            {item.name}
          </span>
          {item.tag && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: tag.bg, color: tag.color, whiteSpace: "nowrap" }}>
              {item.tag}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 8px", lineHeight: 1.5 }}>{item.reason_pt}</p>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: store.bg, color: store.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {item.store}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#f0ede8", letterSpacing: "-0.5px" }}>€{item.price_eur}</span>
        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
          style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", background: "#e8593c", color: "#fff", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap", letterSpacing: "0.3px" }}>
          Ver oferta →
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ display: "flex", gap: 16, padding: "18px 20px", background: "#141414", border: "1px solid #222", borderRadius: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#222" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, width: "60%", background: "#222", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, width: "90%", background: "#1a1a1a", borderRadius: 4, marginBottom: 4 }} />
        <div style={{ height: 12, width: "70%", background: "#1a1a1a", borderRadius: 4 }} />
      </div>
      <div style={{ width: 80, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <div style={{ height: 20, width: 60, background: "#222", borderRadius: 4 }} />
        <div style={{ height: 32, width: 80, background: "#222", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function CategoryPage({ slug }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const seo = SEO[slug] || {
    title: "AI Top 10 Portugal — Os melhores produtos selecionados por IA",
    description: "Os 10 melhores produtos disponíveis em Portugal hoje, selecionados por inteligência artificial.",
  };

  const todayFormatted = new Date().toLocaleDateString("pt-PT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("daily_lists")
        .select("category, category_pt, slug")
        .not("slug", "is", null)
        .order("created_at", { ascending: false });

      if (data) {
        const seen = new Set();
        const unique = data.filter(row => {
          if (seen.has(row.slug)) return false;
          seen.add(row.slug);
          return true;
        });
        setCategories(unique);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      const { data, error } = await supabase
        .from("daily_lists")
        .select("*")
        .eq("slug", slug)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) setList(data);
      setLoading(false);
    }
    fetchList();
  }, [slug]);

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #f0ede8; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cat-btn { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); cursor: pointer; white-space: nowrap; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .cat-btn:hover { border-color: #e8593c; color: #e8593c; }
        .cat-btn.active { background: #e8593c; color: #fff; border-color: #e8593c; }
        .tabs-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

        {/* Header */}
        <header style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, gap: 24 }}>
            <a href="/" style={{ display: "flex", alignItems: "baseline", gap: 1, textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#f0ede8" }}>ai</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#e8593c" }}>10</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#f0ede8" }}>pt</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "rgba(255,255,255,0.3)" }}>.top</span>
            </a>

            {/* Scrollable tabs */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="tabs-scroll">
                {categories.map(cat => (
                  <a
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className={`cat-btn${cat.slug === slug ? " active" : ""}`}
                  >
                    {cat.category_pt}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Ao vivo</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#e8593c", marginBottom: 8 }}>
              Top 10 do dia
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, lineHeight: 1.1, color: "#f0ede8", marginBottom: 10, letterSpacing: "-1px" }}>
              {loading ? "A carregar..." : list?.category_pt || slug}
            </h1>
            {!loading && list?.headline && (
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 580 }}>{list.headline}</p>
            )}
            <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{ background: "#1a1a1a", padding: "2px 8px", borderRadius: 4, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                Selecionado por IA
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            ) : !list ? (
              <div style={{ padding: 40, textAlign: "center", background: "#141414", borderRadius: 12, color: "rgba(255,255,255,0.4)" }}>
                <p style={{ fontSize: 15 }}>Nenhuma lista disponível para esta categoria.</p>
              </div>
            ) : (
              list.items
                .sort((a, b) => a.rank - b.rank)
                .map((item, i) => <ProductCard key={item.rank} item={item} index={i} />)
            )}
          </div>

          {/* Internal links */}
          {!loading && categories.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #1a1a1a" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
                Ver também
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories
                  .filter(c => c.slug !== slug)
                  .map(cat => (
                    <a key={cat.slug} href={`/${cat.slug}`} style={{
                      fontSize: 13, padding: "7px 16px", borderRadius: 999,
                      border: "1px solid #222", color: "rgba(255,255,255,0.5)",
                      textDecoration: "none", background: "#141414",
                      transition: "border-color 0.15s",
                    }}>
                      {cat.category_pt}
                    </a>
                  ))}
              </div>
            </div>
          )}

          {!loading && list && (
            <p style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
              Esta lista foi gerada por inteligência artificial com base em produtos disponíveis em Portugal.
              Os links são links de afiliado — ao comprar através deles apoias o ai10pt.top sem custo adicional.
            </p>
          )}
        </main>

        {/* Newsletter bar */}
        <div style={{ background: "#141414", borderTop: "1px solid #1a1a1a", padding: "32px 24px", marginTop: 48 }}>
          <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 4 }}>
                Recebe o Top 10 todos os dias
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Newsletter gratuita. Sem spam. Cancela quando quiseres.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: "10px 16px", borderRadius: 8, border: "1px solid #333", background: "#0a0a0a", color: "#f0ede8", outline: "none", width: 220 }} />
              <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: "10px 18px", borderRadius: 8, background: "#e8593c", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                Subscrever
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
