import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useApp } from '../context/AppContext';
import './ProductPage.css';

function Stars({ rating, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          className={`star ${n <= (interactive ? (hover || rating) : Math.round(rating)) ? 'filled' : ''}`}
          style={interactive ? { cursor: 'pointer', fontSize: '22px' } : {}}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(n)}
        >★</span>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, token, user } = useApp();
  const navigate = useNavigate();

  const [product,    setProduct]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [qty,        setQty]        = useState(1);
  const [tab,        setTab]        = useState('description');
  const [activeImg,  setActiveImg]  = useState(0);
  const [review,     setReview]     = useState({ rating: 5, comment: '' });
  const [revError,   setRevError]   = useState('');
  const [revOk,      setRevOk]      = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); setActiveImg(0); }, [id]);

  const handleAddToCart = () => {
    if (!token) { navigate('/login'); return; }
    addToCart(product._id, qty);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!review.comment.trim()) { setRevError('Please write a comment.'); return; }
    setSubmitting(true); setRevError('');
    try {
      await api.post(`/products/${id}/reviews`, review);
      setRevOk(true);
      setReview({ rating: 5, comment: '' });
      load();
    } catch (err) {
      setRevError(err.response?.data?.message || 'Failed to submit review.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return (
    <div className="container" style={{padding:'80px 40px'}}>
      <p>Product not found. <Link to="/shop">Back to shop</Link></p>
    </div>
  );

  const inStock = product.stock > 0;

  // Build thumb images array (main image + 2 color variants)
  const thumbColors = [product.color || '#e0ddd8', '#d8d4ce', '#c8c0b8'];

  return (
    <main className="product-page container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/shop">Shop</Link> <span>/</span>
        <Link to={`/shop?category=${product.category}`}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link> <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="product-layout">
        {/* Images */}
        <div className="product-image-wrap">
          <div className="product-main-image" style={{ background: product.color || '#e0ddd8' }}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-main-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
            )}
            {!inStock && <div className="oos-ribbon">Out of Stock</div>}
          </div>

          <div className="product-thumbs">
            {thumbColors.map((c, i) => (
              <div
                key={i}
                className={`product-thumb ${activeImg === i ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setActiveImg(i)}
              >
                {i === 0 && product.image && (
                  <img src={product.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}
                    onError={e => { e.target.style.display='none'; }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info-panel">
          <p className="product-category-tag">{product.category}</p>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating-row">
            <Stars rating={product.rating} />
            <span className="product-reviews-count">
              {product.numReviews > 0
                ? `${product.numReviews} review${product.numReviews > 1 ? 's' : ''}`
                : 'No reviews yet'}
            </span>
          </div>

          <p className="product-price">${product.price.toLocaleString()}</p>

          <p className={`product-stock-status ${inStock ? 'in-stock' : 'out-stock'}`}>
            {inStock ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock'}
          </p>

          {inStock && (
            <div className="product-qty-row">
              <label className="qty-label">Quantity</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button className="btn-primary product-add-btn" onClick={handleAddToCart} disabled={!inStock}>
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="product-meta-list">
            <div className="meta-row"><span>SKU</span><span>{product._id.slice(-8).toUpperCase()}</span></div>
            <div className="meta-row"><span>Category</span><span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></div>
            <div className="meta-row"><span>Availability</span><span>{inStock ? 'In Stock' : 'Out of Stock'}</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="tab-bar">
          {['description', 'reviews'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'reviews' && product.numReviews > 0 && ` (${product.numReviews})`}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="tab-content">
            <p className="product-description">{product.description}</p>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="tab-content">
            {product.reviews.length === 0 && <p className="no-reviews">No reviews yet — be the first!</p>}
            <div className="reviews-list">
              {product.reviews.map(r => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <div>
                      <span className="review-author">{r.name}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>

            {token ? (
              <form className="review-form" onSubmit={handleReview}>
                <h3 className="review-form-title">Write a Review</h3>
                {revError && <div className="error-msg">{revError}</div>}
                {revOk    && <div className="success-msg">Review submitted! Thank you.</div>}
                <div className="review-rating-pick">
                  <label>Your Rating</label>
                  <Stars interactive rating={review.rating} onRate={r => setReview(rv => ({ ...rv, rating: r }))} />
                </div>
                <textarea
                  placeholder="Share your experience with this product…"
                  value={review.comment}
                  onChange={e => setReview(rv => ({ ...rv, comment: e.target.value }))}
                  rows={4}
                  required
                />
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p className="review-login-prompt">
                <Link to="/login">Log in</Link> to write a review.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
