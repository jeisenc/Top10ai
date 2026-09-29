import YouTubeEmbed from "./YouTubeEmbed";

const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function ProductCard({ item, emoji }) {
  const isTop = item.rank <= 3;
  return (
    <article className={`product${isTop ? " top" : ""}`}>
      <div className="product-row">
        <div className="product-thumb" aria-hidden="true">
          {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : emoji}
        </div>

        <div className="product-body">
          <h2 className="product-name">
            {item.name}
            {item.tag && <span className={`tag${item.tag === "Melhor escolha" ? " best" : ""}`}>{item.tag}</span>}
          </h2>
          <p className="product-reason">{item.reason_pt}</p>
        </div>

        <div className="product-side">
          <span className={`rank${MEDALS[item.rank] ? " medal" : ""}`}>{MEDALS[item.rank] || item.rank}</span>
          {item.show_price && (
            <span className="price">
              ~€{item.price_eur}
              <small>preço indicativo</small>
            </span>
          )}
          <a className="buy" href={item.url} target="_blank" rel="nofollow sponsored noopener">
            Ver na {item.store} →
          </a>
        </div>
      </div>
      {item.youtube && <YouTubeEmbed video={item.youtube} />}
    </article>
  );
}
