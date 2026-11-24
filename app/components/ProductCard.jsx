import { brandOf, priceText, buyLabel, roleLabel } from "../../lib/site";

export function ProductImage({ item, className = "" }) {
  return (
    <div className={`pimg ${className}`}>
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} loading="lazy" />
      ) : (
        <span className="pimg-brand" aria-hidden="true">{brandOf(item.name)}</span>
      )}
    </div>
  );
}

export function firstSentence(text) {
  const s = String(text || "").trim();
  const m = s.match(/^.+?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

function Minus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--con)" strokeWidth="2.5" aria-hidden="true">
      <path d="M6 12h12" />
    </svg>
  );
}

function BuyButton({ item, className = "btn" }) {
  return (
    <a className={className} href={item.url} target="_blank" rel="nofollow sponsored noopener">
      {buyLabel(item)}
    </a>
  );
}

// Full card used for the top 5.
export default function ProductCard({ item, specs = [], date }) {
  const role = roleLabel(item.tag);
  const price = priceText(item);
  const pros = item.pros || [];
  const cons = item.cons || [];
  const specValues = specs.filter((s) => item.specs?.[s.key]);

  return (
    <article className="product" id={`n${item.rank}`}>
      <ProductImage item={item} />
      <div className="product-body">
        <div className="product-head">
          <span className="rank-box" aria-label={`Número ${item.rank}`}>{item.rank}</span>
          {role && <span className="badge">{role}</span>}
        </div>
        <h3 className="product-name">{item.name}</h3>
        <p className="product-who">
          {item.para_quem ? (<><strong>Para quem:</strong> {item.para_quem}</>) : item.reason_pt}
        </p>

        {(pros.length > 0 || cons.length > 0) && (
          <div className="proscons">
            {pros.length > 0 && (
              <div className="pro">
                <h4>A favor</h4>
                <ul>{pros.map((p, i) => <li key={i}><Check />{p}</li>)}</ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="con">
                <h4>Contra</h4>
                <ul>{cons.map((c, i) => <li key={i}><Minus />{c}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {specValues.length > 0 && (
          <div className="specs">
            {specValues.map((s) => (
              <span key={s.key} className="spec"><b>{s.label}:</b> {item.specs[s.key]}</span>
            ))}
          </div>
        )}

        <div className="product-foot">
          <div className="price">
            {price ? (
              <>
                <strong>{price}</strong>
                <small>Preço indicativo{date ? ` · ${date}` : ""}</small>
              </>
            ) : (
              <small>Preço atual na {item.store}</small>
            )}
          </div>
          <div className="product-actions">
            {item.youtube?.videoId && (
              <a
                className="video-link"
                href={`https://www.youtube.com/watch?v=${item.youtube.videoId}`}
                target="_blank"
                rel="noopener"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9l5 3-5 3z" fill="currentColor" />
                </svg>
                Ver review em vídeo
              </a>
            )}
            <BuyButton item={item} />
          </div>
        </div>
      </div>
    </article>
  );
}

// Compact row used for nº 6–10.
export function ProductRow({ item }) {
  const price = priceText(item);
  return (
    <div className="row" id={`n${item.rank}`}>
      <span className="n">{item.rank}</span>
      <ProductImage item={item} />
      <div className="row-body">
        <strong>{item.name}</strong>
        <span>{item.best_for || firstSentence(item.reason_pt)}</span>
      </div>
      {price && <span className="row-price">{price}</span>}
      <BuyButton item={item} className="btn btn-outline" />
    </div>
  );
}

// Card used in the "Escolha rápida" row.
export function PickCard({ item }) {
  const role = roleLabel(item.tag);
  const price = priceText(item);
  return (
    <article className="pick">
      <span className="badge" style={{ alignSelf: "flex-start" }}>{role || `Nº ${item.rank}`}</span>
      <ProductImage item={item} />
      <h3 className="hd">{item.name}</h3>
      <p>{item.best_for || firstSentence(item.reason_pt)}</p>
      <div className="pick-foot">
        <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 20 }}>{price || ""}</span>
        <a className="btn" href={item.url} target="_blank" rel="nofollow sponsored noopener">
          {price ? item.store : `Ver na ${item.store}`}
        </a>
      </div>
    </article>
  );
}
