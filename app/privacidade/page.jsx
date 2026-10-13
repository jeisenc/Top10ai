import { SiteHeader, SiteFooter } from "../components/SiteChrome";

export const metadata = {
  title: "Política de Privacidade — ai10pt.top",
  description: "Política de privacidade do ai10pt.top. Informação sobre cookies, dados pessoais, links de afiliado e conteúdo preparado com IA.",
};

export default function Privacidade() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow" style={{ paddingTop: 40 }}>
        <span className="eyebrow">Legal</span>
        <h1 className="h1" style={{ margin: "10px 0 8px" }}>Política de Privacidade</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Última atualização: outubro de 2026</p>
        <div className="prose" style={{ marginTop: 32 }}>

            <p>O ai10pt.top respeita a sua privacidade e compromete-se a proteger os seus dados pessoais. Esta política explica como recolhemos, utilizamos e protegemos as suas informações quando visita o nosso site.</p>

            <h2>1. Quem Somos</h2>
            <p>O ai10pt.top é um site de guias de compra para o mercado português, preparados com a ajuda de inteligência artificial. O site é operado a título individual por um residente em Portugal.</p>
            <p>Para questões relacionadas com privacidade, pode contactar-nos através da nossa <a href="/contacto">página de contacto</a>.</p>

            <h2>2. Dados que Recolhemos</h2>
            <p>O ai10pt.top não tem contas de utilizador, votações nem newsletter, e não recolhe dados pessoais diretamente. Se nos escrever através da página de contacto, usamos o seu e-mail apenas para responder.</p>
            <p>Não recolhemos nomes, moradas, números de telefone ou quaisquer outros dados pessoais sem o seu consentimento explícito.</p>

            <h2>3. Cookies e Tecnologias Similares</h2>
            <p>O ai10pt.top utiliza cookies e tecnologias similares para:</p>
            <ul>
              <li><strong>Cookies de publicidade:</strong> O Google AdSense pode utilizar cookies para mostrar anúncios relevantes com base nas suas visitas anteriores a este e outros sites. Pode optar por não receber publicidade personalizada em <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Definições de anúncios do Google</a>.</li>
              <li><strong>Vídeos:</strong> Os links para análises em vídeo abrem o YouTube, que tem a sua própria política de cookies.</li>
            </ul>
            <p>Pode controlar e/ou eliminar cookies nas definições do seu browser. Para mais informações, visite <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>.</p>

            <h2>4. Links de Afiliado</h2>
            <p>O ai10pt.top participa em programas de afiliados, incluindo o Programa de Associados da Amazon. Isto significa que alguns links para produtos externos são links de afiliado — se comprar um produto através desses links, podemos receber uma comissão, sem qualquer custo adicional para si.</p>
            <p>Todos os links de afiliado estão identificados com o atributo <code>rel="sponsored"</code>. As nossas recomendações são geradas por IA com base em relevância e não são influenciadas por comissões de afiliado.</p>

            <h2>5. Conteúdo Gerado por Inteligência Artificial</h2>
            <p>As listas de produtos, descrições, títulos e respostas a perguntas frequentes publicadas neste site são geradas automaticamente por modelos de inteligência artificial (Claude, da Anthropic). Embora nos esforcemos por garantir a precisão das informações, recomendamos que verifique sempre os preços e disponibilidade diretamente nas lojas antes de efetuar qualquer compra.</p>

            <h2>6. Publicidade — Google AdSense</h2>
            <p>O ai10pt.top utiliza o Google AdSense para mostrar anúncios. O Google utiliza cookies DART para mostrar anúncios aos visitantes com base nas suas visitas anteriores a este site e a outros sites na Internet. Os utilizadores podem desativar a utilização do cookie DART visitando a <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Política de privacidade da rede de conteúdo e anúncios do Google</a>.</p>

            <h2>7. Serviços de Terceiros</h2>
            <p>O nosso site utiliza os seguintes serviços de terceiros, cada um com a sua própria política de privacidade:</p>
            <ul>
              <li><strong>Google AdSense</strong> — publicidade</li>
              <li><strong>YouTube</strong> — links para análises de produtos em vídeo</li>
              <li><strong>Supabase</strong> — armazenamento de dados</li>
              <li><strong>Vercel</strong> — alojamento do site</li>
              <li><strong>Anthropic (Claude)</strong> — geração de conteúdo por IA</li>
            </ul>

            <h2>8. Os Seus Direitos (RGPD)</h2>
            <p>Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), tem direito a:</p>
            <ul>
              <li>Aceder aos seus dados pessoais</li>
              <li>Retificar dados incorretos</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Opor-se ao tratamento dos seus dados</li>
              <li>Apresentar uma reclamação à CNPD (Comissão Nacional de Proteção de Dados)</li>
            </ul>
            <p>Para exercer qualquer um destes direitos, contacte-nos através da nossa <a href="/contacto">página de contacto</a>.</p>

            <h2>9. Segurança dos Dados</h2>
            <p>Implementamos medidas técnicas adequadas para proteger os seus dados contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet é 100% seguro.</p>

            <h2>10. Alterações a Esta Política</h2>
            <p>Podemos atualizar esta política de privacidade periodicamente. Publicaremos quaisquer alterações nesta página com uma data de atualização revista. Recomendamos que consulte esta página regularmente.</p>

            <h2>11. Contacto</h2>
            <p>Se tiver questões sobre esta política de privacidade, contacte-nos através da nossa <a href="/contacto">página de contacto</a>.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
