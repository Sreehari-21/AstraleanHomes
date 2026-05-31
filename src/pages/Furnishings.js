import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './ProductPage.css';

function Furnishings() {
  const [furnishings, setFurnishings] = useState([]);
  const [decor, setDecor] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [furnResponse, decorResponse] = await Promise.all([
          axios.get(`${API_URL}/api/products?category=furnishings`),
          axios.get(`${API_URL}/api/products?category=decor`)
        ]);
        setFurnishings(furnResponse.data);
        setDecor(decorResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="products-page">
      <section className="page-hero-section furnishings-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Furnishings & Decor</h1>
          <p>Premium soft furnishings and handpicked decor to elevate your space</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%' }}>Loading collections...</p>
          ) : (
            <>
              <div className="category">
                <h2>Soft Furnishings</h2>
                <div className="products-grid">
                  {furnishings.map((item) => (
                    <ProductCard
                      key={item.id}
                      href={`/product/${item.id}`}
                      image={item.image}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>

              <div className="category" style={{ marginTop: '6rem' }}>
                <h2>Home Decor</h2>
                <div className="products-grid">
                  {decor.map((item) => (
                    <ProductCard
                      key={item.id}
                      href={`/product/${item.id}`}
                      image={item.image}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Furnishings;
