import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';

function Decor() {
  const [decor, setDecor] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products?category=decor`);
        setDecor(response.data);
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
      <section className="page-hero-section decor-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Home Decor</h1>
          <p>Handpicked decor items to add personality to your space</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%' }}>Loading products...</p>
          ) : (
            <div className="category">
              <h2>Home Decor</h2>
              <div className="products-grid">
                {decor.map(item => (
                  <div key={item.id} className="product-card">
                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img src={item.image} alt={item.name} className="product-image" />
                      <h3>{item.name}</h3>
                    </Link>
                    <p>{item.description}</p>
                    <span className="price">{item.price}</span>
                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', marginTop: '1rem', width: '100%' }}>
                      <button className="view-product-btn">View Product</button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Decor;
