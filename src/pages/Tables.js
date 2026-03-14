import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './ProductPage.css';

function Tables() {
  const { addToCart } = useCart();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products?category=tables');
        setTables(response.data);
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
      <section className="page-hero-section tables-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Tables</h1>
          <p>Various tables for every room in your home</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Loading products...</p>
          ) : (
            <div className="products-grid">
              {tables.map(table => (
                <div key={table.id} className="product-card">
                  <Link to={`/product/${table.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={table.image} alt={table.name} className="product-image" />
                    <h3>{table.name}</h3>
                  </Link>
                  <p>{table.description}</p>
                  <span className="price">{table.price}</span>
                  <button className="add-to-cart" onClick={() => addToCart(table)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Tables;
