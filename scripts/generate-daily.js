// Daily refresh job.
//
// The site now has a FIXED set of guides (lib/categories.json). Each run picks
// the guides that are stalest (never generated, or oldest update) and
// regenerates them. It never invents new categories.
//
// Env:
//   ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (required)
//   ANTHROPIC_MODEL     model to use (default claude-sonnet-5-5)
//   REFRESH_PER_RUN     how many guides to refresh per run (default 2)
//   MIN_AGE_DAYS        don't refresh a guide updated less than this many days ago (default 3)
//   ONLY_SLUG           refresh just this one guide (handy for manual runs)
//   YOUTUBE_API_KEY, GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID   (optional extras)
//   REVALIDATE_SECRET   (optional) clears the Vercel cache after saving

const Anthropic = require("@anthropic-ai/sdk");
const { createClient } = require("@supabase/supabase-js");
const ws = require("ws");
const { categories } = require("../lib/categories.json");

const SITE = "https://ai10pt.top";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const REFRESH_PER_RUN = parseInt(process.env.REFRESH_PER_RUN || "2", 10);
const MIN_AGE_DAYS = parseFloat(process.env.MIN_AGE_DAYS || "3");
const STORES = ["Worten", "Amazon"];
const TAGS = ["Melhor escolha", "Melhor qualidade-preço", "Mais económico", "Premium", "Mais popular"];

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
);

const SYSTEM_PROMPT = `You write product buying guides for ai10pt.top, a website for shoppers in Portugal.
All text must be in European Portuguese (Portugal), never Brazilian Portuguese.
Only recommend real, specific models (brand + exact model name) that are actually sold in Portugal in ${new Date().getFullYear()}, at Worten (worten.pt) or Amazon (amazon.es, which ships to Portugal).
Prefer current or recent models; do not recommend discontinued products.
Prices are the typical Portuguese retail price in euros, rounded — they will be shown as "indicative".
Never invent discounts, ratings, test results or claims you are not confident about.
Always answer by calling the "save" tool with the requested fields.`;

// GitHub Actions shows these as annotations on the run page.
function annotate(level, message) {
  if (!process.env.GITHUB_ACTIONS) return;
  const clean = String(message).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  console.log(`::${level}::${clean}`);
}

const LIST_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rank: { type: "integer" },
          name: { type: "string" },
          price_eur: { type: "number" },
          store: { type: "string", enum: STORES },
          store_url_hint: { type: "string" },
          reason_pt: { type: "string" },
          tag: { type: "string" },
        },
        required: ["rank", "name", "price_eur", "store", "store_url_hint", "reason_pt"],
      },
    },
  },
  required: ["headline", "items"],
};

const FAQ_SCHEMA = {
  type: "object",
  properties: {
    faqs: {
      type: "array",
      items: {
        type: "object",
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
  },
  required: ["faqs"],
};

// Forces the model to answer through a tool with a JSON schema, so the reply
// is always well-formed data. Retries once on a bad or cut-off reply.
async function ask(prompt, maxTokens, schema) {
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const msg = await anthropic.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        tools: [{ name: "save", description: "Save the result.", input_schema: schema }],
        tool_choice: { type: "tool", name: "save" },
        messages: [{ role: "user", content: prompt }],
      });
      if (msg.stop_reason === "max_tokens") throw new Error("reply was cut off (max_tokens)");
      const block = msg.content.find((b) => b.type === "tool_use");
      if (!block) throw new Error("no structured reply");
      return block.input;
    } catch (err) {
      lastErr = err;
      console.log(`  attempt ${attempt} failed: ${err.message}`);
    }
  }
  throw lastErr;
}

async function lastUpdated() {
  const { data, error } = await supabase
    .from("daily_lists")
    .select("slug, created_at")
    .in("slug", categories.map((c) => c.slug))
    .order("created_at", { ascending: false });
  if (error) throw error;
  const latest = {};
  for (const row of data || []) if (!latest[row.slug]) latest[row.slug] = new Date(row.created_at);
  return latest;
}

async function pickCategories() {
  if (process.env.ONLY_SLUG) {
    const one = categories.find((c) => c.slug === process.env.ONLY_SLUG);
    if (!one) throw new Error(`Unknown ONLY_SLUG: ${process.env.ONLY_SLUG}`);
    return [one];
  }
  const latest = await lastUpdated();
  const now = Date.now();
  return categories
    .map((c, order) => ({ c, order, age: latest[c.slug] ? (now - latest[c.slug]) / 86400000 : Infinity }))
    .filter((x) => x.age >= MIN_AGE_DAYS)
    // Never-generated first, then oldest; ties keep the config order (vacuums first).
    .sort((a, b) => (b.age === a.age ? a.order - b.order : b.age - a.age))
    .slice(0, REFRESH_PER_RUN)
    .map((x) => x.c);
}

async function generateList(cat, date) {
  const data = await ask(
    `Guide: "${cat.name}" (page title: "${cat.title}")
What to include: ${cat.brief}
Date: ${date}

Return this JSON with exactly 10 items, ranked best first:
{
  "headline": "one or two sentences in Portuguese introducing the guide and who it is for",
  "items": [
    {
      "rank": 1,
      "name": "Brand Exact Model",
      "price_eur": 199,
      "store": "Worten",
      "store_url_hint": "Brand Exact Model",
      "reason_pt": "2 sentences in Portuguese: who it is for and the main strength/trade-off",
      "tag": "Melhor escolha"
    }
  ]
}
Rules:
- "store" must be "Worten" or "Amazon". Use "Worten" whenever Worten normally sells that model.
- "store_url_hint" is the exact model name to search for on that store.
- "tag" is optional; when used it must be one of: ${TAGS.join(", ")}. Use each tag at most once.
Return only JSON.`,
    8000,
    LIST_SCHEMA
  );

  const items = (data.items || []).slice(0, 10).map((item, i) => ({
    rank: i + 1,
    name: String(item.name || "").trim(),
    price_eur: Math.round(Number(item.price_eur) || 0),
    store: STORES.includes(item.store) ? item.store : "Amazon",
    store_url_hint: String(item.store_url_hint || item.name || "").trim(),
    reason_pt: String(item.reason_pt || "").trim(),
    tag: TAGS.includes(item.tag) ? item.tag : null,
  })).filter((item) => item.name);

  if (items.length < 5) throw new Error(`Only ${items.length} usable items for ${cat.slug}`);
  return { headline: data.headline, items };
}

async function generateFAQs(cat) {
  const data = await ask(
    `Write 6 FAQs in European Portuguese for a buying guide about "${cat.name}".
Use the questions Portuguese shoppers actually type into Google (e.g. "qual o melhor...", "vale a pena...", "quanto custa...").
Answers: 2-3 practical sentences, no specific prices unless it is a range.
Return ONLY: { "faqs": [ { "question": "...", "answer": "..." } ] }`,
    3000,
    FAQ_SCHEMA
  );
  return data.faqs || [];
}

async function fetchYouTubeVideo(productName) {
  if (!process.env.YOUTUBE_API_KEY) return null;
  try {
    const q = encodeURIComponent(`${productName} análise review`);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&relevanceLanguage=pt&regionCode=PT&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`);
    const video = (await res.json()).items?.[0];
    if (!video) return null;
    return {
      videoId: video.id.videoId,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails?.medium?.url || null,
    };
  } catch (err) {
    console.log(`  YouTube lookup failed for ${productName}: ${err.message}`);
    return null;
  }
}

async function fetchProductImage(productName) {
  if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) return null;
  try {
    const q = encodeURIComponent(productName);
    const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${q}&searchType=image&num=1&imgSize=medium&safe=active`);
    return (await res.json()).items?.[0]?.link || null;
  } catch (err) {
    console.log(`  Image lookup failed for ${productName}: ${err.message}`);
    return null;
  }
}

async function pingIndexNow(urls) {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: "ai10pt.top", key: "aitop10pt-indexnow", urlList: urls }),
    });
    console.log(`IndexNow: ${res.status}`);
  } catch (err) {
    console.log(`IndexNow failed: ${err.message}`);
  }
}

async function revalidateSite() {
  if (!process.env.REVALIDATE_SECRET) {
    annotate("warning", "REVALIDATE_SECRET not set: pages will update within the hour instead of immediately");
    return;
  }
  try {
    const res = await fetch(`${SITE}/api/revalidate?secret=${encodeURIComponent(process.env.REVALIDATE_SECRET)}`, { method: "POST" });
    console.log(`Cache refresh: ${res.status}`);
    if (!res.ok) annotate("warning", `Cache refresh returned ${res.status}`);
  } catch (err) {
    console.log(`Cache refresh failed: ${err.message}`);
  }
}

async function refresh(cat, date) {
  console.log(`\n📝 Refreshing ${cat.name} (/${cat.slug})`);
  const list = await generateList(cat, date);
  const faqs = await generateFAQs(cat);

  for (const item of list.items) {
    const video = await fetchYouTubeVideo(item.name);
    if (video) item.youtube = video;
    const image = await fetchProductImage(item.name);
    if (image) item.image_url = image;
    await new Promise((r) => setTimeout(r, 300));
  }

  const row = {
    category: cat.category_en,
    category_pt: cat.name,
    slug: cat.slug,
    date,
    headline: list.headline,
    items: list.items,
    faqs,
  };
  const { error } = await supabase.from("daily_lists").insert(row);
  if (error) throw error;
  console.log(`✅ Saved ${list.items.length} items, ${faqs.length} FAQs`);
  annotate("notice", `${cat.slug}: saved ${list.items.length} items, ${faqs.length} FAQs`);
}

async function main() {
  const date = new Date().toISOString().split("T")[0];
  console.log(`🚀 Refresh run ${date} — model ${MODEL}`);

  const todo = await pickCategories();
  if (!todo.length) {
    console.log("Nothing is due for a refresh. Done.");
    return;
  }
  console.log(`Due: ${todo.map((c) => c.slug).join(", ")}`);

  const done = [];
  for (const cat of todo) {
    try {
      await refresh(cat, date);
      done.push(cat);
    } catch (err) {
      console.error(`❌ ${cat.slug}: ${err.message}`);
      annotate("error", `${cat.slug}: ${err.message}`);
    }
  }

  if (done.length) {
    await revalidateSite();
    await pingIndexNow([SITE, ...done.map((c) => `${SITE}/${c.slug}`), `${SITE}/sitemap.xml`]);
  }
  console.log(`\nDone: ${done.length}/${todo.length} refreshed.`);
  if (done.length < todo.length) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  annotate("error", `Fatal: ${err.message || err}`);
  process.exit(1);
});
