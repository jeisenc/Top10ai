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
  Worten:    { bg: "#fff0e6", color: "#b34700" },
  Fnac:      { bg: "#fff8e0", color: "#8a6000" },
  Amazon:    { bg: "#fff8e0", color: "#8a6000" },
  Decathlon: { bg: "#e8f4ff", color: "#004899" },
  Zalando:   { bg: "#fff0f3", color: "#9b1b30" },
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
    <span style={{ fontSize: 14, fontWeight: 700, color: "#bbb", minWidth: 28, textAlign: "center", display: "inline-block" }}>
      {rank}
    </span>
  );
}

function ProductCard({ item, index }) {
  const tag = TAG_STYLES[item.tag] || { bg: "#eee", color: "#666" };
  const store = STORE_COLORS[item.store] || { bg: "#f5f5f5", color: "#666" };
  const url = buildAffiliateUrl(item.store, item.store_url_hint);
  const isTop3 = item.rank <= 3;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 16,
      padding: "20px 22px", background: "#fff",
      border: isTop3 ? "2px solid #e8593c" : "1.5px solid #ede9e4",
      borderRadius: 16,
      animation: "fadeUp 0.3s ease both",
      animationDelay: `${index * 50}ms`,
      transition: "box-shadow 0.15s",
    }}>
      <div style={{ minWidth: 32, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 2 }}>
        <RankBadge rank={item.rank} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>
            {item.name}
          </span>
          {item.tag && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: tag.bg, color: tag.color, whiteSpace: "nowrap" }}>
              {item.tag}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 10px", lineHeight: 1.6 }}>{item.reason_pt}</p>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: store.bg, color: store.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {item.store}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>€{item.price_eur}</span>
        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
          style={{ fontSize: 12, fontWeight: 700, padding: "8px 16px", background: "#e8593c", color: "#fff", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
          Ver oferta →
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ display: "flex", gap: 16, padding: "20px 22px", background: "#fff", border: "1.5px solid #ede9e4", borderRadius: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0ede8" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, width: "55%", background: "#f0ede8", borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 12, width: "90%", background: "#f5f2ee", borderRadius: 6, marginBottom: 6 }} />
        <div style={{ height: 12, width: "65%", background: "#f5f2ee", borderRadius: 6 }} />
      </div>
      <div style={{ width: 80, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <div style={{ height: 22, width: 60, background: "#f0ede8", borderRadius: 6 }} />
        <div style={{ height: 34, width: 80, background: "#f0ede8", borderRadius: 8 }} />
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cat-btn { font-size: 13px; font-weight: 600; padding: 7px 18px; border-radius: 999px; border: 1.5px solid #e0ddd8; background: #fff; color: #666; cursor: pointer; white-space: nowrap; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .cat-btn:hover { border-color: #e8593c; color: #e8593c; background: #fff8f6; }
        .cat-btn.active { background: #e8593c; color: #fff; border-color: #e8593c; }
        .tabs-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #ede9e4", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 24 }}>
            <a href="/" style={{ display: "flex", alignItems: "baseline", gap: 0, textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>ai</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#e8593c", letterSpacing: "-0.5px" }}>10</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>pt</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#ccc", letterSpacing: "-0.5px" }}>.top</span>
            </a>

            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="tabs-scroll">
                {categories.map(cat => (
                  <a key={cat.slug} href={`/${cat.slug}`} className={`cat-btn${cat.slug === slug ? " active" : ""}`}>
                    {cat.category_pt}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "5px 12px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "#15803d", fontWeight: 600 }}>Ao vivo</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 32, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #fdd0c4", borderRadius: 999, padding: "4px 12px", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#e8593c", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top 10 do dia</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-1px" }}>
              {loading ? "A carregar..." : list?.category_pt || slug}
            </h1>
            {!loading && list?.headline && (
              <p style={{ fontSize: 16, color: "#888", lineHeight: 1.7, maxWidth: 580 }}>{list.headline}</p>
            )}
            <div style={{ marginTop: 14, fontSize: 12, color: "#bbb", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{ background: "#f5f2ee", padding: "2px 10px", borderRadius: 999, fontSize: 11, color: "#999", fontWeight: 600 }}>
                Selecionado por IA
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            ) : !list ? (
              <div style={{ padding: 48, textAlign: "center", background: "#fff", borderRadius: 16, color: "#bbb", border: "1.5px solid #ede9e4" }}>
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
            <div style={{ marginTop: 48, paddingTop: 28, borderTop: "1.5px solid #ede9e4" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>
                Ver também
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories
                  .filter(c => c.slug !== slug)
                  .map(cat => (
                    <a key={cat.slug} href={`/${cat.slug}`} style={{
                      fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 999,
                      border: "1.5px solid #e0ddd8", color: "#666",
                      textDecoration: "none", background: "#fff",
                      transition: "all 0.15s",
                    }}>
                      {cat.category_pt}
                    </a>
                  ))}
              </div>
            </div>
          )}

          {!loading && list && (
            <p style={{ marginTop: 28, fontSize: 11, color: "#ccc", textAlign: "center", lineHeight: 1.7 }}>
              Esta lista foi gerada por inteligência artificial com base em produtos disponíveis em Portugal.
              Os links são links de afiliado — ao comprar através deles apoias o ai10pt.top sem custo adicional.
            </p>
          )}
        </main>

        {/* Newsletter */}
        <div style={{ background: "#1a1a1a", padding: "40px 24px", marginTop: 48 }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.5px" }}>
                Recebe o Top 10 todos os dias
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Newsletter gratuita. Sem spam. Cancela quando quiseres.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, padding: "11px 18px", borderRadius: 10, border: "1px solid #333", background: "#2a2a2a", color: "#fff", outline: "none", width: 230 }} />
              <button style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: "11px 20px", borderRadius: 10, background: "#e8593c", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                Subscrever
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
