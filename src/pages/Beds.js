import React from 'react';
import { Link } from 'react-router-dom';
import './ProductPage.css';

function Beds() {
  const bedTypes = [
    {
      id: 1,
      name: 'King Beds',
      description: 'Luxury king size beds for ultimate comfort.',
      image: '/bed1.png',
      link: '/king-beds'
    },
    {
      id: 2,
      name: 'Queen Beds',
      description: 'Elegant queen size beds perfect for any bedroom.',
      image: '/bed2.png',
      link: '/queen-beds'
    }
  ];

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
          <div className="products-grid">
            {bedTypes.map(type => (
              <Link key={type.id} to={type.link} className="product-card-link">
                <div className="product-card">
                  <img src={type.image} alt={type.name} className="product-image" />
                  <h3>{type.name}</h3>
                  <p>{type.description}</p>
                  <button className="view-catalog">View Catalog</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Beds;
