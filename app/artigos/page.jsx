export const metadata = {
  title: "Artigos sobre IA — ai10pt.top",
  description: "Reflexões sobre inteligência artificial em Portugal.",
};

const ARTICLES = [
  { slug: "mundial-2026", emoji: "⚽", category: "Mundial 2026", title: "Mundial 2026: a IA escolheu os melhores ecrãs para ver Portugal jogar", excerpt: "Portugal joga o Mundial 2026 e a IA analisou os melhores televisores e barras de som disponíveis em Portugal.", readTime: "6 min", date: "Junho 2026" },
  { slug: "google-modo-ia", emoji: "🔍", category: "Tecnologia", title: "O Google agora responde com IA — o que é que isso significa para as tuas compras?", excerpt: "O Google lançou o Modo IA e está a mudar a forma como os portugueses pesquisam produtos.", readTime: "7 min", date: "Junho 2026" },
  { slug: "verao-2026", emoji: "☀️", category: "Tendências", title: "Verão 2026: a IA analisou o que os portugueses mais compram nesta época", excerpt: "Protetor solar, ventiladores, roupa de banho — a IA analisou os padrões de compra dos portugueses no verão.", readTime: "6 min", date: "Junho 2026" },
  { slug: "ia-vs-compras", emoji: "🧪", category: "Teste", title: "Pedi à IA para encontrar as melhores ofertas do mercado português. Funciona?", excerpt: "Testámos usar o ChatGPT, o Claude e o Gemini para encontrar as melhores ofertas em Portugal.", readTime: "8 min", date: "Junho 2026" },
  { slug: "ia-preve-compras", emoji: "🔮", category: "Reflexão", title: "A IA sabe o que vais comprar antes de tu saberes. É assustador ou conveniente?", excerpt: "Os algoritmos de recomendação já preveem as tuas próximas compras com precisão assustadora.", readTime: "7 min", date: "Junho 2026" },
  { slug: "ia-em-portugal", emoji: "🇵🇹", category: "Sociedade", title: "IA em Portugal: estamos prontos ou apenas a fingir que sim?", excerpt: "Portugal fala muito de transformação digital. Mas o retrato é mais complexo do que parece.", readTime: "6 min", date: "Abril 2026" },
  { slug: "do-google-para-a-ia", emoji: "🔍", category: "Comportamento", title: "Deixámos de googlar. Passámos a perguntar à IA. E agora?", excerpt: "Durante 25 anos, o Google foi o intermediário entre nós e o conhecimento. Algo mudou.", readTime: "7 min", date: "Abril 2026" },
  { slug: "como-confiar-na-ia", emoji: "🤝", category: "Reflexão", title: "Como confiar na IA — sem ser ingénuo nem paranoico", excerpt: "A IA mente. A IA também acerta. Como é que uma pessoa normal decide quando acreditar?", readTime: "5 min", date: "Abril 2026" },
  { slug: "ia-e-saude", emoji: "🩺", category: "Saúde", title: "Perguntei à IA os meus sintomas. E agora fico em pânico.", excerpt: "Milhões de portugueses já usaram o ChatGPT para verificar sintomas. Alguns ficaram descansados. Outros entraram em espiral.", readTime: "8 min", date: "Abril 2026" },
];

export default function Artigos() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}>

      <header style={{ background: "#fff", borderBottom: "1.5px solid #d4d0cb", padding: "0 16px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 52, justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>10</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#767676" }}>.top</span>
          </a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#595959", textDecoration: "none" }}>{"← Voltar ao Top 10"}</a>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 16px 64px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Artigos</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", fontWeight: 800, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-1px" }}>
            IA explicada por um <span style={{ color: "#c0392b" }}>amigo que percebe do assunto</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 3.5vw, 17px)", color: "#595959", lineHeight: 1.7, maxWidth: 560 }}>
            Sem jargão técnico, sem alarmismo, sem hype. Reflexões honestas sobre como a inteligência artificial está a mudar a forma como vivemos, compramos e decidimos.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {ARTICLES.map((article) => (
            <a key={article.slug} href={"/artigos/" + article.slug} style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 16, overflow: "hidden", textDecoration: "none", display: "block" }}>
              <div style={{ background: "#1a1a1a", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 52 }}>{article.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#c0392b", background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 999, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {article.category}
                </span>
              </div>
              <div style={{ padding: "20px 20px 22px" }}>
                <h2 style={{ fontSize: "clamp(15px, 3.5vw, 18px)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.25, marginBottom: 10 }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: 13, color: "#595959", lineHeight: 1.6, marginBottom: 16 }}>
                  {article.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#767676" }}>{article.readTime} · {article.date}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>{"Ler →"}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: "1.5px solid #d4d0cb", padding: "24px 16px", background: "#f8f7f4" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#c0392b" }}>10</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#767676" }}>.top</span>
          </a>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href="/sobre" style={{ fontSize: 13, color: "#595959", textDecoration: "none" }}>Sobre</a>
            <a href="/privacidade" style={{ fontSize: 13, color: "#595959", textDecoration: "none" }}>Privacidade</a>
            <a href="/contacto" style={{ fontSize: 13, color: "#595959", textDecoration: "none" }}>Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
