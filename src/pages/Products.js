import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import './ProductPage.css';

function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
        // We want to show the subcategories here as they were the original "categories"
        setCategories(response.data.sub || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>Loading Categories...</div>;

  return (
    <div className="products-page">
      <section className="page-hero-section products-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Furnitures</h1>
          <p>Browse our premium handcrafted furniture categories designed for modern living.</p>
        </div>
      </section>

      <section className="products-container">
        <div className="category">
          <h2>Shop by Category</h2>
            <div className="products-grid">
              {categories.map((cat, index) => (
                <div key={cat.id || index} className="product-card" style={{ paddingBottom: '2rem' }}>
                  <Link to={cat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={cat.image} alt={cat.name} className="product-image" />
                    <h3 style={{ textAlign: 'center', marginTop: '1.5rem' }}>{cat.name}</h3>
                  </Link>
                  <div style={{ padding: '0 1.5rem', marginTop: '1rem' }}>
                    <Link to={cat.link} style={{ textDecoration: 'none' }}>
                      <button className="explore-btn" style={{ width: '100%', margin: 0 }}>Explore Collection</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
