"use client";

import { useState } from "react";

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
  "Melhor preco":   { bg: "#0f6e56", color: "#fff" },
  "Mais vendido":   { bg: "#1a5fa8", color: "#fff" },
  "Premium":        { bg: "#4a3fa0", color: "#fff" },
  "Economico":      { bg: "#7a4f00", color: "#fff" },
};

const STORE_COLORS = {
  Worten:    { bg: "#fff0e6", color: "#8a3500" },
  Fnac:      { bg: "#fff8e0", color: "#6b4a00" },
  Amazon:    { bg: "#fff8e0", color: "#6b4a00" },
  Decathlon: { bg: "#e8f4ff", color: "#003d7a" },
  Zalando:   { bg: "#fff0f3", color: "#7a1030" },
};

const CATEGORY_EMOJI = {
  "auscultadores": "\uD83C\uDFA7",
  "robots-aspiradores": "\uD83E\uDD16",
  "sapatilhas": "\uD83D\uDC5F",
  "fritadeiras-de-ar": "\uD83C\uDF5F",
  "portateis": "\uD83D\uDCBB",
  "protetor-solar": "\uD83E\uDDF4",
  "moda-verao": "\uD83D\uDC57",
  "ventiladores": "\uD83C\uDF00",
  "maquinas-de-cafe": "\u2615",
  "jardim": "\uD83C\uDF3F",
  "suplementos": "\uD83D\uDC8A",
  "televisores": "\uD83D\uDCFA",
  "smartphones": "\uD83D\uDCF1",
  "bicicletas": "\uD83D\uDEB2",
  "default": "\uD83D\uDED2",
};

function getCategoryEmoji(slug) {
  if (!slug) return CATEGORY_EMOJI.default;
  const key = Object.keys(CATEGORY_EMOJI).find(k => slug.includes(k));
  return key ? CATEGORY_EMOJI[key] : CATEGORY_EMOJI.default;
}

function RankBadge({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 20, lineHeight: 1 }}>{"🥇"}</span>;
  if (rank === 2) return <span style={{ fontSize: 20, lineHeight: 1 }}>{"🥈"}</span>;
  if (rank === 3) return <span style={{ fontSize: 20, lineHeight: 1 }}>{"🥉"}</span>;
  return <span style={{ fontSize: 13, fontWeight: 700, color: "#595959", minWidth: 24, textAlign: "center", display: "inline-block" }}>{rank}</span>;
}

function YouTubeEmbed({ video }) {
  const [playing, setPlaying] = useState(false);
  if (!video?.videoId) return null;
  return (
    <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1px solid #e8e4df" }}>
      {playing ? (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <button onClick={() => setPlaying(true)} style={{ width: "100%", border: "none", padding: 0, background: "none", cursor: "pointer", display: "block", position: "relative", WebkitTapHighlightColor: "transparent" }}>
          <img src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} alt={video.title} style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "16px solid #fff", marginLeft: 3 }} />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "16px 10px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, background: "#FF0000", color: "#fff", fontWeight: 700, padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>YouTube</span>
            <span style={{ fontSize: 12, color: "#fff", lineHeight: 1.3 }}>{video.title}</span>
          </div>
        </button>
      )}
    </div>
  );
}

function ProductCard({ item, index, categoryEmoji }) {
  const tag = TAG_STYLES[item.tag] || { bg: "#e8e4df", color: "#3d3d3d" };
  const store = STORE_COLORS[item.store] || { bg: "#f5f2ee", color: "#3d3d3d" };
  const url = buildAffiliateUrl(item.store, item.store_url_hint);
  const isTop3 = item.rank <= 3;
  return (
    <div style={{ background: "#fff", border: isTop3 ? "2px solid #c0392b" : "1.5px solid #d4d0cb", borderRadius: 14, overflow: "hidden", animation: "fadeUp 0.3s ease both", animationDelay: `${index * 40}ms` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px 0" }}>

        {/* Product image or emoji fallback */}
        <div style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0, background: isTop3 ? "#fff0ee" : "#f5f2ee", border: isTop3 ? "1.5px solid #f4a995" : "1.5px solid #e8e4df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, overflow: "hidden" }}>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => {
                e.target.style.display = "none";
                e.target.parentNode.innerText = categoryEmoji;
              }}
            />
          ) : (
            categoryEmoji
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, flex: 1, minWidth: 0 }}>{item.name}</span>
            {item.tag && <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: tag.bg, color: tag.color, whiteSpace: "nowrap", flexShrink: 0 }}>{item.tag}</span>}
          </div>
          <p style={{ fontSize: 13, color: "#595959", margin: "0 0 8px", lineHeight: 1.5 }}>{item.reason_pt}</p>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: store.bg, color: store.color, textTransform: "uppercase" }}>{item.store}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <RankBadge rank={item.rank} />
          <span style={{ fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 800, color: "#1a1a1a" }}>{"€"}{item.price_eur}</span>
          <a href={url} target="_blank" rel="noopener noreferrer sponsored" style={{ fontSize: 12, fontWeight: 700, padding: "6px 12px", background: "#c0392b", color: "#fff", borderRadius: 7, textDecoration: "none", whiteSpace: "nowrap", minHeight: 32, display: "inline-flex", alignItems: "center" }}>{"Ver →"}</a>
        </div>
      </div>
      {item.youtube && <div style={{ padding: "0 14px 14px" }}><YouTubeEmbed video={item.youtube} /></div>}
      {!item.youtube && <div style={{ height: 14 }} />}
    </div>
  );
}

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", minHeight: 48, WebkitTapHighlightColor: "transparent" }}>
        <span style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4, flex: 1 }}>{faq.question}</span>
        <span style={{ fontSize: 20, color: "#c0392b", fontWeight: 700, flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s", lineHeight: 1 }}>+</span>
      </button>
      {open && <div style={{ padding: "0 16px 14px", borderTop: "1px solid #ede9e4" }}><p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#3d3d3d", lineHeight: 1.7, marginTop: 12 }}>{faq.answer}</p></div>}
    </div>
  );
}

export default function CategoryPageClient({ slug, initialList, initialCategories }) {
  const list = initialList;
  const categories = initialCategories || [];
  const categoryEmoji = getCategoryEmoji(slug);

  const todayFormatted = new Date().toLocaleDateString("pt-PT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .tabs-scroll { display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 2px 0; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
        .cat-btn { font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 999px; border: 1.5px solid #c8c4bf; background: #fff; color: #3d3d3d; cursor: pointer; white-space: nowrap; text-decoration: none; min-height: 36px; display: inline-flex; align-items: center; -webkit-tap-highlight-color: transparent; }
        .cat-btn.active { background: #c0392b; color: #fff; border-color: #c0392b; }
        .ver-link { font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 999px; border: 1.5px solid #c8c4bf; background: #fff; color: #3d3d3d; text-decoration: none; display: inline-flex; align-items: center; min-height: 36px; -webkit-tap-highlight-color: transparent; }
        .footer-link { font-size: 13px; color: #595959; text-decoration: none; }
        .footer-link:hover { color: #c0392b; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        <header style={{ background: "#fff", borderBottom: "1.5px solid #d4d0cb", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, gap: 12 }}>
            <a href="/" style={{ display: "flex", alignItems: "baseline", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#767676" }}>.top</span>
            </a>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="tabs-scroll">
                {categories.map(cat => (
                  <a key={cat.slug} href={`/${cat.slug}`} className={`cat-btn${cat.slug === slug ? " active" : ""}`}>{cat.category_pt}</a>
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

          <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{categoryEmoji}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top 10 do dia</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 40px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 10, letterSpacing: "-0.8px" }}>
              {list?.category_pt || slug}
            </h1>
            {list?.headline && <p style={{ fontSize: "clamp(13px, 3.5vw, 15px)", color: "#595959", lineHeight: 1.6, maxWidth: 520 }}>{list.headline}</p>}
            <div style={{ marginTop: 10, fontSize: 12, color: "#595959", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{ background: "#ede9e4", padding: "2px 8px", borderRadius: 999, fontSize: 12, color: "#595959", fontWeight: 600 }}>Selecionado por IA</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {!list ? (
              <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 14, color: "#595959", border: "1.5px solid #d4d0cb" }}>
                <p style={{ fontSize: 14 }}>Nenhuma lista disponível para esta categoria.</p>
              </div>
            ) : (
              list.items.sort((a, b) => a.rank - b.rank).map((item, i) => (
                <ProductCard key={item.rank} item={item} index={i} categoryEmoji={categoryEmoji} />
              ))
            )}
          </div>

          {list?.faqs?.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: "clamp(17px, 4.5vw, 22px)", fontWeight: 800, color: "#1a1a1a" }}>Perguntas frequentes</h2>
                <div style={{ flex: 1, height: 1, background: "#d4d0cb" }} />
              </div>
              <p style={{ fontSize: 13, color: "#595959", marginBottom: 14, lineHeight: 1.5 }}>
                As questões mais comuns sobre {list.category_pt?.toLowerCase()} respondidas por IA.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.faqs.map((faq, i) => <FAQItem key={i} faq={faq} />)}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div style={{ marginBottom: 40, paddingTop: 24, borderTop: "1.5px solid #d4d0cb" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#595959", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Ver também</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories.filter(c => c.slug !== slug).map(cat => (
                  <a key={cat.slug} href={`/${cat.slug}`} className="ver-link">{cat.category_pt}</a>
                ))}
              </div>
            </div>
          )}

          {list && (
            <p style={{ marginBottom: 24, fontSize: 12, color: "#595959", textAlign: "center", lineHeight: 1.7 }}>
              Lista gerada por IA. Os links são de afiliado — ao comprar apoias o ai10pt.top sem custo adicional.
            </p>
          )}
        </main>

        <div style={{ background: "#1a1a1a", padding: "28px 16px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <p style={{ fontSize: "clamp(16px, 4.5vw, 20px)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Recebe o Top 10 todos os dias</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Newsletter gratuita. Sem spam.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
              <input type="email" placeholder="o-teu-email@gmail.com" style={{ fontSize: 15, padding: "13px 16px", borderRadius: 10, border: "1px solid #444", background: "#2a2a2a", color: "#fff", outline: "none", width: "100%", minHeight: 48 }} />
              <button style={{ fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, background: "#c0392b", color: "#fff", border: "none", cursor: "pointer", minHeight: 48 }}>Subscrever grátis</button>
            </div>
          </div>
        </div>

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
                <a href="/artigos" className="footer-link">Artigos</a>
                <a href="/sobre" className="footer-link">Sobre</a>
                <a href="/privacidade" className="footer-link">Privacidade</a>
                <a href="/contacto" className="footer-link">Contacto</a>
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
