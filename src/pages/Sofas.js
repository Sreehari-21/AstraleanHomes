import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';

function Sofas() {
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products?category=sofas`);
        setSofas(response.data);
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
      <section className="page-hero-section sofas-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Sofas</h1>
          <p>Handcrafted sofas designed for comfort and style</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%' }}>Loading products...</p>
          ) : (
            <div className="category">
              <h2>Sofas</h2>
              <div className="products-grid">
                {sofas.map(sofa => (
                  <div key={sofa.id} className="product-card">
                    <Link to={`/product/${sofa.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img src={sofa.image} alt={sofa.name} className="product-image" />
                      <h3>{sofa.name}</h3>
                    </Link>
                    <p>{sofa.description}</p>
                    <span className="price">{sofa.price}</span>
                    <Link to={`/product/${sofa.id}`} style={{ textDecoration: 'none', marginTop: '1rem', width: '100%' }}>
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

export default Sofas;
