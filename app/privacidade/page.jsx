import Head from "next/head";

export const metadata = {
  title: "Política de Privacidade — ai10pt.top",
  description: "Política de privacidade do ai10pt.top. Informação sobre cookies, dados pessoais, links de afiliado e conteúdo gerado por IA.",
};

export default function Privacidade() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        .prose h2 { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 32px 0 12px; letter-spacing: -0.3px; }
        .prose h3 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 24px 0 8px; }
        .prose p { font-size: 14px; color: #3d3d3d; line-height: 1.8; margin-bottom: 14px; }
        .prose ul { font-size: 14px; color: #3d3d3d; line-height: 1.8; margin-bottom: 14px; padding-left: 20px; }
        .prose ul li { margin-bottom: 6px; }
        .prose a { color: #c0392b; text-decoration: none; }
        .prose a:hover { text-decoration: underline; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1.5px solid #d4d0cb", padding: "0 16px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", height: 52 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>ai</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>10</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>pt</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#767676" }}>.top</span>
            </a>
          </div>
        </header>

        <main style={{ maxWidth: 820, margin: "0 auto", padding: "40px 16px 64px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Legal</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.8px", marginBottom: 8 }}>
              Política de Privacidade
            </h1>
            <p style={{ fontSize: 13, color: "#595959" }}>Última atualização: abril de 2026</p>
          </div>

          <div className="prose" style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 16, padding: "32px 28px" }}>

            <p>O ai10pt.top respeita a sua privacidade e compromete-se a proteger os seus dados pessoais. Esta política explica como recolhemos, utilizamos e protegemos as suas informações quando visita o nosso site.</p>

            <h2>1. Quem Somos</h2>
            <p>O ai10pt.top é um site de recomendação de produtos para o mercado português, com listas geradas automaticamente por inteligência artificial com base em tendências de pesquisa. O site é operado a título individual por um residente em Portugal.</p>
            <p>Para questões relacionadas com privacidade, pode contactar-nos através da nossa <a href="/contacto">página de contacto</a>.</p>

            <h2>2. Dados que Recolhemos</h2>
            <p>O ai10pt.top recolhe um mínimo de dados. Especificamente:</p>
            <ul>
              <li><strong>Dados de navegação:</strong> O seu browser pode armazenar localmente a sua preferência de voto (através de localStorage) para evitar votos duplicados. Estes dados ficam no seu dispositivo e não são enviados para os nossos servidores.</li>
              <li><strong>Dados de votos:</strong> Quando participa na votação diária, registamos o número de votos por opção. Não armazenamos qualquer identificador pessoal associado ao seu voto.</li>
              <li><strong>Dados de newsletter:</strong> Se subscrever a nossa newsletter, recolhemos o seu endereço de e-mail exclusivamente para o envio de atualizações diárias.</li>
            </ul>
            <p>Não recolhemos nomes, moradas, números de telefone ou quaisquer outros dados pessoais sem o seu consentimento explícito.</p>

            <h2>3. Cookies e Tecnologias Similares</h2>
            <p>O ai10pt.top utiliza cookies e tecnologias similares para:</p>
            <ul>
              <li><strong>Cookies funcionais:</strong> Necessários para o funcionamento do site, como preferências de votação.</li>
              <li><strong>Cookies de publicidade:</strong> O Google AdSense pode utilizar cookies para mostrar anúncios relevantes com base nas suas visitas anteriores a este e outros sites. Pode optar por não receber publicidade personalizada em <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Definições de anúncios do Google</a>.</li>
              <li><strong>Cookies de vídeo:</strong> Quando reproduz vídeos do YouTube incorporados no site, o YouTube pode definir cookies no seu browser.</li>
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
              <li><strong>YouTube</strong> — vídeos incorporados de análise de produtos</li>
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

        {/* Footer */}
        <footer style={{ borderTop: "1.5px solid #d4d0cb", padding: "24px 16px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
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
    </>
  );
}
