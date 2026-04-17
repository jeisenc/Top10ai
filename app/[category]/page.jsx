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
    .select("category")
    .order("created_at", { ascending: false });

  if (!data) return [];

  // Get unique categories and convert to slugs
  const unique = [...new Set(data.map(row => row.category))];
  return unique.map(cat => ({ category: cat.replace(/-/g, "-") }));
}

export default function Page({ params }) {
  return <CategoryPage categoryEn={params.category} />;
}
