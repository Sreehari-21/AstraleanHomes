import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';

function QueenBeds() {
  const [queenBeds, setQueenBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products?category=queenbeds`);
        setQueenBeds(response.data);
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
      <section className="page-hero-section beds-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Queen Beds</h1>
          <p>Elegant queen size beds perfect for any bedroom</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Loading products...</p>
          ) : (
            <div className="products-grid">
              {queenBeds.map(bed => (
                <div key={bed.id} className="product-card">
                  <Link to={`/product/${bed.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={bed.image} alt={bed.name} className="product-image" />
                    <h3>{bed.name}</h3>
                  </Link>
                  <p>{bed.description}</p>
                  <span className="price">{bed.price}</span>
                  <Link to={`/product/${bed.id}`} style={{ textDecoration: 'none', marginTop: '1rem', width: '100%' }}>
                    <button className="view-product-btn">View Product</button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default QueenBeds;