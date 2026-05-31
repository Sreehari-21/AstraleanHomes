import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import ProductCard from '../components/ProductCard';
import { getPrimaryImage } from '../utils/categoryImages';
import './ProductPage.css';

function Beds() {
  const [bedTypes, setBedTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
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

  if (loading) {
    return <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>Loading Collections...</div>;
  }

  return (
    <div className="products-page">
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
              {bedTypes.map((type) => (
                <ProductCard
                  key={type.id}
                  href={type.link}
                  image={getPrimaryImage(type)}
                  name={type.name}
                  description={type.description || 'Explore this curated collection for your space.'}
                  buttonText="Explore Collection"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Beds;
