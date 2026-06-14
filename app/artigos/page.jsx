export const metadata = {
  title: "Artigos sobre IA — ai10pt.top",
  description: "Reflexões, análises e perspetivas sobre inteligência artificial em Portugal e no mundo. Escritos para fazer pensar.",
};

const ARTICLES = [
  {
    slug: "mundial-2026",
    emoji: "⚽",
    category: "Mundial 2026",
    title: "Mundial 2026: a IA escolheu os melhores ecrãs para ver Portugal jogar",
    excerpt: "Portugal joga o Mundial 2026 e a IA analisou os melhores televisores, projetores e barras de som disponíveis em Portugal para não perderes um golo.",
    readTime: "6 min",
    date: "Junho 2026",
  },
  {
    slug: "google-modo-ia",
    emoji: "🔍",
    category: "Tecnologia",
    title: "O Google agora responde com IA — o que é que isso significa para as tuas compras?",
    excerpt: "O Google lançou o Modo IA e está a mudar a forma como os portugueses pesquisam produtos. O que muda para o consumidor português?",
    readTime: "7 min",
    date: "Junho 2026",
  },
  {
    slug: "verao-2026",
    emoji: "☀️",
    category: "Tendências",
    title: "Verão 2026: a IA analisou o que os portugueses mais compram nesta época",
    excerpt: "Protetor solar, ventiladores, roupa de banho — a IA analisou os padrões de compra dos portugueses no verão e o resultado surpreende.",
    readTime: "6 min",
    date: "Junho 2026",
  },
  {
    slug: "ia-vs-compras",
    emoji: "🧪",
    category: "Teste",
    title: "Pedi à IA para encontrar as melhores ofertas do mercado português. Funciona?",
    excerpt: "Testámos usar o ChatGPT, o Claude e o Gemini para encontrar as melhores ofertas em Portugal. Os resultados são melhores do que esperávamos. Mas há um problema sério.",
    readTime: "8 min",
    date: "Junho 2026",
  },
  {
    slug: "ia-preve-compras",
    emoji: "🔮",
    category: "Reflexão",
    title: "A IA sabe o que vais comprar antes de tu saberes. É assustador ou conveniente?",
    excerpt: "Os algoritmos de recomendação já preveem as tuas próximas compras com precisão assustadora. A questão é: isso é um serviço ou uma manipulação?",
    readTime: "7 min",
    date: "Junho 2026",
  },
  {
    slug: "ia-em-portugal",
    emoji: "🇵🇹",
    category: "Sociedade",
    title: "IA em Portugal: estamos prontos ou apenas a fingir que sim?",
    excerpt: "Portugal fala muito de transformação digital. Mas quando olhamos para os números reais o retrato é mais complexo do que parece.",
    readTime: "6 min",
    date: "Abril 2026",
  },
  {
    slug: "do-google-para-a-ia",
    emoji: "🔍",
    category: "Comportamento",
    title: "Deixámos de googlar. Passámos a perguntar à IA. E agora?",
    excerpt: "Durante 25 anos, o Google foi o intermediário entre nós e o conhecimento. Algo mudou. Estamos a fazer perguntas diferentes, a confiar de forma diferente.",
    readTime: "7 min",
    date: "Abril 2026",
  },
  {
    slug: "como-confiar-na-ia",
    emoji: "🤝",
    category: "Reflexão",
    title: "Como confiar na IA — sem ser ingénuo nem paranoico",
    excerpt: "A IA mente. A IA também acerta. Como é que uma pessoa normal decide quando acreditar e quando questionar?",
    readTime: "5 min",
    date: "Abril 2026",
  },
  {
    slug: "ia-e-saude",
    emoji: "🩺",
    category: "Saúde",
    title: "Perguntei à IA os meus sintomas. E agora fico em pânico.",
    excerpt: "Milhões de portugueses já usaram o ChatGPT ou o Google para verificar sintomas. Alguns ficaram descansados. Outros entraram em espiral.",
    readTime: "8 min",
    date: "Abril 2026",
  },
];

export default function Artigos() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1;
