export const metadata = {
  title: "Artigos sobre IA — ai10pt.top",
  description: "Reflexões, análises e perspetivas sobre inteligência artificial em Portugal e no mundo. Escritos para fazer pensar.",
};

const ARTICLES = [
  {
    slug: "ia-em-portugal",
    emoji: "🇵🇹",
    category: "Sociedade",
    title: "IA em Portugal: estamos prontos ou apenas a fingir que sim?",
    excerpt: "Portugal fala muito de transformação digital. Mas quando olhamos para os números reais — quem usa IA, como a usa, e o que espera dela — o retrato é mais complexo do que parece.",
    readTime: "6 min",
    date: "Abril 2026",
  },
  {
    slug: "do-google-para-a-ia",
    emoji: "🔍",
    category: "Comportamento",
    title: "Deixámos de googlar. Passámos a perguntar à IA. E agora?",
    excerpt: "Durante 25 anos, o Google foi o intermediário entre nós e o conhecimento. Algo mudou. Estamos a fazer perguntas diferentes, a confiar de forma diferente — e isso tem consequências que ainda não percebemos bem.",
    readTime: "7 min",
    date: "Abril 2026",
  },
  {
    slug: "como-confiar-na-ia",
    emoji: "🤝",
    category: "Reflexão",
    title: "Como confiar na IA — sem ser ingénuo nem paranoico",
    excerpt: "A IA mente. A IA também acerta. Como é que uma pessoa normal, sem doutoramento em machine learning, decide quando acreditar e quando questionar? É mais simples do que pensas.",
    readTime: "5 min",
    date: "Abril 2026",
  },
  {
    slug: "ia-e-saude",
    emoji: "🩺",
    category: "Saúde",
    title: "Perguntei à IA os meus sintomas. E agora fico em pânico.",
    excerpt: "Milhões de portugueses já usaram o ChatGPT ou o Google para verificar sintomas. Alguns ficaram descansados. Outros entraram em espiral. A questão não é se devemos usar IA para saúde — é como.",
    readTime: "8 min",
    date: "Abril 2026",
  },
];

export default function Artigos() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .article-card { background: #fff; border: 1.5px solid #d4d0cb; border-radius: 16px; overflow: hidden; text-decoration: none; display: block; transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
        .article-card:hover { transform: translateY(-3px); border-color: #c0392b; box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .footer-link { font-size: 13px; color: #595959; text-decoration: none; }
        .footer-link:hover { color: #c0392b; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #d4d0cb", padding: "0 16px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, justifyContent: "space-between" }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#767676" }}>.top</span>
            </a>
            <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#595959", textDecoration: "none" }}>← Voltar ao Top 10</a>
          </div>
        </header>

        <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 16px 64px" }}>

          {/* Hero */}
          <div style={{ marginBottom: 40, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Artigos</span>
            </div>
            <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-1px" }}>
              IA explicada por um<br />
              <span style={{ color: "#c0392b" }}>amigo que percebe do assunto</span>
            </h1>
            <p style={{ fontSize: "clamp(14px, 3.5vw, 17px)", color: "#595959", lineHeight: 1.7, maxWidth: 560 }}>
              Sem jargão técnico, sem alarmismo, sem hype. Reflexões honestas sobre como a inteligência artificial está a mudar a forma como vivemos, compramos, pesquisamos e decidimos — em Portugal e no mundo.
            </p>
          </div>

          {/* Articles grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {ARTICLES.map((article, i) => (
              <a
                key={article.slug}
                href={"/artigos/" + article.slug}
                className="article-card"
                style={{ animationDelay: (i * 60) + "ms", animation: "fadeUp 0.4s ease both", opacity: 0 }}
              >
                {/* Emoji hero */}
                <div style={{ background: "#1a1a1a", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 52 }}>{article.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#c0392b", background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 999, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "20px 20px 22px" }}>
                  <h2 style={{ fontSize: "clamp(15px, 3.5vw, 18px)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.25, marginBottom: 10, letterSpacing: "-0.3px" }}>
                    {article.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "#595959", lineHeight: 1.6, marginBottom: 16 }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#767676" }}>{article.readTime}</span>
                      <span style={{ fontSize: 12, color: "#d4d0cb" }}>·</span>
                      <span style={{ fontSize: 12, color: "#767676" }}>{article.date}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>Ler →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1.5px solid #d4d0cb", padding: "24px 16px", background: "#f8f7f4" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#c0392b" }}>10</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#767676" }}>.top</span>
            </a>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <a href="/sobre" className="footer-link">Sobre</a>
              <a href="/privacidade" className="footer-link">Privacidade</a>
              <a href="/contacto" className="footer-link">Contacto</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
