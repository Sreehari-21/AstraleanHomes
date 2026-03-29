import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';

function Chairs() {
  const [chairs, setChairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products?category=chairs`);
        setChairs(response.data);
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
      <section className="page-hero-section chairs-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Chairs</h1>
          <p>Elegant and comfortable chairs for any space</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%' }}>Loading products...</p>
          ) : (
            <div className="category">
              <h2>Chairs</h2>
              <div className="products-grid">
                {chairs.map(chair => (
                  <div key={chair.id} className="product-card">
                    <Link to={`/product/${chair.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img src={chair.image} alt={chair.name} className="product-image" />
                      <h3>{chair.name}</h3>
                    </Link>
                    <p>{chair.description}</p>
                    <span className="price">{chair.price}</span>
                    <Link to={`/product/${chair.id}`} style={{ textDecoration: 'none', marginTop: '1rem', width: '100%' }}>
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

export default Chairs;
