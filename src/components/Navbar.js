import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, cartCount, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link to="/">
            AstraleanHomes
          </Link>
        </div>

        <nav className={`nav-links ${showNav ? 'show' : ''}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setShowNav(false)}>Home</Link>
            </li>
            {isAdmin ? (
              <>
                <li>
                  <Link to="/admin/dashboard" onClick={() => setShowNav(false)}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/products" onClick={() => setShowNav(false)}>View Store</Link>
                </li>
                <li className="user-nav">
                  <span className="user-name">admin</span>
                  <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/products" onClick={() => setShowNav(false)}>Furnitures</Link>
                </li>
                <li>
                  <Link to="/furnishings" onClick={() => setShowNav(false)}>Furnishings</Link>
                </li>
                <li>
                  <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                    <span>🛒</span>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </div>
                </li>
                <li>
                  {user ? (
                    <div className="user-nav">
                      <span className="user-name">{user.email.split('@')[0]}</span>
                      <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                  ) : (
                    <Link to="/login" className="btn" onClick={() => setShowNav(false)}>Login</Link>
                  )}
                </li>
              </>
            )}
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
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>&times;</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <h3>
              <span>Total:</span>
              <span>₹{cartTotal}</span>
            </h3>
            <button className="btn checkout-btn" onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      
      {/* Overlay */}
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}
    </>
  );
}

export default Navbar;
