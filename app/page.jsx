import { CATEGORIES, GROUPS, SITE_URL, categoriesInGroup, formatDateShort, priceText, buyLabel, roleLabel, inSeason, blackFridayCountdown } from "../lib/site";
import { getLatestLists } from "../lib/data";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";
import { ProductImage } from "./components/ProductCard";
import Finder from "./components/Finder";

export const revalidate = 3600;

export const metadata = {
  title: "Melhores Robots Aspiradores e Aspiradores em Portugal — Guias de Compra | ai10pt.top",
  description: "Guias de compra para Portugal: os melhores robots aspiradores, aspiradores sem fios, climatização e tecnologia, comparados e atualizados regularmente.",
  alternates: { canonical: SITE_URL },
};

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function GuideCard({ cat, list }) {
  return (
    <a href={`/${cat.slug}`} className="guide-card">
      <div className="top-meta">
        <span style={{ fontWeight: 600 }}>{list ? `${list.items.length} modelos` : "Em preparação"}</span>
        {list && <span>Atualizado a {formatDateShort(list.created_at)}</span>}
      </div>
      <h3 className="hd">{cat.short}</h3>
      <p>{cat.description}</p>
      {list && (
        <ol>
          {list.items.slice(0, 3).map((item) => <li key={item.rank}>{item.name}</li>)}
        </ol>
      )}
      <span className="go">Ver guia →</span>
    </a>
  );
}

function GuideLink({ cat, list, now }) {
  return (
    <a href={`/${cat.slug}`} className="link-card">
      <span>
        <span className="t">
          {cat.short}
          {inSeason(cat, now) && <span className="badge badge-green" style={{ fontSize: 12, padding: "3px 8px" }}>Época</span>}
        </span>
        <span className="s" style={{ display: "block" }}>
          {list?.items?.[0] ? `Nº 1: ${list.items[0].name}` : "Em preparação"}
        </span>
      </span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
    </a>
  );
}

export default async function HomePage() {
  const lists = await getLatestLists();
  const now = new Date();
  const bf = blackFridayCountdown(now);
  const featuredList = lists["robots-aspiradores"];
  const featured = featuredList?.items?.[0];
  const bfList = lists["black-friday-aspiradores"];

  // In season, put the seasonal guide first in its group.
  const byseason = (group) =>
    [...categoriesInGroup(group)].sort((a, b) => Number(inSeason(b, now)) - Number(inSeason(a, now)));
  const vacuums = categoriesInGroup("aspiradores").filter((c) => !(bf && c.slug === "black-friday-aspiradores"));

  return (
    <>
      <SiteHeader />

      <section className="hero">
        <div className="container hero-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className="eyebrow">Guias de compra · Portugal</span>
            <h1 className="h1">Qual aspirador comprar?</h1>
            <p className="lede" style={{ maxWidth: "36ch" }}>
              Comparamos os modelos à venda na Worten e na Amazon e dizemos-te qual escolher para a tua casa e o teu orçamento.
            </p>
            <Finder />
          </div>

          {featured && (
            <article className="feature">
              <div style={{ position: "relative" }}>
                <ProductImage item={featured} />
                <span className="badge">{roleLabel(featured.tag) || "A nossa escolha"}</span>
              </div>
              <div className="feature-body">
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                  Robots aspiradores · nº 1 de {featuredList.items.length}
                </span>
                <h2 className="hd" style={{ fontSize: 28, fontWeight: 700 }}>{featured.name}</h2>
                <p>{featured.reason_pt}</p>
                <div className="product-foot">
                  <div className="price">
                    {priceText(featured) ? (
                      <><strong>{priceText(featured)}</strong><small>Preço indicativo · {formatDateShort(featuredList.created_at)}</small></>
                    ) : (
                      <small>Preço atual na {featured.store}</small>
                    )}
                  </div>
                  <div className="product-actions">
                    <a className="video-link" href="/robots-aspiradores">Ver os {featuredList.items.length}</a>
                    <a className="btn" href={featured.url} target="_blank" rel="nofollow sponsored noopener">{buyLabel(featured)}</a>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <div className="trust">
        <div className="container">
          <span><Icon d="M4 6h16M4 12h16M4 18h10" />{CATEGORIES.length} guias de compra</span>
          <span><Icon d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />Revistos todas as semanas</span>
          <span><Icon d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6" />Só modelos à venda em Portugal</span>
          <a className="link-strong" href="/sobre#como-escolhemos">Como escolhemos os produtos →</a>
        </div>
      </div>

      <main className="container">
        <section className="section" id="aspiradores" style={{ scrollMarginTop: 90 }}>
          <div className="section-head">
            <div>
              <h2 className="h2">{GROUPS.aspiradores}</h2>
              <p>Robots, verticais sem fios e tradicionais, comparados por orçamento e tipo de casa.</p>
            </div>
          </div>
          <div className="guide-grid">
            {vacuums.map((cat) => <GuideCard key={cat.slug} cat={cat} list={lists[cat.slug]} />)}
          </div>
        </section>

        {bf && (
          <section className="section promo" aria-labelledby="bf">
            <div>
              <span className="eyebrow">
                Black Friday · {bf.label} · {bf.days === 0 ? "é hoje" : `faltam ${bf.days} ${bf.days === 1 ? "dia" : "dias"}`}
              </span>
              <h2 id="bf" className="h2">Os aspiradores que costumam baixar de preço</h2>
              <p>
                {bfList?.items?.length
                  ? `${bfList.items.slice(0, 3).map((i) => i.name).join(", ")} e outros modelos a vigiar antes de comprar.`
                  : "Os modelos a vigiar antes de comprar."}
              </p>
            </div>
            <a className="btn btn-amber" href="/black-friday-aspiradores">Ver a lista de Black Friday</a>
          </section>
        )}

        <section className="section two-col">
          {["casa", "tecnologia"].map((group) => (
            <div key={group} id={group} style={{ scrollMarginTop: 90 }}>
              <h2 className="h2" style={{ marginBottom: 20 }}>{GROUPS[group]}</h2>
              <div className="link-list">
                {byseason(group).map((cat) => <GuideLink key={cat.slug} cat={cat} list={lists[cat.slug]} now={now} />)}
              </div>
            </div>
          ))}
        </section>

        <section className="section steps" id="como-escolhemos">
          <div>
            <h2 className="h2">Como escolhemos</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.6, marginTop: 10 }}>
              Cada guia é revisto todas as semanas. Usamos IA para juntar especificações, preços e análises; a ordem segue critérios fixos.{" "}
              <a href="/sobre#como-escolhemos">Saber mais</a>
            </p>
          </div>
          <div><span className="num">1</span><strong>À venda em Portugal</strong><p>Só entram modelos que se compram hoje na Worten ou na Amazon.</p></div>
          <div><span className="num">2</span><strong>Para quem é</strong><p>Cada modelo tem um perfil claro e os seus limites ditos sem rodeios.</p></div>
          <div><span className="num">3</span><strong>Preço confirmado na loja</strong><p>Os preços são indicativos; o botão leva-te ao preço atual.</p></div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
