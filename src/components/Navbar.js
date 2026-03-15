import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, cartCount, removeFromCart, updateQuantity } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Calculate cartTotal locally, ensuring price parsing handles '₹'
  const cartTotal = cartItems.reduce((total, item) => {
    // Ensure item.price is treated as a string before replace, and handle potential non-numeric values
    const price = parseFloat(String(item.price).replace('₹', '')) || 0;
    return total + (price * item.quantity);
  }, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">AstraleanHomes</div>
        <nav className={`nav-links ${showNav ? 'show' : ''}`}>
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            {isAdmin ? (
              // Admin Navigation Links
              <>
                <li><Link to="/admin/dashboard" className="nav-link">Dashboard</Link></li>
                <li><Link to="/admin/products" className="nav-link">Products</Link></li>
                <li><Link to="/admin/orders" className="nav-link">Orders</Link></li>
                <li><Link to="/admin/settings" className="nav-link">Settings</Link></li>
              </>
            ) : (
              // Regular User/Guest Navigation Links
              <>
                <li><Link to="/products" className="nav-link">Furnitures</Link></li>
                <li><Link to="/furnishings" className="nav-link">Furnishings</Link></li>
                <li><Link to="/contact" className="nav-link">Contact</Link></li>
                <li className="cart-icon" onClick={() => setIsCartOpen(true)}>
                  Cart <span className="cart-badge">{cartCount}</span>
                </li>
              </>
            )}
            <li className="login-btn">
              {user ? (
                <>
                  <span className="user-name">
                    {user.email} {isAdmin && '(Admin)'}
                  </span>
                  <button onClick={handleLogout} className="btn logout-btn">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn">Login</Link>
              )}
            </li>
          </ul>
        </nav>
        <div 
          className="hamburger"
          onClick={() => setShowNav(!showNav)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>Your Cart ({cartCount})</h2>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>
                  <div className="cart-item-actions">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <h3>Total: ₹{cartTotal.toFixed(2)}</h3>
            <button className="btn checkout-btn" onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      
      {/* Overlay to close cart */}
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}
    </>
  );
}

export default Navbar;
