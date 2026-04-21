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
  "Melhor escolha": { bg: "#1a1a1a", color: "#fff" },
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
    <span style={{ fontSize: 15, fontWeight: 600, color: "#888", minWidth: 28, textAlign: "center", display: "inline-block" }}>
      {rank}
    </span>
  );
}

function ProductCard({ item, index }) {
  const tag = TAG_STYLES[item.tag] || { bg: "#eee", color: "#333" };
  const store = STORE_COLORS[item.store] || { bg: "#f5f5f5", color: "#333" };
  const url = buildAffiliateUrl(item.store, item.store_url_hint);
  const isTop3 = item.rank <= 3;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 16,
      padding: "18px 20px", background: "#fff",
      border: isTop3 ? "1.5px solid #1a1a1a" : "1px solid #e5e5e5",
      borderRadius: 12,
      animation: "fadeUp 0.3s ease both",
      animationDelay: `${index * 60}ms`,
    }}>
      <div style={{ minWidth: 32, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 2 }}>
        <RankBadge rank={item.rank} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0f0f0f", fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.3 }}>
            {item.name}
          </span>
          {item.tag && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: tag.bg, color: tag.color, whiteSpace: "nowrap" }}>
              {item.tag}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 8px", lineHeight: 1.5 }}>{item.reason_pt}</p>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: store.bg, color: store.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {item.store}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.5px" }}>€{item.price_eur}</span>
        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
          style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", background: "#0f0f0f", color: "#fff", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap", letterSpacing: "0.3px" }}>
          Ver oferta →
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ display: "flex", gap: 16, padding: "18px 20px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, width: "60%", background: "#f0f0f0", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, width: "90%", background: "#f5f5f5", borderRadius: 4, marginBottom: 4 }} />
        <div style={{ height: 12, width: "70%", background: "#f5f5f5", borderRadius: 4 }} />
      </div>
      <div style={{ width: 80, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <div style={{ height: 20, width: 60, background: "#f0f0f0", borderRadius: 4 }} />
        <div style={{ height: 32, width: 80, background: "#f0f0f0", borderRadius: 6 }} />
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

  // Fetch all categories dynamically from Supabase
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

  // Fetch the list for this slug
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f7f6f2; color: #0f0f0f; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cat-btn { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 7px 16px; border-radius: 999px; border: 1px solid #ddd; background: #fff; color: #555; cursor: pointer; white-space: nowrap; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .cat-btn:hover { border-color: #999; color: #0f0f0f; }
        .cat-btn.active { background: #0f0f0f; color: #fff; border-color: #0f0f0f; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f7f6f2" }}>

        {/* Header */}
        <header style={{ background: "#0f0f0f", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
            <a href="/" style={{ display: "flex", alignItems: "baseline", gap: 2, textDecoration: "none" }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>ai</span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, color: "#e8593c" }}>top10</span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>.pt</span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#aaa" }}>Atualizado hoje</span>
            </div>
          </div>
        </header>

        {/* Category tabs — dynamic from Supabase */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "12px 24px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
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

        {/* Main content */}
        <main style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#e8593c", marginBottom: 6 }}>
              Top 10 do dia
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 800, lineHeight: 1.15, color: "#0f0f0f", marginBottom: 10, letterSpacing: "-0.5px" }}>
              {loading ? "A carregar..." : list?.category_pt || slug}
            </h1>
            {!loading && list?.headline && (
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, maxWidth: 580 }}>{list.headline}</p>
            )}
            <div style={{ marginTop: 12, fontSize: 12, color: "#aaa", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{ background: "#f0f0f0", padding: "2px 8px", borderRadius: 4, fontSize: 11, color: "#888" }}>Selecionado por IA</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            ) : !list ? (
              <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 12, color: "#888" }}>
                <p style={{ fontSize: 15 }}>Nenhuma lista disponível para esta categoria.</p>
              </div>
            ) : (
              list.items
                .sort((a, b) => a.rank - b.rank)
                .map((item, i) => <ProductCard key={item.rank} item={item} index={i} />)
            )}
          </div>

          {/* Internal links — dynamic from Supabase */}
          {!loading && categories.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #e5e5e5" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
                Ver também
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories
                  .filter(c => c.slug !== slug)
                  .map(cat => (
                    <a key={cat.slug} href={`/${cat.slug}`} style={{
                      fontSize: 13, padding: "7px 16px", borderRadius: 999,
                      border: "1px solid #ddd", color: "#555",
                      textDecoration: "none", background: "#fff",
                    }}>
                      {cat.category_pt}
                    </a>
                  ))}
              </div>
            </div>
          )}

          {!loading && list && (
            <p style={{ marginTop: 24, fontSize: 11, color: "#bbb", textAlign: "center", lineHeight: 1.6 }}>
              Esta lista foi gerada por inteligência artificial com base em produtos disponíveis em Portugal.
              Os links são links de afiliado — ao comprar através deles apoias o aitop10.pt sem custo adicional.
            </p>
          )}
        </main>

        {/* Newsletter bar */}
        <div style={{ background: "#0f0f0f", padding: "32px 24px", marginTop: 48 }}>
          <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                Recebe o Top 10 todos os dias
              </p>
              <p style={{ fontSize: 13, color: "#888" }}>Newsletter gratuita. Sem spam. Cancela quando quiseres.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: "10px 16px", borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: "#fff", outline: "none", width: 220 }} />
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
