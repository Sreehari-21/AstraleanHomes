import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
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
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AstraleanHome. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
