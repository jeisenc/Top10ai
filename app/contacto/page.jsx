import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contacto — ai10pt.top",
  description: "Fala connosco: sugestões de guias, erros nos preços ou links, parcerias e questões de privacidade.",
};

const TOPICS = [
  { title: "Sugere um guia", desc: "Procuras um tipo de produto que ainda não comparamos? Diz-nos qual." },
  { title: "Reporta um erro", desc: "Preço errado, link partido ou modelo que já não se vende? Corrigimos depressa." },
  { title: "Parcerias", desc: "Representas uma loja portuguesa e queres colaborar? Fala connosco." },
  { title: "Privacidade", desc: <>Para questões de dados pessoais ou RGPD, vê também a <a href="/privacidade">política de privacidade</a>.</> },
];

export default function Contacto() {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ paddingTop: 40 }}>
        <span className="eyebrow">Contacto</span>
        <h1 className="h1" style={{ margin: "10px 0 12px" }}>Fala connosco</h1>
        <p className="lede">Tens uma sugestão, encontraste um erro ou queres propor uma parceria? Escreve-nos e respondemos o mais depressa possível.</p>
        <div className="two-col" style={{ marginTop: 40, alignItems: "start" }}>
          <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: 24 }}>
            <ContactForm />
          </div>
          <div className="link-list">
            {TOPICS.map((t) => (
              <div key={t.title} style={{ background: "var(--tint)", borderRadius: 14, padding: "18px 20px" }}>
                <strong style={{ display: "block", marginBottom: 4 }}>{t.title}</strong>
                <p style={{ color: "var(--text-2)", lineHeight: 1.5, fontSize: 15 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
