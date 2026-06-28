import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './ProductCard.css';

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating.toFixed(1)} stars`}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, token } = useApp();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!token) { window.location.href = '/login'; return; }
    addToCart(product._id);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="card-image-link">
        <div className="card-image" style={{ background: product.color || '#e0ddd8' }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="card-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : null}
          {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
        </div>
        <button className="card-quick-add" onClick={handleAdd} disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </Link>

      <div className="card-info">
        <div className="card-meta">
          <span className="card-category">{product.category}</span>
          {product.numReviews > 0 && (
            <div className="card-rating">
              <Stars rating={product.rating} />
              <span className="card-review-count">({product.numReviews})</span>
            </div>
          )}
        </div>
        <div className="card-bottom">
          <Link to={`/product/${product._id}`} className="card-name">{product.name}</Link>
          <span className="card-price">${product.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
