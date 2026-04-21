import { createClient } from "@supabase/supabase-js";

export default async function sitemap() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data } = await supabase
    .from("daily_lists")
    .select("slug, created_at")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  const seen = new Set();
  const unique = (data || []).filter(row => {
    if (seen.has(row.slug)) return false;
    seen.add(row.slug);
    return true;
  });

  const categoryPages = unique.map(row => ({
    url: `https://ai10pt.top/${row.slug}`,
    lastModified: new Date(row.created_at),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [
    {
      url: "https://ai10pt.top",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryPages,
  ];
}
