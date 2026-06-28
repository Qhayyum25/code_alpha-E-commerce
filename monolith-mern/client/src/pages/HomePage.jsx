import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { label: 'Fashion',     color: '#3a4a60', slug: 'fashion' },
  { label: 'Electronics', color: '#2a2a2a', slug: 'electronics' },
  { label: 'Home',        color: '#c2b59b', slug: 'home' },
  { label: 'Accessories', color: '#8b6040', slug: 'accessories' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(r => setFeatured(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">New Season 2026</p>
          <h1 className="hero-title">Objects<br/>Worth Keeping</h1>
          <p className="hero-sub">Curated fashion, electronics, and home goods — designed to last.</p>
          <div className="hero-ctas">
            <Link to="/shop" className="btn-primary">Shop All</Link>
            <Link to="/shop?category=home" className="btn-outline">Explore Home</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-block hero-block-1" />
          <div className="hero-block hero-block-2" />
          <div className="hero-block hero-block-3" />
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link to={`/shop?category=${cat.slug}`} key={cat.slug} className="cat-card">
              <div className="cat-color" style={{ background: cat.color }} />
              <div className="cat-label">{cat.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">Featured</h2>
          <Link to="/shop" className="section-link">View All →</Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="banner">
        <div className="banner-inner container">
          <div>
            <h2 className="banner-title">Free Shipping on Orders Over $100</h2>
            <p className="banner-sub">Delivered within 3–5 business days. Easy 30-day returns.</p>
          </div>
          <Link to="/shop" className="btn-primary" style={{background:'#fff', color:'#111', borderColor:'#fff'}}>
            Start Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
