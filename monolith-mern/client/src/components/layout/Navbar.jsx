import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount, setCartOpen } = useApp();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const active = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">MONOLITH</Link>

        <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/shop" className={active('/shop')} onClick={() => setMenuOpen(false)}>Shop All</Link>
          <Link to="/shop?category=fashion" onClick={() => setMenuOpen(false)}>Fashion</Link>
          <Link to="/shop?category=electronics" onClick={() => setMenuOpen(false)}>Electronics</Link>
          <Link to="/shop?category=home" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop?category=accessories" onClick={() => setMenuOpen(false)}>Accessories</Link>
        </nav>

        <div className="navbar-right">
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <div className="user-dropdown">
                <Link to="/profile">Profile</Link>
                <Link to="/orders">Orders</Link>
                {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                <button onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">Log In</Link>
          )}

          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button className="burger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </header>
  );
}
