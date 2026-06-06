import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "AI Top 10 Portugal — Os melhores produtos selecionados por IA",
  description: "Os 10 melhores produtos disponíveis em Portugal hoje, selecionados por inteligência artificial.",
};

export default async function HomePage() {
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: allListsRaw } = await supabase
    .from("daily_lists")
    .select("*")
    .order("created_at", { ascending: false });

  const seen = new Set();
  const allLists = (allListsRaw || []).filter(row => {
    const key = row.slug || row.category;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const featuredList = allLists[0] || null;

  const { default: HomePageClient } = await import("./HomePageClient");

  return (
    <>
      <div style={{ display: "none" }} aria-hidden="true">
        <h1>Os melhores produtos escolhidos por IA para Portugal</h1>
        {allLists.map(list => (
          <a key={list.slug} href={"/" + list.slug}>{list.category_pt}</a>
        ))}
        {featuredList && featuredList.items?.map(item => (
          <div key={item.rank}>{item.rank}. {item.name} - {item.reason_pt} - EUR {item.price_eur}</div>
        ))}
        {allLists.filter(l => l.faqs?.length).slice(0, 3).map(list =>
          list.faqs.map((faq, i) => (
            <div key={list.slug + i}>{faq.question} {faq.answer}</div>
          ))
        )}
      </div>
      <HomePageClient initialLists={allLists} initialFeatured={featuredList} />
    </>
  );
}
