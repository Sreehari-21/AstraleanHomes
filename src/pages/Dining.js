import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './ProductPage.css';

function Dining() {
  const { addToCart } = useCart();
  const [diningItems, setDiningItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/products?category=dining');
        setDiningItems(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <section className="page-hero-section dining-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Dining</h1>
          <p>Complete dining room solutions</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Loading products...</p>
          ) : (
            <div className="products-grid">
              {diningItems.map(item => (
                <div key={item.id} className="product-card">
                  <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={item.image} alt={item.name} className="product-image" />
                    <h3>{item.name}</h3>
                  </Link>
                  <p>{item.description}</p>
                  <span className="price">{item.price}</span>
                  <button className="add-to-cart" onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dining;
