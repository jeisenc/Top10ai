import { CATEGORIES, GROUPS, categoriesInGroup } from "../../lib/site";

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Logo({ tagline = true }) {
  return (
    <a href="/" className="logo" aria-label="ai10pt.top — início">
      <span className="logo-mark" aria-hidden="true">10</span>
      <span className="logo-text">
        <span className="logo-name">ai10pt<span>.top</span></span>
        {tagline && <span className="logo-tag">Guias de compra para a casa</span>}
      </span>
    </a>
  );
}

// active: the slug of the current guide, or "artigos" on article pages.
export function SiteHeader({ active }) {
  const activeGroup = CATEGORIES.find((c) => c.slug === active)?.group;
  return (
    <header className="site-header">
      <div className="container">
        <Logo />
        <nav className="nav" aria-label="Principal">
          {Object.entries(GROUPS).map(([group, label]) => (
            <div key={group} className="nav-item">
              <a href={`/#${group}`} className={`nav-link${group === activeGroup ? " active" : ""}`}>
                {label} <Chevron />
              </a>
              <div className="nav-pop">
                {categoriesInGroup(group).map((c) => (
                  <a key={c.slug} href={`/${c.slug}`} aria-current={c.slug === active ? "page" : undefined}>
                    {c.short}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div className="nav-item">
            <a href="/artigos" className={`nav-link${active === "artigos" ? " active" : ""}`}>Artigos</a>
          </div>
        </nav>

        <details className="menu-mobile">
          <summary aria-label="Abrir menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav className="menu-panel" aria-label="Menu">
            {Object.entries(GROUPS).map(([group, label]) => (
              <div key={group}>
                <h3>{label}</h3>
                {categoriesInGroup(group).map((c) => (
                  <a key={c.slug} href={`/${c.slug}`} aria-current={c.slug === active ? "page" : undefined}>
                    {c.short}
                  </a>
                ))}
              </div>
            ))}
            <h3>Mais</h3>
            <a href="/artigos">Artigos</a>
            <a href="/sobre">Como escolhemos</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo tagline={false} />
          <p style={{ color: "var(--muted)", marginTop: 10, lineHeight: 1.55 }}>Guias de compra para a casa, feitos para Portugal.</p>
        </div>
        {Object.entries(GROUPS).map(([group, label]) => (
          <nav key={group} aria-label={label}>
            <strong>{label}</strong>
            {categoriesInGroup(group).map((c) => (
              <a key={c.slug} href={`/${c.slug}`}>{c.short}</a>
            ))}
          </nav>
        ))}
        <nav aria-label="ai10pt.top">
          <strong>ai10pt.top</strong>
          <a href="/sobre">Como escolhemos</a>
          <a href="/artigos">Artigos</a>
          <a href="/privacidade">Privacidade</a>
          <a href="/contacto">Contacto</a>
        </nav>
      </div>
      <div className="container">
        <p className="footer-note">
        Este site contém links de afiliado: se comprares através deles podemos receber uma comissão, sem custo adicional para ti.
        Como Afiliado da Amazon, recebo por compras qualificadas efetuadas. Os preços são indicativos e podem mudar — confirma sempre na loja.
        </p>
      </div>
    </footer>
  );
}
