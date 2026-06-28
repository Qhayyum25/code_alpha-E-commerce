import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar       from './components/layout/Navbar';
import CartDrawer   from './components/cart/CartDrawer';
import Toast        from './components/layout/Toast';
import HomePage     from './pages/HomePage';
import ShopPage     from './pages/ShopPage';
import ProductPage  from './pages/ProductPage';
import CartPage     from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage    from './pages/OrderPage';
import OrdersPage   from './pages/OrdersPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage  from './pages/ProfilePage';

function PrivateRoute({ children }) {
  const { token } = useApp();
  return token ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/shop"      element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart"      element={<CartPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/checkout"  element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/orders"    element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/orders/:id"element={<PrivateRoute><OrderPage /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
