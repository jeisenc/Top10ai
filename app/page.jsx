import { createClient } from "@supabase/supabase-js";
import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "AI Top 10 Portugal — Os melhores produtos selecionados por IA",
  description: "Os 10 melhores produtos disponíveis em Portugal hoje, selecionados por inteligência artificial. Atualizado diariamente com preços reais.",
};

export default async function HomePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

  function buildAffiliateUrl(store, hint) {
    const encoded = encodeURIComponent(hint);
    switch (store) {
      case "Amazon": return `https://www.amazon.es/s?k=${encoded}&tag=aitop10pt-21`;
      case "Worten": return `https://www.worten.pt/search?query=${encoded}`;
      case "Fnac": return `https://www.fnac.pt/SearchResult/ResultList.aspx?SCat=0&Search=${encoded}`;
      case "Decathlon": return `https://www.decathlon.pt/search?Ntt=${encoded}`;
      case "Zalando": return `https://www.zalando.pt/catalog/?q=${encoded}`;
      default: return `https://www.google.pt/search?q=${encoded}`;
    }
  }

  return (
    <>
      <div style={{ display: "none" }} aria-hidden="true">
        <h1>Os melhores produtos escolhidos por IA para Portugal</h1>
        <p>Todos os dias analisamos o que os portugueses mais pesquisam e publicamos o Top 10 mais relevante com preços reais.</p>
        <nav>
          <h2>Todas as categorias</h2>
          {allLists.map(list => (
            <a key={list.slug} href={`/${list.slug}`}>{list.category_pt}</a>
          ))}
        </nav>
        {featuredList && (
          <section>
            <h2>Em destaque hoje: {featuredList.category_pt}</h2>
            <p>{featuredList.headline}</p>
            {featuredList.items?.sort((a, b) => a.rank - b.rank).map(item => (
              <div key={item.rank}>
                <h3>{item.rank}. {item.name}</h3>
                <p>{item.reason_pt}</p>
                <p>Preço: €{item.price_eur} em {item.store}</p>
                <a href={buildAffiliateUrl(item.store, item.store_url_hint)}>Ver {item.name}</a>
              </div>
            ))}
          </section>
        )}
        {allLists.map(list => (
          <section key={list.slug}>
            <h2>{list.category_pt}</h2>
            <p>{list.headline}</p>
            <a href={`/${list.slug}`}>Ver Top 10 {list.category_pt}</a>
            {list.items?.slice(0, 3).map(item => (
              <div key={item.rank}><span>{item.rank}. {item.name} — €{item.price_eur}</span></div>
            ))}
          </section>
        ))}
        {allLists.filter(l => l.faqs?.length).slice(0, 5).map(list => (
          <section key={`faq-${list.slug}`}>
            <h2>Perguntas sobre {list.category_pt}</h2>
            {list.faqs.map((faq, i) => (
              <div key={i}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
            ))}
          </section>
        ))}
        <nav>
          <h2>Artigos sobre IA</h2>
          <a href="/artigos/ia-em-portugal">IA em Portugal: estamos prontos?</a>
          <a href="/artigos/do-google-para-a-ia">Deixámos de googlar. Passámos a perguntar à IA.</a>
          <a href="/artigos/como-confiar-na-ia">Como confiar na IA</a>
          <a href="/artigos/ia-e-saude">Perguntei à IA os meus sintomas</a>
        </nav>
      </div>
      <HomePageClient initialLists={allLists} initialFeatured={featuredList} />
    </>
  );
}
