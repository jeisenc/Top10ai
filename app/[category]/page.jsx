import CategoryPage from "../CategoryPage";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data } = await supabase
    .from("daily_lists")
    .select("slug, category")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  if (!data) return [];

  const seen = new Set();
  return data
    .filter(row => {
      if (seen.has(row.slug)) return false;
      seen.add(row.slug);
      return true;
    })
    .map(row => ({ category: row.slug }));
}

export default async function Page({ params }) {
  const { category } = await params;
  return <CategoryPage slug={category} />;
}
