import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const HomePageClient = dynamic(() => import("./HomePageClient"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100vh", background: "#f8f7f4" }} />
});

export const metadata = {
  title: "AI Top 10 Portugal — Os melhores produtos selecionados por IA",
  description: "Os 10 melhores produtos disponíveis em Portugal hoje, selecionados por inteligência artificial. Atualizado diariamente com preços reais.",
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

  function buildUrl(store, hint) {
    const e = encodeURIComponent(hint);
    switch (store) {
      case "Amazon": return `https://www.amazon.es/s?k=${e}&tag=aitop10pt-21`;
      case "Worten": return `https://www.worten.pt/search?query=${e}`;
      case "Fnac": return `https://www.fnac.pt/SearchResult/ResultList.aspx?SCat=0&Search=${e}`;
      default: return `https://www.google.pt/search?q=${e}`;
    }
  }

  return (
    <>
      {/* Hidden server-rendered content for Google */}
      <div style={{ display: "none" }} aria-hidden="true">
        <h1>Os melhores produtos escolhidos por IA para Portugal</h1>
        <nav>
          {allLists.map(list => (
            <a key={list.slug} href={`/${list.slug}`}>{list.category_pt}</a>
          ))}
