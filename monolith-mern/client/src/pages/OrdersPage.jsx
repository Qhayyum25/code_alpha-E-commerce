import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <main className="orders-page container">
      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items.reduce((s,i)=>s+i.qty,0)} item{order.items.reduce((s,i)=>s+i.qty,0)!==1?'s':''}</td>
                  <td><strong>${order.totalPrice.toFixed(2)}</strong></td>
                  <td>
                    <span className={`order-status-badge status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase()+order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={order.isPaid ? 'paid-tag' : 'unpaid-tag'}>
                      {order.isPaid ? '✓ Paid' : '✕ Unpaid'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="view-order-link">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
