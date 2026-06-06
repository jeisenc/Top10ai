import { createClient } from "@supabase/supabase-js";
import CategoryPageClient from "../CategoryPageClient";

export async function generateMetadata({ params }) {
  const { category } = await params;

  const SEO = {
    "auscultadores": {
      title: "Top 10 Melhores Auscultadores Wireless Portugal 2026",
      description: "Descobre os 10 melhores auscultadores wireless disponíveis em Portugal em 2026. Lista atualizada diariamente por IA com preços e onde comprar.",
    },
    "robots-aspiradores": {
      title: "Top 10 Melhores Robots Aspiradores Portugal 2026",
      description: "Os 10 melhores robots aspiradores disponíveis em Portugal em 2026. Comparação de preços na Worten, Fnac e Amazon. Atualizado diariamente por IA.",
    },
    "sapatilhas": {
      title: "Top 10 Melhores Sapatilhas de Corrida Portugal 2026",
      description: "As 10 melhores sapatilhas de corrida disponíveis em Portugal em 2026. Lista atualizada diariamente por inteligência artificial.",
    },
    "fritadeiras-de-ar": {
      title: "Top 10 Melhores Fritadeiras de Ar Portugal 2026",
      description: "As 10 melhores fritadeiras de ar disponíveis em Portugal em 2026. Preços e lojas atualizados diariamente por IA.",
    },
    "portateis": {
      title: "Top 10 Melhores Portáteis até 800€ Portugal 2026",
      description: "Os 10 melhores portáteis disponíveis em Portugal em 2026. Lista atualizada diariamente com preços reais na Worten, Fnac e Amazon.",
    },
    "protetor-solar": {
      title: "Top 10 Melhores Protetores Solares Portugal 2026",
      description: "Os 10 melhores protetores solares disponíveis em Portugal em 2026. Lista atualizada diariamente por inteligência artificial.",
    },
    "moda-verao": {
      title: "Top 10 Melhores Vestidos de Verão Portugal 2026",
      description: "Os 10 vestidos de verão mais populares disponíveis em Portugal em 2026. Lista atualizada diariamente por IA com preços e onde comprar.",
    },
  };

  const seo = SEO[category] || {
    title: `Top 10 ${category.replace(/-/g, " ")} Portugal 2026 — ai10pt.top`,
    description: `Os 10 melhores produtos de ${category.replace(/-/g, " ")} disponíveis em Portugal, selecionados diariamente por inteligência artificial.`,
  };

  return { title: seo.title, description: seo.description };
}

export default async function Page({ params }) {
  const { category } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: list } = await supabase
    .from("daily_lists")
    .select("*")
    .eq("slug", category)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: categoriesRaw } = await supabase
    .from("daily_lists")
    .select("category, category_pt, slug")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  const seen = new Set();
  const categories = (categoriesRaw || []).filter(row => {
    if (seen.has(row.slug)) return false;
    seen.add(row.slug);
    return true;
  });

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

  const itemListSchema = list ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": list.category_pt,
    "description": list.headline,
    "numberOfItems": list.items?.length,
    "itemListElement": list.items?.sort((a, b) => a.rank - b.rank).map(item => ({
      "@type": "ListItem",
      "position": item.rank,
      "name": item.name,
      "url": buildAffiliateUrl(item.store, item.store_url_hint),
      "item": {
        "@type": "Product",
        "name": item.name,
        "offers": {
          "@type": "Offer",
          "price": item.price_eur,
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": item.store }
        }
      }
    }))
  } : null;

  const faqSchema = list?.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": list.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  return (
    <>
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      {list && (
        <div style={{ display: "none" }} aria-hidden="true">
          <h1>{list.category_pt}</h1>
          <p>{list.headline}</p>
          {list.items?.sort((a, b) => a.rank - b.rank).map(item => (
            <div key={item.rank}>
              <h2>{item.rank}. {item.name}</h2>
              <p>{item.reason_pt}</p>
              <p>Preço: €{item.price_eur} em {item.store}</p>
            </div>
          ))}
          {list.faqs?.map((faq, i) => (
            <div key={i}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
      <CategoryPageClient slug={category} initialList={list} initialCategories={categories} />
    </>
  );
}
