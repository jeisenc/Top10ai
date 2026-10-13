import { SiteHeader, SiteFooter } from "../components/SiteChrome";

export default function ArticleLayout({ meta, children }) {
  return (
    <>
      <SiteHeader active="artigos" />
      <main className="container-narrow" style={{ paddingTop: 32 }}>
        <nav className="crumbs" aria-label="Caminho">
          <a href="/">Início</a><span aria-hidden="true">/</span><a href="/artigos">Artigos</a>
        </nav>
        <div className="meta-line" style={{ marginTop: 20 }}>
          <span style={{ fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: ".06em", fontSize: 13 }}>{meta.category}</span>
          <span>{meta.readTime} de leitura</span>
          <span>{meta.date}</span>
        </div>
        <h1 className="h1" style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "12px 0 16px" }}>{meta.title}</h1>
        <p className="lede">{meta.excerpt}</p>

        {meta.youtubeId && (
          <div style={{ borderRadius: 16, overflow: "hidden", marginTop: 28, position: "relative", paddingBottom: "56.25%", background: "var(--ink)" }}>
            <iframe
              src={"https://www.youtube-nocookie.com/embed/" + meta.youtubeId + "?rel=0"}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={meta.title}
            />
          </div>
        )}

        <article className="prose" style={{ marginTop: 32 }}>{children}</article>

        <p style={{ marginTop: 48, padding: 20, background: "var(--tint)", borderRadius: 14, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-2)" }}>Nota editorial:</strong> Este artigo foi escrito com a ajuda de inteligência artificial e revisto para o contexto português. Não substitui aconselhamento profissional.
        </p>

        {meta.related?.length > 0 && (
          <section className="section">
            <h2 className="h2" style={{ fontSize: 22, marginBottom: 14 }}>Continua a ler</h2>
            <div className="link-list">
              {meta.related.map((r) => (
                <a key={r.slug} href={"/artigos/" + r.slug} className="link-card">
                  <span>
                    <span className="t" style={{ fontSize: 17 }}>{r.title}</span>
                    <span className="s" style={{ display: "block" }}>{r.readTime}</span>
                  </span>
                  <span aria-hidden="true" style={{ color: "var(--green)" }}>→</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
