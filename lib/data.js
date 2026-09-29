import { createClient } from "@supabase/supabase-js";
import { CATEGORIES, productUrl, normaliseStore, showPrice } from "./site";

function supabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Prepare a stored list for display: sort, keep only supported stores and
// attach the outbound (affiliate) link computed on the server.
function prepare(list) {
  if (!list) return null;
  const items = [...(list.items || [])]
    .sort((a, b) => a.rank - b.rank)
    .map((item) => ({
      ...item,
      store: normaliseStore(item.store),
      url: productUrl(item),
      show_price: showPrice(item),
    }));
  return { ...list, items };
}

export async function getLatestList(slug) {
  const db = supabase();
  if (!db) return null;
  const { data } = await db
    .from("daily_lists")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return prepare(data);
}

// Latest list for every configured category, keyed by slug.
export async function getLatestLists() {
  const db = supabase();
  if (!db) return {};
  const { data } = await db
    .from("daily_lists")
    .select("slug, category_pt, headline, items, created_at")
    .in("slug", CATEGORIES.map((c) => c.slug))
    .order("created_at", { ascending: false });
  const bySlug = {};
  for (const row of data || []) {
    if (!bySlug[row.slug]) bySlug[row.slug] = prepare(row);
  }
  return bySlug;
}
