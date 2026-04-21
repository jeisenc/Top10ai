const Anthropic = require("@anthropic-ai/sdk");
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SYSTEM_PROMPT = `You are a product recommendation engine for ai10pt.top, a Portuguese consumer website.
Generate Top 10 product lists for Portuguese shoppers.
All text must be in European Portuguese (not Brazilian).
Products must be available in Portugal via Worten, Fnac, Amazon.es, Decathlon, or Zalando.
Prices must be realistic in euros.
Return ONLY valid JSON — no markdown, no explanation, no code fences.`;

function toSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function fetchGoogleTrends() {
  try {
    const response = await fetch(
      "https://trends.google.com/trends/trendingsearches/daily/rss?geo=PT",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const xml = await response.text();
    const matches = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
    const trends = matches
      .map(m => m.replace(/<title><!\[CDATA\[/, "").replace(/\]\]><\/title>/, ""))
      .filter(t => t !== "Daily Search Trends")
      .slice(0, 10);
    console.log("Google Trends Portugal:", trends);
    return trends;
  } catch (err) {
    console.log("Could not fetch Google Trends:", err.message);
    return [];
  }
}

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
      content: `Choose the best product category for a Portuguese shopping website today.
Date: ${date}, Month: ${month}, Season: ${season}
${trendsText}

Return ONLY this JSON:
{
  "category_en": "english-slug",
  "category_pt": "Nome em Português",
  "slug": "slug-portugues",
  "reasoning": "brief explanation"
}`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw);
}

async function generateList(category, date) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: "user",
      content: `Category: ${category.category_pt}
Date: ${date}

Generate Top 10. Return this JSON:
{
  "category": "${category.category_en}",
  "category_pt": "${category.category_pt}",
  "slug": "${category.slug}",
  "date": "${date}",
  "headline": "sentence in Portuguese",
  "items": [
    {
      "rank": 1,
      "name": "Brand Model",
      "price_eur": 99,
      "store": "Worten",
      "store_url_hint": "search query",
      "reason_pt": "1-2 sentences in Portuguese",
      "tag": "Melhor escolha"
    }
  ]
}
Tags: Melhor escolha, Melhor preço, Mais vendido, Premium, Económico
Return only JSON.`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw);
}

async function generateFAQs(category) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `Generate 7 FAQs in European Portuguese about: "${category.category_pt}"
Real questions Portuguese consumers search on Google.
Return ONLY this JSON:
{
  "faqs": [
    { "question": "Qual é o melhor...?", "answer": "Resposta em 2-3 frases." }
  ]
}`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw).faqs;
}

// Fetch best Portuguese YouTube review for a product
async function fetchYouTubeVideo(productName) {
  try {
    const query = encodeURIComponent(`${productName} review análise português portugal`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&relevanceLanguage=pt&regionCode=PT&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      // Pick first result that has a reasonable title
      const video = data.items[0];
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails?.medium?.url || null,
      };
    }
    return null;
  } catch (err) {
    console.log(`  Could not fetch YouTube video for ${productName}:`, err.message);
    return null;
  }
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

  // Step 1 — Google Trends
  console.log("\n📈 Fetching Google Trends for Portugal...");
  const trends = await fetchGoogleTrends();

  // Step 2 — Pick category
  console.log("\n🤖 Asking Claude to pick today's category...");
  const category = await pickCategory(trends, today);
  console.log(`✅ Category: ${category.category_pt} (${category.slug})`);
  console.log(`   Reason: ${category.reasoning}`);

  // Step 3 — Generate Top 10
  console.log("\n📝 Generating Top 10 list...");
  const list = await generateList(category, today);
  console.log(`✅ Generated ${list.items.length} items`);

  // Step 4 — Generate FAQs
  console.log("\n❓ Generating FAQs...");
  const faqs = await generateFAQs(category);
  list.faqs = faqs;
  console.log(`✅ Generated ${faqs.length} FAQs`);

  // Step 5 — Fetch YouTube videos for each product
  console.log("\n🎬 Fetching YouTube videos...");
  for (let i = 0; i < list.items.length; i++) {
    const item = list.items[i];
    console.log(`  Searching video for: ${item.name}...`);
    const video = await fetchYouTubeVideo(item.name);
    if (video) {
      item.youtube = video;
      console.log(`  ✅ Found: ${video.title}`);
    } else {
      console.log(`  ⚠️  No video found`);
    }
    // Small delay to avoid YouTube API rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  // Step 6 — Save to Supabase
  console.log("\n💾 Saving to Supabase...");
  const { error } = await supabase.from("daily_lists").insert(list);
  if (error) {
    console.error("❌ Supabase error:", error);
    process.exit(1);
  }

  console.log(`\n✅ Done! Today's Top 10: ${category.category_pt}`);
  console.log(`   URL: ai10pt.top/${category.slug}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
