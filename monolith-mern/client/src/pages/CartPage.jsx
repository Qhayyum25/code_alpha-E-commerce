import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart, user } = useApp();
  const navigate = useNavigate();
  const items = cart?.items || [];

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax      = parseFloat((cartTotal * 0.08).toFixed(2));
  const total    = parseFloat((cartTotal + shipping + tax).toFixed(2));

  if (items.length === 0) {
    return (
      <main className="cart-page container">
        <h1 className="cart-title">Your Cart</h1>
        <div className="cart-empty-state">
          <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page container">
      <h1 className="cart-title">Your Cart <span>({items.reduce((s,i)=>s+i.qty,0)} items)</span></h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-col">
          <div className="cart-items-header">
            <span>Product</span><span>Price</span><span>Qty</span><span>Subtotal</span><span></span>
          </div>
          <div className="divider" />

          {items.map(item => (
            <div key={item.product} className="cart-row">
              <div className="cart-row-product">
                <Link to={`/product/${item.product}`}>
                  <div className="cart-row-img" style={{ background: item.color || '#ddd' }} />
                </Link>
                <div className="cart-row-meta">
                  <Link to={`/product/${item.product}`} className="cart-row-name">{item.name}</Link>
                  <button className="cart-row-remove" onClick={() => removeFromCart(item.product)}>Remove</button>
                </div>
              </div>
              <span className="cart-row-price">${item.price.toFixed(2)}</span>
              <div className="qty-control">
                <button onClick={() => updateCartItem(item.product, item.qty-1)} disabled={item.qty<=1}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateCartItem(item.product, item.qty+1)} disabled={item.qty>=(item.stock||99)}>+</button>
              </div>
              <span className="cart-row-subtotal">${(item.price*item.qty).toFixed(2)}</span>
              <button className="cart-row-delete" onClick={() => removeFromCart(item.product)} aria-label="Remove">✕</button>
            </div>
          ))}

          <div className="cart-actions">
            <Link to="/shop" className="btn-outline">← Continue Shopping</Link>
            <button className="btn-outline" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="divider" style={{margin:'16px 0'}} />
          <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          {cartTotal < 100 && (
            <p className="free-shipping-note">Add ${(100 - cartTotal).toFixed(2)} more for free shipping!</p>
          )}
          <button
            className="btn-primary"
            style={{width:'100%', marginTop:'20px', padding:'16px'}}
            onClick={() => navigate(user ? '/checkout' : '/login')}
          >
            {user ? 'Proceed to Checkout' : 'Log In to Checkout'}
          </button>
        </div>
      </div>
    </main>
  );
}
