export const metadata = {
  title: "Sobre — ai10pt.top",
  description: "Sobre o ai10pt.top — o primeiro site português de recomendação de produtos gerado diariamente por inteligência artificial.",
};

export default function Sobre() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        .prose h2 { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 32px 0 12px; letter-spacing: -0.3px; }
        .prose p { font-size: 14px; color: #3d3d3d; line-height: 1.8; margin-bottom: 14px; }
        .prose ul { font-size: 14px; color: #3d3d3d; line-height: 1.8; margin-bottom: 14px; padding-left: 20px; }
        .prose ul li { margin-bottom: 6px; }
        .prose a { color: #c0392b; text-decoration: none; }
        .prose a:hover { text-decoration: underline; }
        .step-card { background: #fff; border: 1.5px solid #d4d0cb; border-radius: 12px; padding: 20px; }
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin: 20px 0; }
        @media (min-width: 600px) { .steps-grid { grid-template-columns: 1fr 1fr; } }
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

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 999, padding: "3px 10px", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sobre nós</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.8px", marginBottom: 16, lineHeight: 1.1 }}>
              O Top 10 mais relevante<br />
              <span style={{ color: "#c0392b" }}>para Portugal</span>, todos os dias
            </h1>
            <p style={{ fontSize: "clamp(14px, 3.5vw, 16px)", color: "#3d3d3d", lineHeight: 1.7, maxWidth: 580 }}>
              O ai10pt.top é o primeiro site português de recomendação de produtos totalmente automatizado por inteligência artificial. Todos os dias, sem intervenção humana, analisamos o que os portugueses mais pesquisam e publicamos uma lista com os 10 melhores produtos dessa categoria.
            </p>
          </div>

          {/* Mission */}
          <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "28px", marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>A nossa missão</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
              Ajudar os portugueses a tomar decisões de compra mais informadas — de forma rápida, gratuita e sem ter de pesquisar em dezenas de sites. A IA faz o trabalho pesado para si.
            </p>
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 6, letterSpacing: "-0.3px" }}>Como funciona?</h2>
            <p style={{ fontSize: 14, color: "#595959", marginBottom: 20, lineHeight: 1.6 }}>
              O processo é completamente automatizado e ocorre todos os dias às 06:00. Aqui está o que acontece nos bastidores:
            </p>

            <div className="steps-grid">
              {[
                { step: "01", icon: "📈", title: "Análise de tendências", desc: "O sistema consulta automaticamente o Google Trends Portugal para identificar os temas mais pesquisados naquele dia." },
                { step: "02", icon: "🧠", title: "IA escolhe a categoria", desc: "O modelo de IA Claude (da Anthropic) cruza as tendências com a época do ano, eventos atuais e histórico recente para escolher a categoria mais relevante." },
                { step: "03", icon: "🛒", title: "Geração do Top 10", desc: "A IA gera uma lista com os 10 melhores produtos disponíveis em Portugal — com preços reais, lojas e justificação para cada escolha." },
                { step: "04", icon: "❓", title: "Perguntas frequentes", desc: "São geradas automaticamente 7 perguntas frequentes sobre a categoria, com respostas detalhadas para ajudar na decisão de compra." },
                { step: "05", icon: "🎬", title: "Vídeos de análise", desc: "Para cada produto, o sistema encontra automaticamente o melhor vídeo de análise em português no YouTube." },
                { step: "06", icon: "⚡", title: "Publicação automática", desc: "Tudo é publicado automaticamente no site sem qualquer intervenção humana, pronto para consulta logo pela manhã." },
              ].map((s, i) => (
                <div key={i} className="step-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#c0392b", background: "#fff8f6", border: "1px solid #f4a995", borderRadius: 999, padding: "2px 8px" }}>
                      Passo {s.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 12, color: "#595959", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency */}
          <div style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 16, padding: "28px", marginBottom: 32 }} className="prose">
            <h2 style={{ marginTop: 0 }}>Transparência e responsabilidade</h2>
            <p>Acreditamos na transparência total sobre o funcionamento do site:</p>
            <ul>
              <li><strong>Conteúdo gerado por IA:</strong> Todas as listas, descrições e respostas são geradas por inteligência artificial. Embora nos esforcemos pela precisão, recomendamos sempre verificar os preços e disponibilidade diretamente nas lojas.</li>
              <li><strong>Links de afiliado:</strong> Alguns links para produtos são links de afiliado. Ao comprar através deles, podemos receber uma pequena comissão sem qualquer custo adicional para si. Isto ajuda a manter o site gratuito.</li>
              <li><strong>Sem patrocínios:</strong> As nossas recomendações não são pagas ou influenciadas por marcas. A IA escolhe os produtos com base em relevância e popularidade.</li>
              <li><strong>Atualização diária:</strong> O site é atualizado automaticamente todos os dias às 06:00, com uma nova categoria escolhida com base nas tendências de pesquisa em Portugal.</li>
            </ul>

            <h2>Tecnologia utilizada</h2>
            <p>O ai10pt.top é construído com tecnologias modernas e de código aberto:</p>
            <ul>
              <li><strong>Frontend:</strong> Next.js, alojado na Vercel</li>
              <li><strong>Base de dados:</strong> Supabase</li>
              <li><strong>Inteligência Artificial:</strong> Claude (Anthropic)</li>
              <li><strong>Tendências:</strong> Google Trends RSS</li>
              <li><strong>Vídeos:</strong> YouTube Data API</li>
              <li><strong>Automação:</strong> GitHub Actions</li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div style={{ background: "#fff8f6", border: "1.5px solid #f4a995", borderRadius: 16, padding: "24px", textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Tem alguma questão ou sugestão?</p>
            <p style={{ fontSize: 13, color: "#595959", marginBottom: 16 }}>Estamos sempre disponíveis para ouvir o seu feedback.</p>
            <a href="/contacto" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "0 24px", background: "#c0392b", color: "#fff", fontSize: 14, fontWeight: 700, borderRadius: 10, textDecoration: "none" }}>
              Entrar em contacto
            </a>
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
