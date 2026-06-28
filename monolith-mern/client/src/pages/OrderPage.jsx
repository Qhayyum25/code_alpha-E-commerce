import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import './OrderPage.css';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderPage() {
  const { id } = useParams();
  const location = useLocation();
  const isSuccess = location.state?.success;

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!order)  return <div className="container" style={{padding:'60px 40px'}}><p>Order not found. <Link to="/orders">View Orders</Link></p></div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <main className="order-page container">
      {isSuccess && (
        <div className="order-success-banner">
          <span>✓</span>
          <div>
            <strong>Order Placed Successfully!</strong>
            <p>Thank you for your purchase. Your order is being processed.</p>
          </div>
        </div>
      )}

      <div className="order-header">
        <div>
          <h1 className="order-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <span className={`order-status-badge status-${order.status}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="order-tracker">
          {STATUS_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`tracker-step ${i <= stepIdx ? 'done' : ''}`}>
                <div className="tracker-circle">
                  {i < stepIdx ? '✓' : i === stepIdx ? '●' : '○'}
                </div>
                <span>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`tracker-line ${i < stepIdx ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="order-layout">
        {/* Items */}
        <div className="order-items-col">
          <h2 className="col-title">Items Ordered</h2>
          {order.items.map((item, i) => (
            <div key={i} className="order-item">
              <div className="order-item-img" style={{ background: item.color || '#ddd' }} />
              <div className="order-item-info">
                <p className="order-item-name">{item.name}</p>
                <p className="order-item-qty">Quantity: {item.qty}</p>
                <p className="order-item-unit">${item.price.toFixed(2)} each</p>
              </div>
              <p className="order-item-total">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}

          {/* Shipping */}
          <div className="order-info-block">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p>{order.shippingAddress.country}</p>
          </div>

          {/* Payment */}
          <div className="order-info-block">
            <h3>Payment</h3>
            <p>{order.paymentMethod}</p>
            <p className={order.isPaid ? 'paid-status' : 'unpaid-status'}>
              {order.isPaid
                ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : '✕ Not paid yet'}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="order-summary-col">
          <h2 className="col-title">Order Total</h2>
          <div className="summary-row"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{order.shippingCost===0?'Free':`$${order.shippingCost.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
          <div className="divider" style={{margin:'14px 0'}} />
          <div className="summary-row summary-total"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>

          <div style={{marginTop:'24px', display:'flex', flexDirection:'column', gap:'10px'}}>
            <Link to="/orders" className="btn-outline" style={{textAlign:'center'}}>← All Orders</Link>
            <Link to="/shop" className="btn-primary" style={{textAlign:'center'}}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
