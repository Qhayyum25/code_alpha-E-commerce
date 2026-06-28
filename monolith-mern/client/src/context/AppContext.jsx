import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user,    setUser]    = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token,   setToken]   = useState(() => localStorage.getItem('token') || '');
  const [cart,    setCart]    = useState(null);
  const [toast,   setToast]   = useState({ msg: '', show: false });
  const [cartOpen,setCartOpen]= useState(false);

  // Show toast helper
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  }, []);

  // Auth helpers
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setCart(null);
  };

  // Cart helpers
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch { setCart(null); }
  }, [token]);

  const addToCart = async (productId, qty = 1) => {
    const { data } = await api.post('/cart', { productId, qty });
    setCart(data);
    showToast('Added to cart');
    setCartOpen(true);
  };

  const updateCartItem = async (productId, qty) => {
    const { data } = await api.put(`/cart/${productId}`, { qty });
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart(null);
  };

  const cartCount = cart?.items?.reduce((s, i) => s + i.qty, 0) || 0;
  const cartTotal = cart?.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;

  useEffect(() => { fetchCart(); }, [fetchCart]);

  return (
    <AppContext.Provider value={{
      user, token, login, register, logout,
      cart, cartCount, cartTotal, fetchCart,
      addToCart, updateCartItem, removeFromCart, clearCart,
      cartOpen, setCartOpen,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
