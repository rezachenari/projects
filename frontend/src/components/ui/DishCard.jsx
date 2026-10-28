export default function DishCard({ dish }) {
  const unavailable = !dish.is_available;

  return (
    <article className={`dish-card ${unavailable ? 'is-unavailable' : ''}`}>
      <div className="dish-card__media">
        <img src={dish.image_url} alt={dish.image_alt} loading="lazy" decoding="async" width="640" height="480" />
        <div className="dish-card__tags">
          {unavailable ? <span className="badge badge--muted">امشب تمام شد</span> : null}
          {(dish.tags || []).map((tag) => (
            <span className="badge" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="dish-card__body">
        <div className="dish-card__head">
          <h3 className="dish-card__title">{dish.name}</h3>
          {dish.price_label ? <span className="dish-card__price">{dish.price_label}</span> : null}
        </div>
        <p className="dish-card__desc">{dish.description}</p>
      </div>
    </article>
  );
}
