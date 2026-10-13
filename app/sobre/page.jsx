import { SiteHeader, SiteFooter } from "../components/SiteChrome";

export const metadata = {
  title: "Sobre e como escolhemos — ai10pt.top",
  description: "Como o ai10pt.top escolhe os produtos dos guias de compra, como usa IA, e como funcionam os links de afiliado.",
};

export default function Sobre() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow" style={{ paddingTop: 40 }}>
        <span className="eyebrow">Sobre</span>
        <h1 className="h1" style={{ margin: "10px 0 14px" }}>Guias de compra para a casa, feitos para Portugal</h1>
        <p className="lede">
          O ai10pt.top compara os aspiradores, robots aspiradores e outros equipamentos para casa que se compram hoje em Portugal, e
          diz-te qual escolher para a tua casa e o teu orçamento.
        </p>

        <div className="prose" style={{ marginTop: 32 }}>
          <h2 id="como-escolhemos" style={{ scrollMarginTop: 90 }}>Como escolhemos</h2>
          <p>Cada guia segue os mesmos critérios:</p>
          <ul>
            <li><strong>À venda em Portugal.</strong> Só entram modelos que se compram hoje na Worten ou na Amazon.es, com entrega em Portugal.</li>
            <li><strong>Para quem é.</strong> Cada modelo tem um perfil claro (casas com animais, apartamentos pequenos, orçamento apertado) e os seus pontos fracos ditos sem rodeios.</li>
            <li><strong>Leque de preços.</strong> Sempre que faz sentido, cada guia inclui uma opção económica, uma de gama média e uma de topo.</li>
            <li><strong>Revisão regular.</strong> Os guias são revistos todas as semanas e cada página mostra a data da última atualização.</li>
          </ul>

          <h2>Como usamos IA</h2>
          <p>
            Usamos o Claude, um modelo de inteligência artificial da Anthropic, para juntar especificações, preços indicativos e análises,
            e para redigir as descrições e as perguntas frequentes. A lista de guias e os critérios são definidos por nós. A IA pode errar:
            confirma sempre o preço e as características na loja antes de comprar.
          </p>

          <h2 id="afiliados" style={{ scrollMarginTop: 90 }}>Links de afiliado</h2>
          <p>
            Os botões das lojas são links de afiliado. Se comprares através deles, podemos receber uma comissão da loja, sem custo adicional
            para ti. É assim que o site se mantém gratuito. Como Afiliado da Amazon, recebo por compras qualificadas efetuadas.
          </p>
          <p>
            As comissões não mudam a ordem dos produtos e nenhuma marca paga para aparecer nos guias. Os preços mostrados são indicativos e
            mudam com frequência; nos produtos da Amazon não mostramos preço, porque as regras do programa não o permitem.
          </p>

          <h2>Fala connosco</h2>
          <p>
            Encontraste um preço errado, um link partido ou um modelo que já não se vende? <a href="/contacto">Escreve-nos</a> e corrigimos.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
