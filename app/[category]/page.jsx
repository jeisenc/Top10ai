import { notFound } from "next/navigation";
import { CATEGORIES, SITE_URL, getCategory, categoriesInGroup, formatDatePt } from "../../lib/site";
import { getLatestList } from "../../lib/data";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import ProductCard from "../components/ProductCard";

// Pages are cached and rebuilt at most once an hour (the daily job also
// clears the cache when it refreshes a list).
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const list = await getLatestList(category);
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `${SITE_URL}/${cat.slug}` },
    // Don't let Google index a page until it has a real list on it.
    robots: list ? undefined : { index: false, follow: true },
    openGraph: { title: cat.title, description: cat.description, url: `${SITE_URL}/${cat.slug}`, locale: "pt_PT", type: "article" },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const list = await getLatestList(category);
  const siblings = categoriesInGroup(cat.group).filter((c) => c.slug !== cat.slug);
  const others = CATEGORIES.filter((c) => c.group !== cat.group);

  const schemas = [];
  if (list) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: cat.title,
      numberOfItems: list.items.length,
      itemListElement: list.items.map((item) => ({ "@type": "ListItem", position: item.rank, name: item.name })),
    });
    if (list.faqs?.length) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: list.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      });
    }
  }
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE_URL}/${cat.slug}` },
    ],
  });

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <SiteHeader active={cat.slug} />

      <main className="wrap-narrow">
        <div style={{ marginBottom: 24 }}>
          <span className="eyebrow">{cat.emoji} Guia de compra</span>
          <h1 className="h1">{cat.title}</h1>
          <p className="lede">{list?.headline || cat.description}</p>
          {list && (
            <div className="meta">
              <span>Atualizado a {formatDatePt(list.created_at)}</span>
              <span>·</span>
              <span className="chip">Selecionado com IA</span>
            </div>
          )}
        </div>

        <section className="section">
          {list ? (
            <div className="products">
              {list.items.map((item) => (
                <ProductCard key={item.rank} item={item} emoji={cat.emoji} />
              ))}
            </div>
          ) : (
            <div className="empty">Estamos a preparar este guia. Volta dentro de alguns dias.</div>
          )}
          {list && (
            <p className="notice" style={{ marginTop: 16 }}>
              Os preços são indicativos e mudam com frequência — confirma sempre o preço final na loja.
              Links de afiliado: se comprares através deles podemos receber uma comissão, sem custo para ti.
            </p>
          )}
        </section>

        {list?.faqs?.length > 0 && (
          <section className="section">
            <div className="section-title"><h2>Perguntas frequentes</h2><div className="rule" /></div>
            {list.faqs.map((f, i) => (
              <details key={i} className="faq">
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </section>
        )}

        {siblings.length > 0 && (
          <section className="section">
            <div className="section-title"><h2>Outros guias relacionados</h2><div className="rule" /></div>
            <div className="related">
              {siblings.map((c) => (
                <a key={c.slug} href={`/${c.slug}`} className="pill">{c.emoji} {c.name}</a>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-title"><h2>Ver também</h2><div className="rule" /></div>
          <div className="related">
            {others.map((c) => (
              <a key={c.slug} href={`/${c.slug}`} className="pill">{c.emoji} {c.name}</a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
