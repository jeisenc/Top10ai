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
  "Melhor escolha": { bg: "#c0392b", color: "#fff" },
  "Melhor preço":   { bg: "#0f6e56", color: "#fff" },
  "Mais vendido":   { bg: "#1a5fa8", color: "#fff" },
  "Premium":        { bg: "#4a3fa0", color: "#fff" },
  "Económico":      { bg: "#7a4f00", color: "#fff" },
};

const STORE_COLORS = {
  Worten:    { bg: "#fff0e6", color: "#8a3500" },
  Fnac:      { bg: "#fff8e0", color: "#6b4a00" },
  Amazon:    { bg: "#fff8e0", color: "#6b4a00" },
  Decathlon: { bg: "#e8f4ff", color: "#003d7a" },
  Zalando:   { bg: "#fff0f3", color: "#7a1030" },
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
    <span style={{ fontSize: 13, fontWeight: 700, color: "#595959", minWidth: 24, textAlign: "center", display: "inline-block" }}>
      {rank}
    </span>
  );
}

function YouTubeEmbed({ video }) {
  const [playing, setPlaying] = useState(false);
  if (!video?.videoId) return null;

  return (
    <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1px solid #e8e4df" }}>
      {playing ? (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          style={{ width: "100%", border: "none", padding: 0, background: "none", cursor: "pointer", display: "block", position: "relative", WebkitTapHighlightColor: "transparent" }}
        >
          <img
            src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
            alt={video.title}
            style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "16px solid #fff", marginLeft: 3 }} />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "16px 10px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, background: "#FF0000", color: "#fff", fontWeight: 700, padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>▶ YouTube</span>
            <span style={{ fontSize: 12, color: "#fff", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {video.title}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

function ProductCard({ item, index }) {
  const tag = TAG_STYLES[item.tag] || { bg: "#e8e4df", color: "#3d3d3d" };
  const store = STORE_COLORS[item.store] || { bg: "#f5f2ee", color: "#3d3d3d" };
  const url = buildAffiliateUrl(item.store, item.store_url_hint);
  const isTop3 = item.rank <= 3;

  return (
    <div style={{
      background: "#fff",
      border: isTop3 ? "2px solid #c0392b" : "1.5px solid #d4d0cb",
      borderRadius: 14, overflow: "hidden",
      animation: "fadeUp 0.3s ease both",
      animationDelay: `${index * 40}ms`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px 0" }}>
        <div style={{ minWidth: 28, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 2, flexShrink: 0 }}>
          <RankBadge rank={item.rank} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, flex: 1, minWidth: 0 }}>
              {item.name}
            </span>
            {item.tag && (
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.3px", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, background: tag.bg, color: tag.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                {item.tag}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#595959", margin: "0 0 8px", lineHeight: 1.5 }}>{item.reason_pt}</p>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: store.bg, color: store.color, textTransform: "uppercase", letterSpacing: "0.3px" }}>
            {item.store}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>€{item.price_eur}</span>
          <a href={url} target="_blank" rel="noopener noreferrer sponsored"
            style={{ fontSize: 12, fontWeight: 700, padding: "6px 12px", background: "#c0392b", color: "#fff", borderRadius: 7, textDecoration: "none", whiteSpace: "nowrap", minHeight: 32, display: "inline-flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}>
            Ver →
          </a>
        </div>
      </div>

      {item.youtube && (
        <div style={{ padding: "0 14px 14px" }}>
          <YouTubeEmbed video={item.youtube} />
        </div>
      )}
      {!item.youtube && <div style={{ height: 14 }} />}
    </div>
  );
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 12, overflow: "hidden", animation: "fadeUp 0.3s ease both", animationDelay: `${index * 40}ms` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", minHeight: 48, WebkitTapHighlightColor: "transparent" }}
      >
        <span style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4, flex: 1 }}>
          {faq.question}
        </span>
        <span style={{ fontSize: 20, color: "#c0392b", fontWeight: 700, transition: "transform 0.2s", flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #ede9e4" }}>
          <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#3d3d3d", lineHeight: 1.7, marginTop: 12 }}>
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 14, padding: "14px" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e8e4df", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, width: "55%", background: "#e8e4df", borderRadius: 5, marginBottom: 8 }} />
          <div style={{ height: 12, width: "90%", background: "#ede9e4", borderRadius: 5, marginBottom: 5 }} />
          <div style={{ height: 12, width: "60%", background: "#ede9e4", borderRadius: 5 }} />
        </div>
        <div style={{ width: 68, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
          <div style={{ height: 18, width: 50, background: "#e8e4df", borderRadius: 5 }} />
          <div style={{ height: 30, width: 68, background: "#e8e4df", borderRadius: 7 }} />
        </div>
      </div>
      <div style={{ height: 160, background: "#ede9e4", borderRadius: 10, marginTop: 10 }} />
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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        .tabs-scroll { display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 2px 0; }
        .tabs-scroll::-webkit-scrollbar { display: none; }

        .cat-btn { font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 999px; border: 1.5px solid #c8c4bf; background: #fff; color: #3d3d3d; cursor: pointer; white-space: nowrap; transition: all 0.15s; text-decoration: none; min-height: 36px; display: inline-flex; align-items: center; -webkit-tap-highlight-color: transparent; }
        .cat-btn:active { border-color: #c0392b; color: #c0392b; }
        .cat-btn.active { background: #c0392b; color: #fff; border-color: #c0392b; }

        .ver-link { font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 999px; border: 1.5px solid #c8c4bf; background: #fff; color: #3d3d3d; text-decoration: none; display: inline-flex; align-items: center; min-height: 36px; -webkit-tap-highlight-color: transparent; transition: all 0.15s; }
        .ver-link:active { border-color: #c0392b; color: #c0392b; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #d4d0cb", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, gap: 12 }}>
            <a href="/" style={{ display: "flex", alignItems: "baseline", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b", letterSpacing: "-0.5px" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#767676", letterSpacing: "-0.5px" }}>.top</span>
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
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "4px 10px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: "#15803d", fontWeight: 700 }}>Ao vivo</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>

          {/* Page header */}
          <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top 10 do dia</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 40px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 10, letterSpacing: "-0.8px" }}>
              {loading ? "A carregar..." : list?.category_pt || slug}
            </h1>
            {!loading && list?.headline && (
              <p style={{ fontSize: "clamp(13px, 3.5vw, 15px)", color: "#595959", lineHeight: 1.6, maxWidth: 520 }}>{list.headline}</p>
            )}
            <div style={{ marginTop: 10, fontSize: 12, color: "#595959", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{ background: "#ede9e4", padding: "2px 8px", borderRadius: 999, fontSize: 12, color: "#595959", fontWeight: 600 }}>
                Selecionado por IA
              </span>
            </div>
          </div>

          {/* Product list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            ) : !list ? (
              <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 14, color: "#595959", border: "1.5px solid #d4d0cb" }}>
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
                <div style={{ flex: 1, height: 1, background: "#d4d0cb" }} />
              </div>
              <p style={{ fontSize: 13, color: "#595959", marginBottom: 14, lineHeight: 1.5 }}>
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
            <div style={{ marginBottom: 40, paddingTop: 24, borderTop: "1.5px solid #d4d0cb" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#595959", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                Ver também
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories.filter(c => c.slug !== slug).map(cat => (
                  <a key={cat.slug} href={`/${cat.slug}`} className="ver-link">{cat.category_pt}</a>
                ))}
              </div>
            </div>
          )}

          {!loading && list && (
            <p style={{ marginBottom: 24, fontSize: 12, color: "#595959", textAlign: "center", lineHeight: 1.7 }}>
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
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Newsletter gratuita. Sem spam.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
              <input type="email" placeholder="o-teu-email@gmail.com"
                style={{ fontSize: 15, padding: "13px 16px", borderRadius: 10, border: "1px solid #444", background: "#2a2a2a", color: "#fff", outline: "none", width: "100%", minHeight: 48 }} />
              <button style={{ fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, background: "#c0392b", color: "#fff", border: "none", cursor: "pointer", minHeight: 48, WebkitTapHighlightColor: "transparent" }}>
                Subscrever grátis
              </button>
            </div>
          </div>
        </div>
{/* Footer */}
        <footer style={{ borderTop: "1.5px solid #d4d0cb", padding: "24px 16px", background: "#f8f7f4" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#c0392b" }}>10</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#767676" }}>.top</span>
              </a>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                <a href="/sobre" style={{ fontSize: 13, color: "#595959", textDecoration: "none" }}>Sobre</a>
                <a href="/privacidade" style={{ fontSize: 13, color: "#595959", textDecoration: "none" }}>Privacidade</a>
                <a href="/contacto" style={{ fontSize: 13, color: "#595959", textDecoration: "none" }}>Contacto</a>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#595959", lineHeight: 1.6 }}>
              Links de afiliado. Ao comprar através deles apoias o ai10pt.top sem custo adicional. Listas geradas por IA.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
