const Anthropic = require("@anthropic-ai/sdk");
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIES = [
  { en: "wireless-headphones", pt: "Auscultadores",      slug: "auscultadores" },
  { en: "robot-vacuums",       pt: "Robots aspiradores", slug: "robots-aspiradores" },
  { en: "running-shoes",       pt: "Sapatilhas",         slug: "sapatilhas" },
  { en: "air-fryers",          pt: "Fritadeiras de ar",  slug: "fritadeiras-de-ar" },
  { en: "laptops",             pt: "Portáteis",          slug: "portateis" },
  { en: "sunscreen",           pt: "Protetor solar",     slug: "protetor-solar" },
  { en: "summer-dresses",      pt: "Moda verão",         slug: "moda-verao" },
];

const SYSTEM_PROMPT = `You are a product recommendation engine for aitop10.pt, a Portuguese consumer website.
Generate Top 10 product lists for Portuguese shoppers.
All text must be in European Portuguese (not Brazilian).
Products must be available in Portugal via Worten, Fnac, Amazon.es, Decathlon, or Zalando.
Prices must be realistic in euros.
Return ONLY valid JSON — no markdown, no explanation, no code fences.`;

async function generateList(category, date) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: "user",
      content: `Category: ${category.pt}
Date: ${date}

Generate a Top 10 product list. Return this exact JSON structure:
{
  "category": "${category.en}",
  "category_pt": "${category.pt}",
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
    }],
  });

  let raw = msg.content[0].text.trim();
// Strip markdown code fences if Claude added them
raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
return JSON.parse(raw);
}

async function main() {
  const today = new Date().toISOString().split("T")[0];
  const dayIndex = Math.floor(Date.now() / 86400000) % CATEGORIES.length;
  const category = CATEGORIES[dayIndex];

  console.log(`Generating Top 10 for: ${category.pt} — ${today}`);

  const list = await generateList(category, today);
  console.log("Generated successfully. Saving to Supabase...");

  const { error } = await supabase.from("daily_lists").insert(list);
  if (error) {
    console.error("Supabase error:", error);
    process.exit(1);
  }

  console.log("Done! List saved to database.");

// Tell Vercel to refresh all pages
const revalidateUrl = `https://ai10pt.top/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`;
await fetch(revalidateUrl, { method: "POST" });
console.log("Vercel cache cleared.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
