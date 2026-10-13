"use client";

import { useState } from "react";

const SUBJECTS = {
  geral: "Contacto geral",
  sugestao: "Sugestão de guia",
  erro: "Reportar um erro",
  afiliado: "Parceria / Afiliado",
  privacidade: "Questão de privacidade",
  outro: "Outro",
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("geral");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Opens the visitor's email client with the message filled in.
    const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);
    const subjectLine = encodeURIComponent(`[ai10pt.top] ${SUBJECTS[subject]}`);
    window.location.href = `mailto:contacto@ai10pt.top?subject=${subjectLine}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ padding: "24px 0" }}>
        <h2 className="h2" style={{ marginBottom: 8 }}>Falta só um passo</h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.6, marginBottom: 20 }}>
          Abrimos o teu programa de e-mail com a mensagem preenchida. Carrega em "Enviar" lá para a recebermos.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>Escrever outra mensagem</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="c-subject">Assunto</label>
        <select id="c-subject" className="form-input form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="c-name">Nome</label>
        <input id="c-name" type="text" className="form-input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="c-email">E-mail</label>
        <input id="c-email" type="email" className="form-input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="c-msg">Mensagem</label>
        <textarea id="c-msg" className="form-input form-textarea" value={message} onChange={(e) => setMessage(e.target.value)} required />
      </div>
      <button type="submit" className="btn" style={{ width: "100%", minHeight: 48 }}>Enviar mensagem</button>
    </form>
  );
}
