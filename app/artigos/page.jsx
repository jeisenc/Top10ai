import { SiteHeader, SiteFooter } from "../components/SiteChrome";

export const metadata = {
  title: "Artigos — ai10pt.top",
  description: "Artigos sobre compras, tecnologia e inteligência artificial em Portugal.",
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
    <>
      <SiteHeader active="artigos" />
      <main className="container" style={{ paddingTop: 40 }}>
        <span className="eyebrow">Artigos</span>
        <h1 className="h1" style={{ margin: "10px 0 12px" }}>Artigos</h1>
        <p className="lede">Reflexões sobre compras, tecnologia e a forma como a inteligência artificial está a mudar o que pesquisamos e compramos.</p>
        <div className="guide-grid" style={{ marginTop: 36 }}>
          {ARTICLES.map((article) => (
            <a key={article.slug} href={"/artigos/" + article.slug} className="guide-card">
              <div className="top-meta">
                <span style={{ fontWeight: 600, color: "var(--green)" }}>{article.category}</span>
                <span>{article.readTime}</span>
              </div>
              <h2 className="hd" style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.2 }}>{article.title}</h2>
              <p>{article.excerpt}</p>
              <span className="go">Ler →</span>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
