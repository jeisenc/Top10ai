// Single source of truth for which pages exist and how product links are built.
// The list of categories lives in lib/categories.json so the daily script,
// next.config.js (redirects) and the pages all share it.
import config from "./categories.json";

export const SITE_URL = "https://ai10pt.top";
export const CATEGORIES = config.categories;
export const GROUPS = config.groups;

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

export function categoriesInGroup(group) {
  return CATEGORIES.filter((c) => c.group === group);
}

// Badges shown on the "Escolha rápida" cards, in display order. The daily job
// writes one of the keys as item.tag.
export const PICK_ROLES = [
  { tag: "Melhor escolha", label: "Melhor escolha" },
  { tag: "Melhor qualidade-preço", label: "Melhor qualidade-preço" },
  { tag: "Mais económico", label: "Mais económico" },
  { tag: "Premium", label: "Topo de gama" },
  { tag: "Mais popular", label: "Mais popular" },
];

export function roleLabel(tag) {
  return PICK_ROLES.find((r) => r.tag === tag)?.label || null;
}

// Up to four quick picks: the tagged items in role order, topped up with the
// highest-ranked untagged items when a list has fewer tags.
export function quickPicks(items, max = 4) {
  const picks = [];
  for (const role of PICK_ROLES) {
    const item = items.find((i) => i.tag === role.tag);
    if (item && !picks.includes(item)) picks.push(item);
  }
  for (const item of items) {
    if (picks.length >= max) break;
    if (!picks.includes(item)) picks.push(item);
  }
  return picks.slice(0, max).sort((a, b) => {
    const ra = PICK_ROLES.findIndex((r) => r.tag === a.tag);
    const rb = PICK_ROLES.findIndex((r) => r.tag === b.tag);
    return (ra < 0 ? 99 : ra) - (rb < 0 ? 99 : rb) || a.rank - b.rank;
  });
}

export function brandOf(name) {
  return String(name || "").split(" ")[0];
}

// Price text for a product. Amazon items never show a fixed price.
export function priceText(item) {
  return item.show_price ? `~${item.price_eur} €` : null;
}

export function buyLabel(item) {
  return item.show_price ? `Ver na ${item.store}` : `Ver preço na ${item.store}`;
}

export function inSeason(cat, date = new Date()) {
  return Boolean(cat.season_months?.includes(date.getMonth() + 1));
}

// Days left until Black Friday (last Friday of November), or null once it has
// passed or when it's still too far away to be worth a banner.
export function blackFridayCountdown(date = new Date()) {
  const year = date.getFullYear();
  const bf = new Date(Date.UTC(year, 10, 30));
  while (bf.getUTCDay() !== 5) bf.setUTCDate(bf.getUTCDate() - 1);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((bf - today) / 86400000);
  if (days < 0 || days > 60) return null;
  return { days, label: bf.toLocaleDateString("pt-PT", { day: "numeric", month: "long", timeZone: "UTC" }) };
}

export function formatDateShort(value) {
  if (!value) return "";
  const d = new Date(value);
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
}

export const ARTICLES = [
  { slug: "verao-2026", emoji: "☀️", category: "Tendências", title: "Verão 2026: a IA analisou o que os portugueses mais compram nesta época", readTime: "6 min" },
  { slug: "google-modo-ia", emoji: "🔍", category: "Tecnologia", title: "O Google agora responde com IA — o que é que isso significa para as tuas compras?", readTime: "7 min" },
  { slug: "ia-vs-compras", emoji: "🧪", category: "Teste", title: "Pedi à IA para encontrar as melhores ofertas do mercado português. Funciona?", readTime: "8 min" },
  { slug: "como-confiar-na-ia", emoji: "🤝", category: "Reflexão", title: "Como confiar na IA — sem ser ingénuo nem paranoico", readTime: "5 min" },
];

export const ALL_ARTICLE_SLUGS = [
  "verao-2026", "google-modo-ia", "ia-vs-compras", "como-confiar-na-ia",
  "do-google-para-a-ia", "ia-em-portugal", "ia-e-saude", "ia-preve-compras", "mundial-2026",
];

// ---------------------------------------------------------------------------
// Affiliate links
//
// Set these in Vercel → Settings → Environment Variables once each programme
// approves you. Until then links still work, they just don't earn commission.
//   AWIN_AFFILIATE_ID     your Awin publisher ID (numbers only)
//   AWIN_MID_WORTEN       Worten PT merchant ID on Awin (default 99897)
//   AMAZON_ASSOCIATE_TAG  your Amazon.es tracking ID, e.g. xxxxx-21
// ---------------------------------------------------------------------------
const AWIN_AFFILIATE_ID = process.env.AWIN_AFFILIATE_ID || "";
const AWIN_MERCHANTS = {
  Worten: process.env.AWIN_MID_WORTEN || "99897",
};
const AMAZON_TAG = process.env.AMAZON_ASSOCIATE_TAG || "ai10pt-21";

export const STORES = ["Worten", "Amazon"];

function storeSearchUrl(store, query) {
  const q = encodeURIComponent(query);
  switch (store) {
    case "Worten":
      return `https://www.worten.pt/search?query=${q}`;
    case "Amazon":
    default:
      return `https://www.amazon.es/s?k=${q}`;
  }
}

function withTracking(store, url) {
  if (store === "Amazon" || url.includes("amazon.es")) {
    if (!AMAZON_TAG) return url;
    return url + (url.includes("?") ? "&" : "?") + `tag=${encodeURIComponent(AMAZON_TAG)}`;
  }
  const mid = AWIN_MERCHANTS[store];
  if (mid && AWIN_AFFILIATE_ID) {
    return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_AFFILIATE_ID}&ued=${encodeURIComponent(url)}`;
  }
  return url;
}

// Returns the outbound link for a product. Uses an exact product URL when the
// data has one (e.g. from a retailer feed later on), otherwise a search on the
// retailer for the exact model name.
export function productUrl(item) {
  const store = STORES.includes(item.store) ? item.store : "Amazon";
  const base = item.product_url || storeSearchUrl(store, item.store_url_hint || item.name);
  return withTracking(store, base);
}

export function normaliseStore(store) {
  return STORES.includes(store) ? store : "Amazon";
}

// Amazon's programme rules forbid showing hard-coded prices, so we only show
// an indicative price for non-Amazon retailers.
export function showPrice(item) {
  return normaliseStore(item.store) !== "Amazon" && Number(item.price_eur) > 0;
}

export function formatDatePt(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}
