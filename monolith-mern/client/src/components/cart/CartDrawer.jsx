import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, updateCartItem, removeFromCart, user } = useApp();
  const navigate = useNavigate();
  const items = cart?.items || [];

  const handleCheckout = () => {
    setCartOpen(false);
    navigate(user ? '/checkout' : '/login');
  };

  return (
    <>
      <div className={`drawer-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Your Cart {items.length > 0 && `(${items.reduce((s,i)=>s+i.qty,0)})`}</h2>
          <button className="drawer-close" onClick={() => setCartOpen(false)} aria-label="Close">✕</button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your cart is empty.</p>
              <Link to="/shop" className="btn-outline" onClick={() => setCartOpen(false)}>Shop Now</Link>
            </div>
          ) : (
            items.map(item => (
              <div className="drawer-item" key={item.product}>
                <div className="drawer-item-color" style={{ background: item.color || '#ccc' }} />
                <div className="drawer-item-info">
                  <Link to={`/product/${item.product}`} onClick={() => setCartOpen(false)} className="drawer-item-name">
                    {item.name}
                  </Link>
                  <p className="drawer-item-price">${item.price.toFixed(2)}</p>
                  <div className="drawer-item-qty">
                    <button onClick={() => updateCartItem(item.product, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateCartItem(item.product, item.qty + 1)} disabled={item.qty >= (item.stock || 99)}>+</button>
                  </div>
                </div>
                <div className="drawer-item-right">
                  <p className="drawer-item-total">${(item.price * item.qty).toFixed(2)}</p>
                  <button className="drawer-item-remove" onClick={() => removeFromCart(item.product)} aria-label="Remove">✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <p className="drawer-shipping-note">Shipping & tax calculated at checkout</p>
            <button className="btn-primary" style={{width:'100%'}} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/cart" className="btn-outline drawer-view-cart" onClick={() => setCartOpen(false)}>
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
