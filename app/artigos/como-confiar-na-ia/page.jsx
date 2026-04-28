import ArticleLayout from "../ArticleLayout";

export const metadata = {
  title: "Como confiar na IA — sem ser ingénuo nem paranoico — ai10pt.top",
  description: "A IA mente. A IA também acerta. Como é que uma pessoa normal decide quando acreditar e quando questionar? É mais simples do que pensas.",
};

const meta = {
  title: "Como confiar na IA — sem ser ingénuo nem paranoico",
  excerpt: "A IA mente. A IA também acerta. Como é que uma pessoa normal, sem doutoramento em machine learning, decide quando acreditar e quando questionar? É mais simples do que pensas.",
  category: "Reflexão",
  readTime: "5 min",
  date: "Abril 2026",
  heroEmoji: "🤝",
  heroCaption: "Confiança não é tudo ou nada — é uma questão de calibração",
  related: [
    { slug: "do-google-para-a-ia", emoji: "🔍", title: "Deixámos de googlar. Passámos a perguntar à IA.", readTime: "7 min" },
    { slug: "ia-e-saude", emoji: "🩺", title: "Perguntei à IA os meus sintomas. E agora fico em pânico.", readTime: "8 min" },
  ],
};

export default function Article() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        Existe um paradoxo estranho na nossa relação com a inteligência artificial. Por um lado, há pessoas que acreditam em tudo o que a IA diz — como se fosse uma enciclopédia infalível, uma fonte de verdade absoluta. Por outro, há quem desconfie de tudo — "isso é só uma máquina, não percebe nada de verdade."
      </p>

      <p>
        As duas posições estão erradas. E perceber porquê pode mudar a forma como usas estas ferramentas todos os dias.
      </p>

      <h2>Primeiro, vamos ser honestos sobre o que a IA faz</h2>

      <p>
        Os modelos de linguagem — o ChatGPT, o Claude, o Gemini — não "sabem" coisas da forma como tu sabes. Não têm memórias de experiências vividas. Não verificam factos em tempo real. O que fazem é gerar texto que é <em>estatisticamente plausível</em> baseado em padrões de imenso texto que processaram durante o treino.
      </p>

      <p>
        Isto significa duas coisas importantes. Primeiro: a IA é muito boa a produzir texto que soa convincente e bem estruturado — mesmo quando está errada. Segundo: a IA é mais fiável em domínios onde existe muito texto de qualidade sobre o assunto, e menos fiável em domínios obscuros, muito recentes, ou altamente especializados.
      </p>

      <blockquote>
        <p>A IA não sabe que não sabe. E isso é, provavelmente, o aspeto mais perigoso dela.</p>
      </blockquote>

      <h2>O conceito de "alucinação" — e por que é importante</h2>

      <p>
        Os investigadores de IA chamam "alucinação" ao fenómeno em que um modelo inventa informação com total confiança. Cita livros que não existem. Atribui frases a pessoas que nunca as disseram. Descreve estudos científicos que nunca foram feitos.
      </p>

      <p>
        Não é malícia — é uma limitação estrutural. O modelo está a completar padrões, e às vezes o padrão mais plausível simplesmente não corresponde à realidade.
      </p>

      <p>
        A boa notícia é que as alucinações têm padrões. São mais comuns em: detalhes específicos (datas, números, nomes), factos pouco conhecidos ou recentes, e quando a pergunta pressupõe algo que pode não ser verdade.
      </p>

      <h2>Um guia prático para calibrar a confiança</h2>

      <p>
        Aqui está uma forma simples de pensar sobre quando confiar e quando verificar:
      </p>

      <div className="callout">
        <div className="callout-title">Confia mais quando...</div>
        <p>
          O assunto é amplo e bem documentado. A resposta não depende de detalhes específicos muito precisos. Podes verificar facilmente com uma pesquisa rápida. A decisão tem consequências baixas se estiver errada.
        </p>
      </div>

      <div className="callout">
        <div className="callout-title">Verifica sempre quando...</div>
        <p>
          Envolve saúde, finanças, ou questões legais. A resposta inclui datas, números, ou nomes específicos. A decisão tem consequências significativas. O assunto é muito recente ou muito especializado.
        </p>
      </div>

      <h2>A regra do "cheira bem?"</h2>

      <p>
        Há uma heurística simples que funciona surpreendentemente bem: se a resposta te parece demasiado perfeita, demasiado completa, demasiado alinhada exatamente com o que querias ouvir — questiona.
      </p>

      <p>
        A realidade é complicada. As respostas reais a perguntas difíceis têm nuances, exceções, incertezas. Quando a IA te dá uma resposta redondinha que não deixa espaço para dúvida, isso é muitas vezes um sinal de que está a simplificar demais — ou a inventar.
      </p>

      <h2>Como usar a IA para verificar a própria IA</h2>

      <p>
        Uma técnica pouco conhecida mas muito útil: usa a IA para te ajudar a questionar as suas próprias respostas. Depois de receberes uma resposta, podes perguntar: "Que partes desta resposta tens menos certeza? O que eu devia verificar?" Os bons modelos reconhecem as suas próprias limitações quando questionados diretamente.
      </p>

      <p>
        Podes também pedir perspetivas alternativas: "Há quem discorde desta visão? Quais são os principais contra-argumentos?" Isto força o modelo a apresentar a complexidade que muitas vezes omite na primeira resposta.
      </p>

      <blockquote>
        <p>Trata a IA como tratarias um colega muito inteligente mas às vezes descuidado — útil, valioso, mas que merece uma segunda verificação nas coisas importantes.</p>
      </blockquote>

      <h2>O caso especial das recomendações de produtos</h2>

      <p>
        Para recomendações de compras — que é muito do que fazemos neste site — a IA tem vantagens e desvantagens específicas.
      </p>

      <p>
        A vantagem: consegue processar e sintetizar muita informação sobre produtos, especificações e preços de forma rápida. Consegue entender o contexto da pergunta — o teu orçamento, as tuas necessidades, o mercado onde estás.
      </p>

      <p>
        A desvantagem: os preços mudam todos os dias. As promoções aparecem e desaparecem. Um produto pode ter sido excelente há seis meses e ter problemas de qualidade agora. Por isso, usamos a IA para selecionar e recomendar — mas sempre com o princípio de que <strong>deves verificar os preços reais nas lojas antes de comprar</strong>. <a href="/">Ver o Top 10 de hoje →</a>
      </p>

      <h2>A linha de fundo</h2>

      <p>
        Confiar na IA não é uma questão de tudo ou nada. É uma questão de calibração — perceber para que tarefas é fiável, para que tarefas precisa de supervisão, e para que tarefas simplesmente não deve ser usada como fonte principal.
      </p>

      <p>
        As pessoas que melhor aproveitam a IA não são as que confiam cegamente nela — são as que percebem as suas limitações e as usam de forma estratégica. Como qualquer ferramenta poderosa, o valor está em saber usá-la bem.
      </p>

    </ArticleLayout>
  );
}
