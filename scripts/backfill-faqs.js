const Anthropic = require("@anthropic-ai/sdk");
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateFAQs(category_pt) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `Generate 7 frequently asked questions in European Portuguese about: "${category_pt}"

Real questions Portuguese consumers search on Google when buying these products.
Include: how to choose, price ranges, best brands, where to buy in Portugal, comparisons.

Return ONLY this JSON, nothing else:
{
  "faqs": [
    {
      "question": "Qual é o melhor...?",
      "answer": "Resposta em 2-3 frases em português europeu."
    }
  ]
}`
    }]
  });

  let raw = msg.content[0].text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(raw).faqs;
}

async function main() {
  console.log("🔍 Finding rows missing FAQs...");

  const { data: rows, error } = await supabase
    .from("daily_lists")
    .select("id, slug, category_pt")
    .is("faqs", null)
    .not("slug", "is", null);

  if (error) { console.error(error); process.exit(1); }

  // Only process the most recent row per slug
  const seen = new Set();
  const toFix = rows.filter(row => {
    if (seen.has(row.slug)) return false;
    seen.add(row.slug);
    return true;
  });

  console.log(`\n📝 Found ${toFix.length} unique categories to backfill\n`);

  for (const row of toFix) {
    console.log(`Generating FAQs for: ${row.category_pt}...`);
    try {
      const faqs = await generateFAQs(row.category_pt);
      const { error: updateError } = await supabase
        .from("daily_lists")
        .update({ faqs })
        .eq("id", row.id);

      if (updateError) {
        console.error(`  ❌ Failed: ${updateError.message}`);
      } else {
        console.log(`  ✅ Done — ${faqs.length} FAQs saved`);
      }
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }

  console.log("\n✅ Backfill complete!");
}

main().catch(console.error);
