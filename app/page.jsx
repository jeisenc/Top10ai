"use client";

/**
 * top10.pt — Daily AI Top 10 Page
 * 
 * FILE STRUCTURE (paste into your Next.js project):
 * 
 *   app/
 *     page.jsx              ← This file (home page, shows today's list)
 *     [category]/
 *       page.jsx            ← Reuse same component, pass category as prop
 *   lib/
 *     supabase.js           ← Supabase client (paste snippet at bottom)
 * 
 * DEPENDENCIES:
 *   npm install @supabase/supabase-js
 * 
 * ENV VARS (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 * 
 * SUPABASE TABLE (run in SQL editor):
 *   create table daily_lists (
 *     id uuid default gen_random_uuid() primary key,
 *     category text,
 *     category_pt text,
 *     date date,
 *     headline text,
 *     items jsonb,
 *     created_at timestamptz default now()
 *   );
 */

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Affiliate link builder ────────────────────────────────────────────────────
// Replace TAG with your actual Amazon Associates / AWIN IDs
function buildAffiliateUrl(store, hint) {
  const encoded = encodeURIComponent(hint);
  switch (store) {
    case "Amazon":
      return `https://www.amazon.es/s?k=${encoded}&tag=top10pt-21`;
    case "Worten":
      return `https://www.worten.pt/search?query=${encoded}`;
    case "Fnac":
      return `https://www.fnac.pt/SearchResult/ResultList.aspx?SCat=0&Search=${encoded}`;
    case "Decathlon":
      return `https://www.decathlon.pt/search?Ntt=${encoded}`;
    case "Zalando":
      return `https://www.zalando.pt/catalog/?q=${encoded}`;
    default:
      return `https://www.google.pt/search?q=${encoded}`;
  }
}

// ─── Tag colours ──────────────────────────────────────────────────────────────
const TAG_STYLES = {
  "Melhor escolha": { bg: "#1a1a1a", color: "#fff" },
  "Melhor preço":   { bg: "#0f6e56", color: "#fff" },
  "Mais vendido":   { bg: "#185fa5", color: "#fff" },
  "Premium":        { bg: "#534ab7", color: "#fff" },
  "Económico":      { bg: "#ba7517", color: "#fff" },
};

// ─── Category nav ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { en: "all",                   pt: "Todos" },
  { en: "wireless-headphones",   pt: "Auscultadores" },
  { en: "robot-vacuums",         pt: "Robots aspiradores" },
  { en: "running-shoes",         pt: "Sapatilhas" },
  { en: "air-fryers",            pt: "Fritadeiras de ar" },
  { en: "laptops",               pt: "Portáteis" },
  { en: "sunscreen",             pt: "Protetor solar" },
  { en: "summer-dresses",        pt: "Moda verão" },
];

// ─── Store badge colour ───────────────────────────────────────────────────────
const STORE_COLORS = {
  Worten:    { bg: "#fff0e6", color: "#b34700" },
  Fnac:      { bg: "#fff0e0", color: "#9a6000" },
  Amazon:    { bg: "#fff8e0", color: "#8a6000" },
  Decathlon: { bg: "#e8f4ff", color: "#004899" },
  Zalando:   { bg: "#fff0f3", color: "#9b1b30" },
};

// ─── Rank medal ───────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 22, lineHeight: 1 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 22, lineHeight: 1 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 22, lineHeight: 1 }}>🥉</span>;
  return (
    <span style={{
      fontSize: 15, fontWeight: 600, color: "#888",
      minWidth: 28, textAlign: "center", display: "inline-block"
    }}>
      {rank}
    </span>
  );
}

// ─── Single product card ──────────────────────────────────────────────────────
function ProductCard({ item, index }) {
  const tag = TAG_STYLES[item.tag] || { bg: "#eee", color: "#333" };
  const store = STORE_COLORS[item.store] || { bg: "#f5f5f5", color: "#333" };
  const url = buildAffiliateUrl(item.store, item.store_url_hint);
  const isTop3 = item.rank <= 3;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      padding: "18px 20px",
      background: "#fff",
      border: isTop3 ? "1.5px solid #1a1a1a" : "1px solid #e5e5e5",
      borderRadius: 12,
      animation: `fadeUp 0.3s ease both`,
      animationDelay: `${index * 60}ms`,
    }}>
      {/* Rank */}
      <div style={{ minWidth: 32, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 2 }}>
        <RankBadge rank={item.rank} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{
            fontSize: 15, fontWeight: 700, color: "#0f0f0f",
            fontFamily: "'Playfair Display', Georgia, serif",
            lineHeight: 1.3,
          }}>
            {item.name}
          </span>
          {item.tag && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
              textTransform: "uppercase", padding: "3px 8px",
              borderRadius: 4, background: tag.bg, color: tag.color,
              whiteSpace: "nowrap",
            }}>
              {item.tag}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 8px", lineHeight: 1.5 }}>
          {item.reason_pt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px",
            borderRadius: 4, background: store.bg, color: store.color,
            textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            {item.store}
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.5px" }}>
          €{item.price_eur}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            fontSize: 12, fontWeight: 700, padding: "7px 14px",
            background: "#0f0f0f", color: "#fff", borderRadius: 6,
            textDecoration: "none", whiteSpace: "nowrap",
            letterSpacing: "0.3px", transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.target.style.opacity = "0.8"}
          onMouseLeave={e => e.target.style.opacity = "1"}
        >
          Ver oferta →
        </a>
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      display: "flex", gap: 16, padding: "18px 20px",
      background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
    }}>
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Top10Page() {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const today = new Date().toISOString().split("T")[0];
  const todayFormatted = new Date().toLocaleDateString("pt-PT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("daily_lists")
        .select("*")
        .eq("date", today)
        .order("created_at", { ascending: false })
        .limit(1);

      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }

      const { data, error } = await query.single();

      if (error) {
        // Fallback: get most recent list if today's isn't ready yet
        const { data: fallback } = await supabase
          .from("daily_lists")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        setList(fallback || null);
        if (!fallback) setError("Nenhuma lista disponível.");
      } else {
        setList(data);
      }

      setLoading(false);
    }

    fetchList();
  }, [activeCategory, today]);

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f7f6f2;
          color: #0f0f0f;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
        }

        .cat-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1px solid #ddd;
          background: #fff;
          color: #555;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .cat-btn:hover { border-color: #999; color: #0f0f0f; }
        .cat-btn.active { background: #0f0f0f; color: #fff; border-color: #0f0f0f; }

        @media (max-width: 640px) {
          .product-card-price { display: none; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f7f6f2" }}>

        {/* ── Header ── */}
        <header style={{
          background: "#0f0f0f",
          padding: "0 24px",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{
            maxWidth: 780, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            height: 56,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.5px",
              }}>
                top
              </span>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22, fontWeight: 800, color: "#e8593c",
              }}>
                10
              </span>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22, fontWeight: 800, color: "#fff",
              }}>
                .pt
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e", display: "inline-block",
              }} />
              <span style={{ fontSize: 12, color: "#aaa" }}>
                Atualizado hoje
              </span>
            </div>
          </div>
        </header>

        {/* ── Category nav ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{
            maxWidth: 780, margin: "0 auto", padding: "12px 24px",
            display: "flex", gap: 8, overflowX: "auto",
            scrollbarWidth: "none",
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.en}
                className={`cat-btn${activeCategory === cat.en ? " active" : ""}`}
                onClick={() => setActiveCategory(cat.en)}
              >
                {cat.pt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main content ── */}
        <main style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>

          {/* Date + headline */}
          <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "1px",
              textTransform: "uppercase", color: "#e8593c", marginBottom: 6,
            }}>
              Top 10 do dia
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(26px, 5vw, 36px)",
              fontWeight: 800, lineHeight: 1.15,
              color: "#0f0f0f", marginBottom: 10,
              letterSpacing: "-0.5px",
            }}>
              {loading ? "A carregar..." : list?.category_pt || "Os melhores produtos"}
            </h1>
            {!loading && list?.headline && (
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, maxWidth: 580 }}>
                {list.headline}
              </p>
            )}
            <div style={{
              marginTop: 12, fontSize: 12, color: "#aaa",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>{todayFormatted}</span>
              <span>·</span>
              <span style={{
                background: "#f0f0f0", padding: "2px 8px",
                borderRadius: 4, fontSize: 11, color: "#888",
              }}>
                Selecionado por IA
              </span>
            </div>
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : error ? (
              <div style={{
                padding: 40, textAlign: "center",
                background: "#fff", borderRadius: 12, color: "#888",
              }}>
                <p style={{ fontSize: 15 }}>{error}</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>
                  Tenta novamente mais tarde ou escolhe outra categoria.
                </p>
              </div>
            ) : list?.items?.length > 0 ? (
              list.items
                .sort((a, b) => a.rank - b.rank)
                .map((item, i) => (
                  <ProductCard key={item.rank} item={item} index={i} />
                ))
            ) : (
              <div style={{
                padding: 40, textAlign: "center",
                background: "#fff", borderRadius: 12, color: "#888",
              }}>
                <p>Nenhum produto encontrado para esta categoria hoje.</p>
              </div>
            )}
          </div>

          {/* Footer note */}
          {!loading && list && (
            <p style={{
              marginTop: 24, fontSize: 11, color: "#bbb",
              textAlign: "center", lineHeight: 1.6,
              animation: "fadeUp 0.4s ease both",
            }}>
              Esta lista foi gerada por inteligência artificial com base em produtos disponíveis em Portugal.
              Os links são links de afiliado — ao comprar através deles apoias o top10.pt sem custo adicional.
            </p>
          )}
        </main>

        {/* ── Newsletter bar ── */}
        <div style={{
          background: "#0f0f0f", padding: "32px 24px",
          marginTop: 48,
        }}>
          <div style={{
            maxWidth: 780, margin: "0 auto",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between", gap: 20,
          }}>
            <div>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4,
              }}>
                Recebe o Top 10 todos os dias
              </p>
              <p style={{ fontSize: 13, color: "#888" }}>
                Newsletter gratuita. Sem spam. Cancela quando quiseres.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="o-teu-email@gmail.com"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, padding: "10px 16px",
                  borderRadius: 8, border: "1px solid #333",
                  background: "#1a1a1a", color: "#fff",
                  outline: "none", width: 220,
                }}
              />
              <button style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 700,
                padding: "10px 18px", borderRadius: 8,
                background: "#e8593c", color: "#fff",
                border: "none", cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                Subscrever
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * lib/supabase.js  — paste this into your project
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * import { createClient } from "@supabase/supabase-js";
 *
 * export const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 * );
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * scripts/generate-daily.js  — run via GitHub Actions cron (paste separately)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This script runs every day at 06:00 UTC and populates Supabase.
 * Trigger with:  node scripts/generate-daily.js
 *
 * const Anthropic = require("@anthropic-ai/sdk");
 * const { createClient } = require("@supabase/supabase-js");
 *
 * const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 * const supabase = createClient(
 *   process.env.SUPABASE_URL,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY   // use service role for server-side writes
 * );
 *
 * const CATEGORIES = [
 *   { en: "wireless-headphones",  pt: "Auscultadores wireless" },
 *   { en: "robot-vacuums",        pt: "Robots aspiradores" },
 *   { en: "running-shoes",        pt: "Sapatilhas de corrida" },
 *   { en: "air-fryers",           pt: "Fritadeiras de ar" },
 *   { en: "laptops",              pt: "Portáteis até 800€" },
 *   { en: "sunscreen",            pt: "Protetor solar" },
 *   { en: "summer-dresses",       pt: "Vestidos de verão" },
 * ];
 *
 * const SYSTEM_PROMPT = `You are a product recommendation engine for top10.pt.
 * Generate Top 10 lists for Portuguese shoppers.
 * All text must be in European Portuguese.
 * Products must be available via Worten, Fnac, Amazon.es, Decathlon, or Zalando.
 * Return ONLY valid JSON — no markdown, no explanation.`;
 *
 * async function generateList(category, date) {
 *   const msg = await anthropic.messages.create({
 *     model: "claude-sonnet-4-20250514",
 *     max_tokens: 1000,
 *     system: SYSTEM_PROMPT,
 *     messages: [{
 *       role: "user",
 *       content: `Category: ${category.pt}\nDate: ${date}\n\nGenerate Top 10. Return JSON:\n{"category":"${category.en}","category_pt":"${category.pt}","date":"${date}","headline":"string","items":[{"rank":1,"name":"string","price_eur":number,"store":"Worten|Fnac|Amazon|Decathlon|Zalando","store_url_hint":"string","reason_pt":"string","tag":"Melhor escolha|Melhor preço|Mais vendido|Premium|Económico"}]}`
 *     }],
 *   });
 *   return JSON.parse(msg.content[0].text);
 * }
 *
 * async function main() {
 *   const today = new Date().toISOString().split("T")[0];
 *   const dayIndex = Math.floor(Date.now() / 86400000) % CATEGORIES.length;
 *   const category = CATEGORIES[dayIndex];
 *
 *   console.log(`Generating: ${category.pt} for ${today}`);
 *   const list = await generateList(category, today);
 *   const { error } = await supabase.from("daily_lists").insert(list);
 *   if (error) throw error;
 *   console.log("Done. Saved to Supabase.");
 * }
 *
 * main().catch(console.error);
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * .github/workflows/daily-generate.yml  — GitHub Actions cron trigger
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * name: Generate daily Top 10
 * on:
 *   schedule:
 *     - cron: "0 6 * * *"   # 06:00 UTC every day
 *   workflow_dispatch:        # allow manual trigger
 * jobs:
 *   generate:
 *     runs-on: ubuntu-latest
 *     steps:
 *       - uses: actions/checkout@v4
 *       - uses: actions/setup-node@v4
 *         with: { node-version: "20" }
 *       - run: npm ci
 *       - run: node scripts/generate-daily.js
 *         env:
 *           ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
 *           SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
 *           SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
 */
