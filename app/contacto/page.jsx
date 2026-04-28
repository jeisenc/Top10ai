"use client";

import { useState } from "react";

export default function Contacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("geral");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Opens default email client with pre-filled message
    const body = encodeURIComponent(`Nome: ${name}\n\nMensagem:\n${message}`);
    const subjectLine = encodeURIComponent(`[ai10pt.top] ${subject === "afiliado" ? "Parceria/Afiliado" : subject === "erro" ? "Reportar erro" : subject === "sugestao" ? "Sugestão" : "Contacto geral"}`);
    window.location.href = `mailto:contacto@ai10pt.top?subject=${subjectLine}&body=${body}`;
    setSent(true);
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); background: #f8f7f4; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .form-input { width: 100%; font-family: var(--font-jakarta, 'Plus Jakarta Sans', sans-serif); font-size: 14px; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #d4d0cb; background: #fff; color: #1a1a1a; outline: none; transition: border-color 0.15s; min-height: 44px; }
        .form-input:focus { border-color: #c0392b; }
        .form-textarea { min-height: 140px; resize: vertical; }
        .form-select { appearance: none; cursor: pointer; }
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
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contacto</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.8px", marginBottom: 8 }}>
              Fale connosco
            </h1>
            <p style={{ fontSize: 14, color: "#595959", lineHeight: 1.7, maxWidth: 520 }}>
              Tem uma sugestão, encontrou um erro, ou quer propor uma parceria? Envie-nos uma mensagem e respondemos o mais rapidamente possível.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>

            {/* Contact form */}
            <div style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 16, padding: "28px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Mensagem enviada!</h2>
                  <p style={{ fontSize: 14, color: "#595959", lineHeight: 1.6, marginBottom: 24 }}>
                    O seu cliente de e-mail foi aberto com a mensagem pré-preenchida. Clique em "Enviar" no seu e-mail para completar o envio.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    style={{ fontSize: 13, fontWeight: 600, padding: "8px 20px", borderRadius: 8, border: "1.5px solid #d4d0cb", background: "#fff", color: "#3d3d3d", cursor: "pointer" }}
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Assunto</label>
                    <select
                      className="form-input form-select"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    >
                      <option value="geral">Contacto geral</option>
                      <option value="sugestao">Sugestão de categoria</option>
                      <option value="erro">Reportar um erro</option>
                      <option value="afiliado">Parceria / Afiliado</option>
                      <option value="privacidade">Questão de privacidade</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="O seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="o-seu-email@exemplo.pt"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mensagem</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Descreva a sua questão ou sugestão..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ width: "100%", minHeight: 48, background: "#c0392b", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
                  >
                    Enviar mensagem
                  </button>
                </form>
              )}
            </div>

            {/* Info cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "💡", title: "Sugestões de categorias", desc: "Tem uma ideia para uma nova categoria? Adoramos receber sugestões dos nossos utilizadores." },
                { icon: "🐛", title: "Reportar erros", desc: "Encontrou um preço errado, um link quebrado ou outro problema? Diga-nos e corrigimos rapidamente." },
                { icon: "🤝", title: "Parcerias", desc: "Representa uma marca ou loja portuguesa e quer colaborar? Entre em contacto para discutir oportunidades." },
                { icon: "🔒", title: "Questões de privacidade", desc: "Para questões relacionadas com dados pessoais ou o RGPD, consulte também a nossa política de privacidade." },
              ].map((card, i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{card.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{card.title}</p>
                    <p style={{ fontSize: 12, color: "#595959", lineHeight: 1.5 }}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
