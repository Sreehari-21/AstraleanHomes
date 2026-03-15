import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    { title: 'Explore Sofas', link: '/sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Beds', link: '/beds', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Furnishings', link: '/furnishings', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Tables', link: '/tables', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Chairs', link: '/chairs', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Dining', link: '/dining', image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Storage', link: '/storage', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { title: 'Explore Decor', link: '/decor', image: 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const getDotClass = (index) => {
    const diff = Math.abs(index - slideIndex);
    const total = slides.length;
    const normalizedDiff = Math.min(diff, total - diff);
    
    if (normalizedDiff === 0) return 'center';
    if (normalizedDiff === 1) return 'left right'; 
    if (normalizedDiff === 2) return 'far-left far-right'; 
    return '';
  };

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home-page">
      <section className="page-hero home-hero">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`mySlides fade ${index === slideIndex ? 'active' : ''}`}
            >
              <Link to={slide.link}>
                <img src={slide.image} alt={slide.title} />
                <div className="slide-overlay"></div>
                <div className="text">{slide.title}</div>
              </Link>
            </div>
          ))}

          <button className="nav-btn prev" onClick={prevSlide}>&#10094;</button>
          <button className="nav-btn next" onClick={nextSlide}>&#10095;</button>

          <div className="dots-container">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${getDotClass(index)}`}
                onClick={() => setSlideIndex(index)}
              ></span>
            ))}
          </div>
        </div>
        <div className="overlay"></div>
        <div className="page-hero-content">
          <h1>Welcome to AstraleanHomes</h1>
          <p>Discover premium furniture for your dream home</p>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose AstraleanHomes?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Premium Quality</h3>
            <p>Handpicked furniture from top brands</p>
          </div>
          <div className="card">
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping nationwide</p>
          </div>
          <div className="card">
            <h3>Great Prices</h3>
            <p>Competitive pricing with regular discounts</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>Our Story</h2>
        <p>
          Astralean Home started with a passion for designing furniture that transforms spaces.
          We combine craftsmanship, quality materials, and timeless design to bring
          exceptional interiors to homes and businesses alike.
        </p>
        <p>
          Our team believes furniture is not just functional — it's an experience. Every
          product is created with care, ensuring it not only looks stunning but lasts
          for generations.
        </p>
      </section>
    </div>
  );
}

export default Home;
