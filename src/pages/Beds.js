import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import './ProductPage.css';

function Beds() {
  const [bedTypes, setBedTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
        // Filter collections for beds
        const collections = response.data.collections || [];
        setBedTypes(collections.filter(c => c.subId === 'beds'));
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) return <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>Loading Collections...</div>;
  

  return (
    <div>
      <section className="page-hero-section beds-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Beds</h1>
          <p>Choose your bed size and explore our collections</p>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          <div className="category">
            <h2>Beds Collections</h2>
            <div className="products-grid">
              {bedTypes.map(type => (
                <div key={type.id} className="product-card" style={{ paddingBottom: '2rem' }}>
                  <Link to={type.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={type.image} alt={type.name} className="product-image" />
                    <h3 style={{ textAlign: 'center', marginTop: '1.5rem' }}>{type.name}</h3>
                  </Link>
                  <div style={{ padding: '0 1.5rem', marginTop: '1rem' }}>
                    <Link to={type.link} style={{ textDecoration: 'none' }}>
                      <button className="explore-btn" style={{ width: '100%', margin: 0 }}>Explore Collection</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Beds;
