import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    state: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/settings`);
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    try {
      const orderPayload = {
        items: cartItems,
        total: cartTotal,
        shippingAddress: address,
        paymentMethod,
        userEmail: user?.email || 'guest',
        status: 'pending'
      };

      await axios.post(`${API_URL}/api/orders`, orderPayload);
      alert('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error('Order failed', err);
      alert('Failed to place order.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-wrapper">
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <section className="form-section">
              <h3>Shipping Address</h3>
              <div className="form-group grid">
                <input type="text" name="fullName" placeholder="Full Name" onChange={handleInputChange} required />
                <input type="text" name="phone" placeholder="Phone Number" onChange={handleInputChange} required />
              </div>
              <input type="text" name="street" placeholder="Street Address" onChange={handleInputChange} required />
              <div className="form-group grid">
                <input type="text" name="city" placeholder="City" onChange={handleInputChange} required />
                <input type="text" name="pincode" placeholder="Pincode" onChange={handleInputChange} required />
              </div>
            </section>

            <section className="form-section settings-info">
              <h3>Order Information</h3>
              {settings && (
                <div className="info-box">
                  <p><strong>🚚 Estimated Delivery:</strong> {settings.store?.deliveryDuration}</p>
                  <p><strong>📝 GST Details:</strong> {settings.store?.gstNumber || 'Price includes GST'}</p>
                  <div className="terms-scroll">
                    <strong>Terms & Conditions:</strong>
                    <p>{settings.store?.termsAndConditions}</p>
                  </div>
                </div>
              )}
              <label className="checkbox-label">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
                I agree to the terms and conditions
              </label>
            </section>

            <section className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label>
                  <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  Cash on Delivery (COD)
                </label>
                {settings?.payment?.razorpayEnabled && (
                  <label>
                    <input type="radio" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                    Pay Online (Razorpay)
                  </label>
                )}
              </div>
            </section>

            <button type="submit" className="place-order-btn">
              Place Order (₹{cartTotal})
            </button>
          </form>

          <aside className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>
            <div className="total">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
