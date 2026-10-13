import { notFound } from "next/navigation";
import { CATEGORIES, GROUPS, SITE_URL, getCategory, categoriesInGroup, formatDatePt, formatDateShort, quickPicks, priceText, roleLabel } from "../../lib/site";
import { getLatestList } from "../../lib/data";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import ProductCard, { ProductRow, PickCard } from "../components/ProductCard";

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
  const related = siblings.length >= 3 ? siblings : [...siblings, ...CATEGORIES.filter((c) => c.group !== cat.group)].slice(0, 6);

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

  const items = list?.items || [];
  const top = items.slice(0, 5);
  const rest = items.slice(5);
  const picks = quickPicks(items);
  const date = list ? formatDateShort(list.created_at) : null;
  const specCols = (cat.specs || []).filter((s) => items.some((i) => i.specs?.[s.key]));
  const hasBestFor = items.some((i) => i.best_for);
  const showTable = specCols.length > 0 || hasBestFor;
  const best = items[0];
  const groupLabel = GROUPS[cat.group];

  return (
    <div className={best ? "has-buybar" : undefined}>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <SiteHeader active={cat.slug} />

      <main className="container">
        <section style={{ paddingTop: 28, display: "flex", flexDirection: "column", gap: 14, maxWidth: 880 }}>
          <nav className="crumbs" aria-label="Caminho">
            <a href="/">Início</a><span aria-hidden="true">/</span>
            <a href={`/#${cat.group}`}>{groupLabel}</a><span aria-hidden="true">/</span>
            <span aria-current="page">{cat.short}</span>
          </nav>
          <h1 className="h1">{cat.title}</h1>
          <p className="lede">{list?.headline || cat.description}</p>
          {list && (
            <div className="meta-line">
              <span>Atualizado a {formatDatePt(list.created_at)}</span>
              <span>{items.length} modelos comparados</span>
              <a className="link-strong" href="/sobre#como-escolhemos">Como escolhemos</a>
              <span>Contém <a href="/sobre#afiliados">links de afiliado</a></span>
            </div>
          )}
        </section>

        {!list && (
          <div className="empty section">Estamos a preparar este guia. Volta dentro de alguns dias.</div>
        )}

        {picks.length > 0 && (
          <section className="section" aria-labelledby="escolha-rapida">
            <div className="section-head"><h2 id="escolha-rapida" className="h2">Escolha rápida</h2></div>
            <div className="picks">
              {picks.map((item) => <PickCard key={item.rank} item={item} />)}
            </div>
          </section>
        )}

        {showTable && (
          <section className="section" aria-labelledby="comparacao">
            <div className="section-head"><h2 id="comparacao" className="h2">Comparação lado a lado</h2></div>
            <div className="table-box" tabIndex={0} aria-label="Tabela de comparação, desliza para ver mais">
              <table className="cmp">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Preço</th>
                    {specCols.map((s) => <th key={s.key} scope="col">{s.label}</th>)}
                    {hasBestFor && <th scope="col">Melhor para</th>}
                    <th scope="col"><span className="sr-only">Loja</span></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.rank}>
                      <td className="num">{item.rank}</td>
                      <td className="name"><a href={`#n${item.rank}`}>{item.name}</a></td>
                      <td>{priceText(item) || "—"}</td>
                      {specCols.map((s) => <td key={s.key}>{item.specs?.[s.key] || "—"}</td>)}
                      {hasBestFor && <td style={{ color: "var(--text-2)" }}>{item.best_for || roleLabel(item.tag) || "—"}</td>}
                      <td className="go">
                        <a className="link-strong" href={item.url} target="_blank" rel="nofollow sponsored noopener">{item.store} →</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {top.length > 0 && (
          <section className="section" aria-labelledby="recomendados">
            <div className="section-head">
              <h2 id="recomendados" className="h2">{top.length === 5 ? "Os 5 que recomendamos" : "Os que recomendamos"}</h2>
            </div>
            <div className="top-list">
              {top.map((item) => <ProductCard key={item.rank} item={item} specs={cat.specs} date={date} />)}
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="section" aria-labelledby="tambem">
            <div className="section-head"><h2 id="tambem" className="h2">Também considerámos</h2></div>
            <div className="rows">
              {rest.map((item) => <ProductRow key={item.rank} item={item} />)}
            </div>
          </section>
        )}

        {list?.tips?.length > 0 && (
          <section className="section howto" aria-labelledby="como-escolher">
            <h2 id="como-escolher" className="h2">Como escolher: {cat.short.toLowerCase()}</h2>
            <div className="howto-grid">
              {list.tips.map((t, i) => (
                <div key={i}><strong>{t.title}</strong><p>{t.text}</p></div>
              ))}
            </div>
          </section>
        )}

        {list?.faqs?.length > 0 && (
          <section className="section faq-list" aria-labelledby="faq">
            <h2 id="faq" className="h2" style={{ marginBottom: 8 }}>Perguntas frequentes</h2>
            {list.faqs.map((f, i) => (
              <details key={i} className="faq" open={i === 0}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </section>
        )}

        <section className="section" aria-labelledby="relacionados">
          <div className="section-head"><h2 id="relacionados" className="h2">Guias relacionados</h2></div>
          <div className="related">
            {related.map((c) => (
              <a key={c.slug} href={`/${c.slug}`}>{c.short}<span aria-hidden="true">→</span></a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      {best && (
        <div className="buybar">
          <span className="buybar-text">
            <small>A nossa escolha</small>
            <strong>{best.name}{priceText(best) ? ` · ${priceText(best)}` : ""}</strong>
          </span>
          <a className="btn" href={best.url} target="_blank" rel="nofollow sponsored noopener">{best.store}</a>
        </div>
      )}
    </div>
  );
}
