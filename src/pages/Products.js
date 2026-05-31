import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import ProductCard from '../components/ProductCard';
import { getPrimaryImage } from '../utils/categoryImages';
import './ProductPage.css';

const DEFAULT_MAJOR_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

function isValidMajor(major) {
  return major?.id && major?.name && !/^major-\d+$/i.test(major.name);
}

function getMajorImage(major, subCategories) {
  const primary = getPrimaryImage(major);
  if (primary) return primary;

  const match = subCategories.find((sub) => sub.majorId === major.id);
  return getPrimaryImage(match) || DEFAULT_MAJOR_IMAGE;
}

function getMajorDescription(major, majorId, subCategories) {
  if (major?.description) return major.description;

  const names = subCategories
    .filter((sub) => sub.majorId === majorId)
    .map((sub) => sub.name);

  if (names.length === 0) {
    return 'Explore collections in this category.';
  }

  if (names.length <= 3) {
    return `Browse ${names.join(', ')} and more.`;
  }

  return `Browse ${names.slice(0, 3).join(', ')}, and more.`;
}

function Products() {
  const { majorId } = useParams();
  const [categories, setCategories] = useState({ major: [], sub: [], collections: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const majorCategories = categories.major.filter(isValidMajor);
  const selectedMajor = majorId
    ? majorCategories.find((major) => major.id === majorId)
    : null;
  const subcategories = majorId
    ? categories.sub.filter((sub) => sub.majorId === majorId)
    : [];

  if (loading) {
    return (
      <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>
        Loading categories...
      </div>
    );
  }

  if (majorId && !selectedMajor) {
    return (
      <div className="products-page">
        <section className="products-section">
          <div className="container">
            <p style={{ textAlign: 'center' }}>Category not found.</p>
            <Link to="/products" className="category-back-link">
              &lsaquo; Back to Furnitures
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="products-page">
      <section className="page-hero-section products-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>{selectedMajor ? selectedMajor.name : 'Furnitures'}</h1>
          <p>
            {selectedMajor
              ? `Explore ${selectedMajor.name.toLowerCase()} collections crafted for modern living.`
              : 'Browse our premium handcrafted furniture by room and style.'}
          </p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {selectedMajor && (
            <Link to="/products" className="category-back-link">
              &lsaquo; Back to all categories
            </Link>
          )}

          <div className="category">
            <h2>{selectedMajor ? `${selectedMajor.name} Collections` : 'Shop by Room'}</h2>
            <div className="products-grid">
              {selectedMajor ? (
                subcategories.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                    No collections available in this category yet.
                  </p>
                ) : (
                  subcategories.map((cat) => (
                    <ProductCard
                      key={cat.id}
                      href={cat.link}
                      image={getPrimaryImage(cat)}
                      name={cat.name}
                      description={cat.description || `Explore our ${cat.name.toLowerCase()} range.`}
                      buttonText="Explore Collection"
                    />
                  ))
                )
              ) : (
                majorCategories.map((major) => (
                  <ProductCard
                    key={major.id}
                    href={`/products/${major.id}`}
                    image={getMajorImage(major, categories.sub)}
                    name={major.name}
                    description={getMajorDescription(major, major.id, categories.sub)}
                    buttonText="Explore Collection"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
