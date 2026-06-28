import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './ShopPage.css';

const CATEGORIES = ['all', 'fashion', 'electronics', 'home', 'accessories'];
const SORTS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name',       label: 'Name A–Z' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);

  const category = searchParams.get('category') || 'all';
  const sort     = searchParams.get('sort')     || 'featured';
  const search   = searchParams.get('search')   || '';
  const page     = Number(searchParams.get('page') || 1);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { category, sort, search, page, limit: 12 } });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [category, sort, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <main className="shop-page">
      {/* Page header */}
      <div className="shop-header container">
        <div className="shop-header-top">
          <div>
            <p className="catalog-label">— Catalog</p>
            <h1 className="catalog-title">
              {category === 'all' ? 'Shop All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
          </div>
          <div className="shop-search">
            <input
              type="text" placeholder="Search products…"
              value={search}
              onChange={e => setParam('search', e.target.value)}
            />
          </div>
        </div>

        {/* Filter + sort bar */}
        <div className="shop-controls">
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setParam('category', cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="sort-row">
            <span className="item-count">{total} Item{total !== 1 ? 's' : ''}</span>
            <div className="sort-select">
              <span>Sort:</span>
              <select value={sort} onChange={e => setParam('sort', e.target.value)}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="divider" />
      </div>

      {/* Grid */}
      <div className="container shop-grid-wrap">
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <p>No products found.</p>
            <button className="btn-outline" onClick={() => setSearchParams({})}>Clear filters</button>
          </div>
        ) : (
          <>
            <div className="shop-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`page-btn ${page === n ? 'active' : ''}`}
                    onClick={() => setParam('page', n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
