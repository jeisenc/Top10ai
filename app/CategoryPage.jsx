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
  if (rank === 1) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥉</span>;
  return (
    <span style={{ fontSize: 13, fontWeight: 700, color: "#bbb", minWidth: 24, textAlign: "center", display: "inline-block" }}>
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
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 14px", background: "#fff",
      border: isTop3 ? "2px solid #e8593c" : "1.5px solid #ede9e4",
      borderRadius: 14,
      animation: "fadeUp 0.3s ease both",
      animationDelay: `${index * 40}ms`,
    }}>
      <div style={{ minWidth: 28, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 2, flexShrink: 0 }}>
        <RankBadge rank={item.rank} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
          <span style={{ fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, flex: 1, minWidth: 0 }}>
            {item.name}
          </span>
          {item.tag && (
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, background: tag.bg, color: tag.color, whiteSpace: "nowrap", flexShrink: 0 }}>
              {item.tag}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px", lineHeight: 1.5 }}>{item.reason_pt}</p>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: store.bg, color: store.color, textTransform: "uppercase", letterSpacing: "0.4px" }}>
          {item.store}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>€{item.price_eur}</span>
        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
          style={{
            fontSize: 11, fontWeight: 700, padding: "6px 12px",
            background: "#e8593c", color: "#fff", borderRadius: 7,
            textDecoration: "none", whiteSpace: "nowrap",
            minHeight: 32, display: "inline-flex", alignItems: "center",
            WebkitTapHighlightColor: "transparent",
          }}>
          Ver →
        </a>
      </div>
    </div>
  );
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #ede9e4",
      borderRadius: 12, overflow: "hidden",
      animation: "fadeUp 0.3s ease both",
      animationDelay: `${index * 40}ms`,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          padding: "14px 16px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
          minHeight: 48, WebkitTapHighlightColor: "transparent",
        }}
      >
        <span style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4, flex: 1 }}>
          {faq.question}
        </span>
        <span style={{
          fontSize: 20, color: "#e8593c", fontWeight: 700,
          transition: "transform 0.2s", flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          display: "inline-block", lineHeight: 1,
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f5f2ee" }}>
          <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#666", lineHeight: 1.7, marginTop: 12 }}>
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 14px", background: "#fff", border: "1.5px solid #ede9e4", borderRadius: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0ede8", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: "55%", background: "#f0ede8", borderRadius: 5, marginBottom: 8 }} />
        <div style={{ height: 11, width: "90%", background: "#f5f2ee", borderRadius: 5, marginBottom: 5 }} />
        <div style={{ height: 11, width: "60%", background: "#f5f2ee", borderRadius: 5 }} />
      </div>
      <div style={{ width: 68, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
        <div style={{ height: 18, width: 50, background: "#f0ede8", borderRadius: 5 }} />
        <div style={{ height: 30, width: 68, background: "#f0ede8", borderRadius: 7 }} />
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

  const faqSchema = list?.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": list.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

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
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        .tabs-scroll {
          display: flex; gap: 8px;
          overflow-x: auto; overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; padding: 2px 0;
        }
        .tabs-scroll::-webkit-scrollbar { display: none; }

        .cat-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 7px 16px; border-radius: 999px;
          border: 1.5px solid #e0ddd8; background: #fff; color: #666;
          cursor: pointer; white-space: nowrap;
          transition: all 0.15s; text-decoration: none;
          min-height: 36px; display: inline-flex; align-items: center;
          WebkitTapHighlightColor: transparent;
        }
        .cat-btn:hover, .cat-btn:active { border-color: #e8593c; color: #e8593c; background: #fff8f6; }
        .cat-btn.active { background: #e8593c; color: #fff; border-color: #e8593c; }

        .ver-link {
          font-size: 12px; fontWeight: 600;
          padding: 7px 16px; border-radius: 999px;
          border: 1.5px solid #e0ddd8; background: #fff; color: #555;
          text-decoration: none; display: inline-flex; align-items: center;
          min-height: 36px; transition: all 0.15s;
          WebkitTapHighlightColor: transparent;
        }
        .ver-link:active { border-color: #e8593c; color: #e8593c; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #ede9e4", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, gap: 12 }}>
            <a href="/" style={{ display: "flex", alignItems: "baseline", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#e8593c", letterSpacing: "-0.5px" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#ccc", letterSpacing: "-0.5px" }}>.top</span>
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

            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "4px 10px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: "#15803d", fontWeight: 700 }}>Ao vivo</span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>

          {/* Page header */}
          <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff8f6", border: "1.5px solid #fdd0c4", borderRadius: 999, padding: "3px 10px", marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#e8593c", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top 10 do dia</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 40px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 10, letterSpacing: "-0.8px" }}>
              {loading ? "A carregar..." : list?.category_pt || slug}
            </h1>
            {!loading && list?.headline && (
              <p style={{ fontSize: "clamp(13px, 3.5vw, 15px)", color: "#888", lineHeight: 1.6, maxWidth: 520 }}>{list.headline}</p>
            )}
            <div style={{ marginTop: 10, fontSize: 11, color: "#bbb", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{ background: "#f5f2ee", padding: "2px 8px", borderRadius: 999, fontSize: 10, color: "#999", fontWeight: 600 }}>
                Selecionado por IA
              </span>
            </div>
          </div>

          {/* Product list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            ) : !list ? (
              <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 14, color: "#bbb", border: "1.5px solid #ede9e4" }}>
                <p style={{ fontSize: 14 }}>Nenhuma lista disponível para esta categoria.</p>
              </div>
            ) : (
              list.items
                .sort((a, b) => a.rank - b.rank)
                .map((item, i) => <ProductCard key={item.rank} item={item} index={i} />)
            )}
          </div>

          {/* FAQ Section */}
          {!loading && list?.faqs?.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: "clamp(17px, 4.5vw, 22px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.3px" }}>
                  Perguntas frequentes
                </h2>
                <div style={{ flex: 1, height: 1, background: "#ede9e4" }} />
              </div>
              <p style={{ fontSize: 12, color: "#999", marginBottom: 14, lineHeight: 1.5 }}>
                As questões mais comuns sobre {list.category_pt?.toLowerCase()} respondidas por IA.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Internal links */}
          {!loading && categories.length > 0 && (
            <div style={{ marginBottom: 40, paddingTop: 24, borderTop: "1.5px solid #ede9e4" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                Ver também
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories
                  .filter(c => c.slug !== slug)
                  .map(cat => (
                    <a key={cat.slug} href={`/${cat.slug}`} className="ver-link">
                      {cat.category_pt}
                    </a>
                  ))}
              </div>
            </div>
          )}

          {!loading && list && (
            <p style={{ marginBottom: 24, fontSize: 10, color: "#ccc", textAlign: "center", lineHeight: 1.7 }}>
              Lista gerada por IA. Os links são de afiliado — ao comprar apoias o ai10pt.top sem custo adicional.
            </p>
          )}
        </main>

        {/* Newsletter */}
        <div style={{ background: "#1a1a1a", padding: "28px 16px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <p style={{ fontSize: "clamp(16px, 4.5vw, 20px)", fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.3px" }}>
              Recebe o Top 10 todos os dias
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Newsletter gratuita. Sem spam.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, padding: "13px 16px", borderRadius: 10, border: "1px solid #333", background: "#2a2a2a", color: "#fff", outline: "none", width: "100%", minHeight: 48 }} />
              <button style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, background: "#e8593c", color: "#fff", border: "none", cursor: "pointer", minHeight: 48, WebkitTapHighlightColor: "transparent" }}>
                Subscrever grátis
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
