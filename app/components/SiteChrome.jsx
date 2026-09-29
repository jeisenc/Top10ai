import { CATEGORIES } from "../../lib/site";

export function Logo() {
  return (
    <a href="/" className="logo" aria-label="ai10pt.top — início">
      <span className="a">ai</span><span className="b">10</span><span className="a">pt</span><span className="c">.top</span>
    </a>
  );
}

export function SiteHeader({ active }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo />
        <nav className="nav-scroll" aria-label="Categorias">
          {CATEGORIES.map((c) => (
            <a key={c.slug} href={`/${c.slug}`} className={`pill${c.slug === active ? " active" : ""}`}>
              {c.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Logo />
          <nav className="footer-links">
            <a href="/artigos">Artigos</a>
            <a href="/sobre">Sobre</a>
            <a href="/privacidade">Privacidade</a>
            <a href="/contacto">Contacto</a>
          </nav>
        </div>
        <p>
          Este site contém links de afiliado: se comprares através deles podemos receber uma comissão, sem custo adicional para ti.
          As listas são preparadas com ajuda de IA; os preços são indicativos e podem mudar — confirma sempre na loja.
        </p>
      </div>
    </footer>
  );
}
