import React from 'react';
import { Link } from 'react-router-dom';
import './ProductPage.css';

function Products() {

  const categories = [
    { title: 'Sofas', link: '/sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Premium living room seating' },
    { title: 'Beds', link: '/beds', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Luxury frames and comfort' },
    { title: 'Tables', link: '/tables', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Dining and coffee tables' },
    { title: 'Chairs', link: '/chairs', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Elegant and ergonomic' },
    { title: 'Dining', link: '/dining', image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Complete dining sets' },
    { title: 'Storage', link: '/storage', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Cabinets and shelves' }
  ];

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
              <div key={index} className="product-card">
                <img src={cat.image} alt={cat.title} className="product-image" />
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <span className="price">Explore Collection</span>
                <Link to={cat.link} style={{ display: 'block', textDecoration: 'none' }}>
                  <button className="add-to-cart">View {cat.title}</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
