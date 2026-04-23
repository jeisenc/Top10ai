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

async function getRecentSlugs() {
  // Get the last 14 days of categories to avoid repeats
  const { data } = await supabase
    .from("daily_lists")
    .select("slug, category_pt, created_at")
    .order("created_at", { ascending: false })
    .limit(14);
  return data || [];
}

async function checkAlreadyGeneratedToday(today) {
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;
  const { data } = await supabase
    .from("daily_lists")
    .select("id, category_pt, created_at")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .limit(1);
  return data && data.length > 0 ? data[0] : null;
}

async function pickCategory(trends, date, recentSlugs) {
  const today = new Date(date);
  const month = today.toLocaleString("pt-PT", { month: "long" });
  const season = getSeason(today.getMonth());
  const trendsText = trends.length > 0
    ? `Trending searches in Portugal today: ${trends.join(", ")}`
    : "No trending data available.";

  const recentText = recentSlugs.length > 0
    ? `Recent categories (DO NOT repeat or use similar variations of these): ${recentSlugs.map(r => `${r.category_pt} (${r.slug})`).join(", ")}`
    : "";

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [{
      role: "user",
      content: `Choose the best product category for a Portuguese shopping website today.
Date: ${date}, Month: ${month}, Season: ${season}
${trendsText}
${recentText}

Rules:
- NEVER pick a category that is the same or similar to any recent category listed above
- If garden/outdoor was recent, pick something completely different
- Choose a specific, distinct category — not a vague variation of something recent
- Must be a product category people in Portugal are searching for RIGHT NOW

Return ONLY this JSON:
{
  "category_en": "english-slug",
  "category_pt": "Nome em Português",
  "slug": "slug-em-portugues",
  "reasoning": "brief explanation of why this is fresh and relevant"
}`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw);
}

async function generateVoteOptions(trends, date, todayCategory) {
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
      content: `Generate 4 voting options for a "guess tomorrow's Top 10 category" poll on a Portuguese shopping website.

Context:
- Date: ${date}, Month: ${month}, Season: ${season}
- ${trendsText}
- Today's category was: ${todayCategory}

Rules:
- All 4 options must be different from today's category
- Short names in European Portuguese (2-4 words max)
- Mix of trending, seasonal and evergreen categories
- Make them genuinely hard to guess

Return ONLY this JSON:
{
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw).options;
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
  "headline": "one punchy sentence in Portuguese summarising the list",
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

async function fetchYouTubeVideo(productName) {
  if (!process.env.YOUTUBE_API_KEY) return null;
  try {
    const query = encodeURIComponent(`${productName} review análise português portugal`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&relevanceLanguage=pt&regionCode=PT&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
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
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  console.log(`\n🚀 Starting daily generation for ${today}`);

  // ✅ GUARD: Check if already generated today
  console.log("\n🔍 Checking if already generated today...");
  const existing = await checkAlreadyGeneratedToday(today);
  if (existing) {
    console.log(`⚠️  Already generated today: ${existing.category_pt} at ${existing.created_at}`);
    console.log("🛑 Stopping to prevent duplicates.");
    process.exit(0);
  }
  console.log("✅ No list generated yet today — proceeding.");

  // Step 1 — Google Trends
  console.log("\n📈 Fetching Google Trends for Portugal...");
  const trends = await fetchGoogleTrends();

  // Step 2 — Get recent categories to avoid
  console.log("\n📋 Fetching recent categories to avoid...");
  const recentSlugs = await getRecentSlugs();
  console.log(`   Recent: ${recentSlugs.map(r => r.slug).join(", ")}`);

  // Step 3 — Pick category (avoiding recent ones)
  console.log("\n🤖 Asking Claude to pick today's category...");
  const category = await pickCategory(trends, today, recentSlugs);
  console.log(`✅ Category: ${category.category_pt} (${category.slug})`);
  console.log(`   Reason: ${category.reasoning}`);

  // Step 4 — Generate Top 10
  console.log("\n📝 Generating Top 10 list...");
  const list = await generateList(category, today);
  console.log(`✅ Generated ${list.items.length} items`);

  // Step 5 — Generate FAQs
  console.log("\n❓ Generating FAQs...");
  const faqs = await generateFAQs(category);
  list.faqs = faqs;
  console.log(`✅ Generated ${faqs.length} FAQs`);

  // Step 6 — YouTube videos
  console.log("\n🎬 Fetching YouTube videos...");
  for (let i = 0; i < list.items.length; i++) {
    const item = list.items[i];
    console.log(`  Searching: ${item.name}...`);
    const video = await fetchYouTubeVideo(item.name);
    if (video) {
      item.youtube = video;
      console.log(`  ✅ Found: ${video.title}`);
    } else {
      console.log(`  ⚠️  No video found`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // Step 7 — Generate tomorrow's vote options
  console.log("\n🗳️  Generating tomorrow's vote options...");
  const voteOptions = await generateVoteOptions(trends, tomorrowDate, category.category_pt);
  console.log(`✅ Vote options: ${voteOptions.join(", ")}`);

  // Step 8 — Save list to Supabase
  console.log("\n💾 Saving Top 10 to Supabase...");
  const { error: listError } = await supabase.from("daily_lists").insert(list);
  if (listError) {
    console.error("❌ List save error:", listError);
    process.exit(1);
  }
  console.log("✅ List saved!");

  // Step 9 — Save vote options for tomorrow
  console.log("💾 Saving vote options for tomorrow...");
  await supabase.from("vote_options").delete().eq("vote_date", tomorrowDate);
  const { error: voteOptError } = await supabase
    .from("vote_options")
    .insert({ vote_date: tomorrowDate, options: voteOptions });

  if (!voteOptError) {
    await supabase.from("daily_votes").delete().eq("vote_date", tomorrowDate);
    for (const option of voteOptions) {
      await supabase.from("daily_votes").insert({
        vote_date: tomorrowDate,
        option_text: option,
        vote_count: 0,
      });
    }
    console.log("✅ Vote options saved!");
  } else {
    console.error("❌ Vote options error:", voteOptError);
  }

  console.log(`\n✅ All done!`);
  console.log(`   Today: ${category.category_pt} → ai10pt.top/${category.slug}`);
  console.log(`   Tomorrow's vote options ready ✓`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
