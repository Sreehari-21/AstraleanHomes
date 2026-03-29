import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import axios from 'axios';
import './Footer.css';

function Footer() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAdmin || isAuthPage) {
    return null;
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_URL}/api/enquiries`, { email });
      setStatus({ type: 'success', message: 'Thank you for subscribing!' });
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>AstraleanHomes</h3>
          <p>Your destination for premium, stylish, and comfortable home furniture. We believe in quality that lasts a lifetime.</p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Furnitures</Link></li>
            <li><Link to="/furnishings">Furnishings</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/contact">Track Order</Link></li>
            <li><Link to="/contact">Returns & Exchanges</Link></li>
            <li><Link to="/contact">Shipping Information</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Newsletter</h4>
          <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
          {status.message && (
            <p className={`newsletter-status ${status.type}`}>
              {status.message}
            </p>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AstraleanHome. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
