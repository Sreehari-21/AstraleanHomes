import { Link } from 'react-router-dom';

function ProductCard({
  href,
  image,
  name,
  description,
  price,
  buttonText = 'View Product',
}) {
  return (
    <div className="product-card">
      <Link to={href} className="product-card-media" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={image} alt={name} className="product-image" />
        <h3>{name}</h3>
      </Link>
      <p>{description}</p>
      {price ? <span className="price">{price}</span> : <span className="price price-placeholder" aria-hidden="true" />}
      <Link to={href} className="product-card-action" style={{ textDecoration: 'none', marginTop: '1rem', width: '100%' }}>
        <button type="button" className="view-product-btn">{buttonText}</button>
      </Link>
    </div>
  );
}

export default ProductCard;
