import { CATEGORIES, GROUPS, ARTICLES, SITE_URL, categoriesInGroup, formatDatePt } from "../lib/site";
import { getLatestLists } from "../lib/data";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";

export const revalidate = 3600;

export const metadata = {
  title: "Melhores Robots Aspiradores e Aspiradores em Portugal — Guias de Compra | ai10pt.top",
  description: "Guias de compra para Portugal: os melhores robots aspiradores, aspiradores sem fios, climatização e tecnologia, comparados e atualizados regularmente.",
  alternates: { canonical: SITE_URL },
};

function CategoryCard({ cat, list }) {
  return (
    <a href={`/${cat.slug}`} className="cat-card">
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
        <span style={{ fontSize: 20 }}>{cat.emoji}</span>
        {list && <span>Atualizado a {formatDatePt(list.created_at)}</span>}
      </div>
      <h3>{cat.name}</h3>
      <p>{cat.description}</p>
      {list && (
        <div className="top3">
          {list.items.slice(0, 3).map((item) => (
            <div key={item.rank}>{item.rank}. {item.name}</div>
          ))}
        </div>
      )}
      <div className="go">Ver guia →</div>
    </a>
  );
}

export default async function HomePage() {
  const lists = await getLatestLists();
  const featured = lists["robots-aspiradores"];

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <div style={{ marginBottom: 32 }}>
          <span className="eyebrow">🇵🇹 Guias de compra para Portugal</span>
          <h1 className="h1">
            Qual aspirador comprar?<br />
            <span style={{ color: "var(--red)" }}>Os melhores, comparados.</span>
          </h1>
          <p className="lede">
            Robots aspiradores, aspiradores sem fios e outros equipamentos para casa, escolhidos entre os modelos à venda
            em Portugal e atualizados regularmente. Diz-nos o orçamento, nós mostramos as opções.
          </p>
        </div>

        {featured && (
          <section className="section">
            <div className="section-title">
              <h2>🤖 Top 5 robots aspiradores</h2><div className="rule" />
              <a href="/robots-aspiradores" style={{ fontSize: 13, color: "var(--red)", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Ver os 10 →</a>
            </div>
            <div className="products">
              {featured.items.slice(0, 5).map((item) => (
                <div key={item.rank} className={`product${item.rank <= 3 ? " top" : ""}`}>
                  <div className="product-row">
                    <span className="rank" style={{ paddingTop: 2 }}>{item.rank}</span>
                    <div className="product-body">
                      <div className="product-name">{item.name}</div>
                      <p className="product-reason" style={{ marginBottom: 0 }}>{item.reason_pt}</p>
                    </div>
                    <div className="product-side">
                      {item.show_price && <span className="price">~€{item.price_eur}</span>}
                      <a className="buy" href={item.url} target="_blank" rel="nofollow sponsored noopener">Ver na {item.store} →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {Object.entries(GROUPS).map(([group, label]) => (
          <section key={group} className="section">
            <div className="section-title"><h2>{label}</h2><div className="rule" /></div>
            <div className="cat-grid">
              {categoriesInGroup(group).map((cat) => (
                <CategoryCard key={cat.slug} cat={cat} list={lists[cat.slug]} />
              ))}
            </div>
          </section>
        ))}

        <section className="section">
          <div className="section-title">
            <h2>Artigos</h2><div className="rule" />
            <a href="/artigos" style={{ fontSize: 13, color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>Ver todos →</a>
          </div>
          <div className="cat-grid">
            {ARTICLES.map((a) => (
              <a key={a.slug} href={`/artigos/${a.slug}`} className="cat-card">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                  <span style={{ fontSize: 20 }}>{a.emoji}</span><span>{a.category} · {a.readTime}</span>
                </div>
                <h3>{a.title}</h3>
                <div className="go">Ler →</div>
              </a>
            ))}
          </div>
        </section>

        <p className="notice">
          {CATEGORIES.length} guias de compra · Links de afiliado para Worten e Amazon · Preços indicativos
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
