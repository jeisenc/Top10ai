const Anthropic = require("@anthropic-ai/sdk");
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SYSTEM_PROMPT = `You are a product recommendation engine for aitop10.pt, a Portuguese consumer website.
Generate Top 10 product lists for Portuguese shoppers.
All text must be in European Portuguese (not Brazilian).
Products must be available in Portugal via Worten, Fnac, Amazon.es, Decathlon, or Zalando.
Prices must be realistic in euros.
Return ONLY valid JSON — no markdown, no explanation, no code fences.`;

// Convert text to a URL-friendly slug
function toSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Step 1 — Fetch trending searches from Google Trends for Portugal
async function fetchGoogleTrends() {
  try {
    const response = await fetch(
      "https://trends.google.com/trends/trendingsearches/daily/rss?geo=PT",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const xml = await response.text();

    // Extract titles from RSS feed
    const matches = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
    const trends = matches
      .map(m => m.replace(/<title><!\[CDATA\[/, "").replace(/\]\]><\/title>/, ""))
      .filter(t => t !== "Daily Search Trends")
      .slice(0, 10);

    console.log("Google Trends Portugal:", trends);
    return trends;
  } catch (err) {
    console.log("Could not fetch Google Trends, using fallback:", err.message);
    return [];
  }
}

// Step 2 — Ask Claude to pick the best product category based on trends + season
async function pickCategory(trends, date) {
  const today = new Date(date);
  const month = today.toLocaleString("pt-PT", { month: "long" });
  const season = getSeason(today.getMonth());

  const trendsText = trends.length > 0
    ? `Trending searches in Portugal today: ${trends.join(", ")}`
    : "No trending data available.";

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [{
      role: "user",
      content: `You are helping choose the best product category for a Portuguese shopping website today.

Date: ${date}
Month: ${month}
Season: ${season}
${trendsText}

Based on the trending searches AND the current season/date in Portugal, choose ONE product category that Portuguese consumers are most likely searching for RIGHT NOW.

Consider: seasonal relevance, trending topics, upcoming holidays, weather, back to school, sports seasons etc.

Return ONLY this JSON structure, nothing else:
{
  "category_en": "english-slug-no-spaces",
  "category_pt": "Nome em Português",
  "slug": "slug-em-portugues",
  "reasoning": "brief explanation of why this category was chosen"
}`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw);
}

// Step 3 — Generate the Top 10 list for the chosen category
async function generateList(category, date) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: "user",
      content: `Category: ${category.category_pt}
Date: ${date}

Generate a Top 10 product list. Return this exact JSON structure:
{
  "category": "${category.category_en}",
  "category_pt": "${category.category_pt}",
  "slug": "${category.slug}",
  "date": "${date}",
  "headline": "one punchy sentence in Portuguese summarising the list",
  "items": [
    {
      "rank": 1,
      "name": "Brand + Model",
      "price_eur": 99,
      "store": "Worten",
      "store_url_hint": "search query to find it",
      "reason_pt": "1-2 sentences in Portuguese explaining why recommended",
      "tag": "Melhor escolha"
    }
  ]
}

Tags must be one of: Melhor escolha, Melhor preço, Mais vendido, Premium, Económico
Return only the JSON. Nothing else.`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw);
}

function getSeason(month) {
  if (month >= 2 && month <= 4) return "Spring (Primavera)";
  if (month >= 5 && month <= 7) return "Summer (Verão)";
  if (month >= 8 && month <= 10) return "Autumn (Outono)";
  return "Winter (Inverno)";
}

async function main() {
  const today = new Date().toISOString().split("T")[0];
  console.log(`\n🚀 Starting daily generation for ${today}`);

  // Step 1 — Get Google Trends
  console.log("\n📈 Fetching Google Trends for Portugal...");
  const trends = await fetchGoogleTrends();

  // Step 2 — Claude picks the best category
  console.log("\n🤖 Asking Claude to pick today's category...");
  const category = await pickCategory(trends, today);
  console.log(`✅ Category chosen: ${category.category_pt} (${category.slug})`);
  console.log(`   Reason: ${category.reasoning}`);

  // Step 3 — Generate the Top 10
  console.log("\n📝 Generating Top 10 list...");
  const list = await generateList(category, today);
  console.log(`✅ Generated ${list.items.length} items`);

  // Step 4 — Save to Supabase
  console.log("\n💾 Saving to Supabase...");
  const { error } = await supabase.from("daily_lists").insert(list);
  if (error) {
    console.error("❌ Supabase error:", error);
    process.exit(1);
  }

  console.log(`\n✅ Done! Today's Top 10: ${category.category_pt}`);
  console.log(`   URL will be: ai10pt.top/${category.slug}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
