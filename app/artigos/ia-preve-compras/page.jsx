import ArticleLayout from "../ArticleLayout";

export const metadata = {
  title: "A IA sabe o que vais comprar antes de tu saberes. É assustador ou conveniente? — ai10pt.top",
  description: "Os algoritmos de recomendação já preveem as tuas próximas compras com precisão assustadora. A questão é: isso é um serviço ou uma manipulação?",
};

const meta = {
  title: "A IA sabe o que vais comprar antes de tu saberes. É assustador ou conveniente?",
  excerpt: "A Amazon prevê as tuas encomendas antes de as fazeres. O Spotify sabe a tua música favorita antes de a ouvires. A IA está a tornar-se assustadoramente boa a prever comportamento humano.",
  category: "Reflexão",
  readTime: "7 min",
  date: "Junho 2026",
  heroEmoji: "🔮",
  heroCaption: "A IA que prevê o futuro — as tuas compras",
  related: [
    { slug: "como-confiar-na-ia", emoji: "🤝", title: "Como confiar na IA — sem ser ingénuo nem paranoico", readTime: "5 min" },
    { slug: "ia-e-saude", emoji: "🩺", title: "Perguntei à IA os meus sintomas. E agora fico em pânico.", readTime: "8 min" },
  ],
};

export default function Article() {
  return (
    <ArticleLayout meta={meta}>

      <p>Em 2012, a cadeia americana Target conseguiu prever que uma adolescente estava grávida — antes de ela ter dito à própria família. O algoritmo analisou os seus padrões de compra e começou a enviar-lhe cupões de produtos para bebés. O pai ficou furioso. Semanas depois, descobriu que a filha estava efetivamente grávida.</p>

      <p>Esta história parece ficção científica, mas é real. E em 2026, os algoritmos são ordens de magnitude mais sofisticados do que eram em 2012.</p>

      <h2>Como a IA prevê o que vais comprar</h2>

      <p>Não é magia. É matemática aplicada a uma quantidade de dados que o cérebro humano não consegue processar.</p>

      <p>Cada vez que interages com uma plataforma online — pesquisas, clicas, hesitas, abandonas um carrinho, lês uma review — estás a gerar dados. Individualmente, cada um destes sinais é insignificante. Em conjunto, ao longo de semanas e meses, criam um retrato surpreendentemente detalhado dos teus padrões de comportamento.</p>

      <blockquote>
        <p>Não é que a IA te conheça. É que ela conhece milhões de pessoas como tu — e sabe o que elas fizeram a seguir.</p>
      </blockquote>

      <h2>Os exemplos que te vão fazer pensar</h2>

      <p>A Amazon tem uma patente para o que chama de "envio antecipado" — um sistema que enviaria produtos para perto da tua morada antes de tu os encomendares, baseado na previsão de que os vais querer. A tecnologia existe.</p>

      <p>O Netflix não te pergunta o que queres ver. Prevê o que vais gostar baseado em milhares de horas de comportamento anterior. A sua taxa de acerto é suficientemente boa para que 80% do que as pessoas veem seja resultado de recomendações, não de escolhas ativas.</p>

      <p>O TikTok consegue identificar o estado emocional de um utilizador a partir dos seus padrões de scroll e ajustar o conteúdo em tempo real.</p>

      <div className="callout">
        <div className="callout-title">O ai10pt.top e a previsão de tendências</div>
        <p>Nós usamos o Google Trends para prever o que os portugueses vão pesquisar amanhã — e preparamos as listas antecipadamente. É uma forma mais transparente de fazer o mesmo: usar dados públicos de comportamento para antecipar necessidades. <a href="/sobre">Saber mais sobre como funcionamos</a></p>
      </div>

      <h2>A linha entre conveniente e manipulador</h2>

      <p>Aqui está a questão que poucos querem enfrentar: onde fica a linha entre um sistema que te ajuda a encontrar o que precisas e um sistema que manipula o teu comportamento de compra?</p>

      <p>Um sistema que te recomenda um ventilador em junho porque sabe que costumas comprar um todos os verões — isso é conveniente. Um sistema que cria urgência artificial para forçar uma compra que não precisavas de fazer — isso é manipulação.</p>

      <h2>O que podes fazer — praticamente</h2>

      <ul>
        <li><strong>Faz listas de compras antes de abrir qualquer app ou site.</strong> Decidir o que queres antes de seres exposto a algoritmos reduz significativamente compras por impulso.</li>
        <li><strong>Espera 24 horas antes de compras não planeadas.</strong> A urgência que sentes quando vês uma oferta por tempo limitado é frequentemente artificial.</li>
        <li><strong>Questiona as recomendações.</strong> Quando uma plataforma te recomenda algo, pergunta: isto é bom para mim ou bom para a plataforma?</li>
      </ul>

      <h2>É assustador ou conveniente?</h2>

      <p>A resposta honesta é: as duas coisas, ao mesmo tempo. É genuinamente conveniente quando a IA te poupa tempo e te ajuda a encontrar produtos que não conhecias. É genuinamente assustador quando opera de forma invisível e explora vulnerabilidades emocionais.</p>

      <blockquote>
        <p>A IA vai saber o que queres comprar antes de ti. A questão é se tu vais saber que ela sabe — e o que fazes com essa informação.</p>
      </blockquote>

    </ArticleLayout>
  );
}
