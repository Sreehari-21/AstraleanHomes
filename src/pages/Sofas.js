import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './ProductPage.css';

function Sofas() {
  const { addToCart } = useCart();
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products?category=sofas');
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
          <p>Comfortable and stylish sofas for your living room</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Loading products...</p>
          ) : (
            <div className="products-grid">
              {sofas.map(sofa => (
                <div key={sofa.id} className="product-card">
                  <Link to={`/product/${sofa.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={sofa.image} alt={sofa.name} className="product-image" />
                    <h3>{sofa.name}</h3>
                  </Link>
                  <p>{sofa.description}</p>
                  <span className="price">{sofa.price}</span>
                  <button className="add-to-cart" onClick={() => addToCart(sofa)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Sofas;
