import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useApp } from '../context/AppContext';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart, cartTotal, fetchCart, user } = useApp();
  const navigate = useNavigate();
  const items = cart?.items || [];

  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const [shipping, setShipping] = useState({
    name:    user?.name    || '',
    street:  user?.address?.street  || '',
    city:    user?.address?.city    || '',
    state:   user?.address?.state   || '',
    zip:     user?.address?.zip     || '',
    country: user?.address?.country || '',
  });

  const [payment, setPayment] = useState({
    method:  'Card',
    cardNum: '',
    expiry:  '',
    cvv:     '',
    nameOnCard: '',
  });

  const shippingCost = cartTotal > 100 ? 0 : 9.99;
  const tax          = parseFloat((cartTotal * 0.08).toFixed(2));
  const total        = parseFloat((cartTotal + shippingCost + tax).toFixed(2));

  const handleShippingNext = (e) => {
    e.preventDefault();
    const { name, street, city, state, zip, country } = shipping;
    if (!name || !street || !city || !state || !zip || !country) {
      setError('Please fill all shipping fields.'); return;
    }
    setError(''); setStep(1);
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();
    if (payment.method === 'Card') {
      if (!payment.cardNum || !payment.expiry || !payment.cvv || !payment.nameOnCard) {
        setError('Please fill all card details.'); return;
      }
    }
    setError(''); setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true); setError('');
    try {
      const { data: order } = await api.post('/orders', {
        shippingAddress: shipping,
        paymentMethod: payment.method,
      });
      // Mock payment
      await api.put(`/orders/${order._id}/pay`, {});
      await fetchCart();
      navigate(`/orders/${order._id}`, { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    navigate('/cart'); return null;
  }

  return (
    <main className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>

      {/* Step indicator */}
      <div className="step-bar">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`step-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-col">
          {error && <div className="error-msg">{error}</div>}

          {/* STEP 0 — Shipping */}
          {step === 0 && (
            <form className="checkout-form" onSubmit={handleShippingNext}>
              <h2 className="form-section-title">Shipping Address</h2>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name</label>
                  <input value={shipping.name} onChange={e=>setShipping(s=>({...s,name:e.target.value}))} placeholder="John Doe" required />
                </div>
                <div className="form-group full">
                  <label>Street Address</label>
                  <input value={shipping.street} onChange={e=>setShipping(s=>({...s,street:e.target.value}))} placeholder="123 Main Street" required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input value={shipping.city} onChange={e=>setShipping(s=>({...s,city:e.target.value}))} placeholder="New York" required />
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <input value={shipping.state} onChange={e=>setShipping(s=>({...s,state:e.target.value}))} placeholder="NY" required />
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input value={shipping.zip} onChange={e=>setShipping(s=>({...s,zip:e.target.value}))} placeholder="10001" required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input value={shipping.country} onChange={e=>setShipping(s=>({...s,country:e.target.value}))} placeholder="United States" required />
                </div>
              </div>
              <button type="submit" className="btn-primary checkout-next-btn">Continue to Payment →</button>
            </form>
          )}

          {/* STEP 1 — Payment */}
          {step === 1 && (
            <form className="checkout-form" onSubmit={handlePaymentNext}>
              <h2 className="form-section-title">Payment Method</h2>
              <div className="payment-methods">
                {['Card', 'PayPal', 'Cash on Delivery'].map(m => (
                  <label key={m} className={`payment-option ${payment.method===m?'selected':''}`}>
                    <input type="radio" name="method" value={m}
                      checked={payment.method===m}
                      onChange={()=>setPayment(p=>({...p,method:m}))} />
                    {m === 'Card' && '💳 '}
                    {m === 'PayPal' && '🅿️ '}
                    {m === 'Cash on Delivery' && '💵 '}
                    {m}
                  </label>
                ))}
              </div>

              {payment.method === 'Card' && (
                <div className="form-grid card-fields">
                  <div className="form-group full">
                    <label>Name on Card</label>
                    <input value={payment.nameOnCard} onChange={e=>setPayment(p=>({...p,nameOnCard:e.target.value}))} placeholder="John Doe" />
                  </div>
                  <div className="form-group full">
                    <label>Card Number</label>
                    <input value={payment.cardNum}
                      onChange={e=>setPayment(p=>({...p,cardNum:e.target.value.replace(/\D/g,'').slice(0,16)}))}
                      placeholder="4242 4242 4242 4242" maxLength={16} />
                  </div>
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input value={payment.expiry} onChange={e=>setPayment(p=>({...p,expiry:e.target.value}))} placeholder="12/28" maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input value={payment.cvv} onChange={e=>setPayment(p=>({...p,cvv:e.target.value.replace(/\D/g,'').slice(0,4)}))} placeholder="123" maxLength={4} type="password" />
                  </div>
                  <p className="card-note full">🔒 This is a demo — no real payment is processed.</p>
                </div>
              )}

              <div className="form-nav-row">
                <button type="button" className="btn-outline" onClick={()=>setStep(0)}>← Back</button>
                <button type="submit" className="btn-primary">Review Order →</button>
              </div>
            </form>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div className="checkout-form">
              <h2 className="form-section-title">Review Order</h2>

              <div className="review-section">
                <div className="review-section-head">
                  <span>Shipping to</span>
                  <button className="edit-link" onClick={()=>setStep(0)}>Edit</button>
                </div>
                <p>{shipping.name}</p>
                <p>{shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                <p>{shipping.country}</p>
              </div>

              <div className="review-section">
                <div className="review-section-head">
                  <span>Payment</span>
                  <button className="edit-link" onClick={()=>setStep(1)}>Edit</button>
                </div>
                <p>{payment.method}{payment.method==='Card' && payment.cardNum ? ` ending in ${payment.cardNum.slice(-4)}` : ''}</p>
              </div>

              <div className="form-nav-row">
                <button type="button" className="btn-outline" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn-primary place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="checkout-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="checkout-items">
            {items.map(item => (
              <div key={item.product} className="checkout-item">
                <div className="checkout-item-img" style={{background: item.color||'#ddd'}} />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-qty">Qty: {item.qty}</p>
                </div>
                <p className="checkout-item-price">${(item.price*item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="divider" style={{margin:'16px 0'}} />
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost===0?'Free':`$${shippingCost.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="divider" style={{margin:'16px 0'}} />
          <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </main>
  );
}
