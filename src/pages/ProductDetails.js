import { API_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [storeSettings, setStoreSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Product
        const prodRes = await axios.get(`${API_URL}/api/products/${id}`);
        if (prodRes.data) {
          setProduct(prodRes.data);
          setActiveImage(prodRes.data.image);
        } else {
          setError('Product not found');
        }

        // Fetch Store Settings for Delivery Info
        const settingsRes = await axios.get(`${API_URL}/api/settings`);
        if (settingsRes.data) {
          setStoreSettings(settingsRes.data);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="pdp-container pdp-loading">Loading extraordinary details...</div>;
  }

  if (error || !product) {
    return (
      <div className="pdp-container pdp-not-found">
        <h2>{error || 'Product not found'}</h2>
        <p>We couldn't find the piece you're looking for.</p>
        <Link to="/products" className="pdp-back-link">Return to Collection</Link>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="pdp-container">
      <div className="pdp-wrapper" style={{ marginTop: '2rem' }}>
        <div className="pdp-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '4rem' }}>
          
          {/* Left: Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-image-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', background: '#f9f9f9', marginBottom: '1.5rem', aspectRatio: '4/3' }}>
              <img 
                src={activeImage} 
                alt={product.name} 
                className="pdp-main-image" 
                onClick={() => openLightbox(allImages.indexOf(activeImage))}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
              />
            </div>
            {allImages.length > 1 && (
              <div className="pdp-thumbnails" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {allImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      border: activeImage === img ? '2px solid #333' : '2px solid transparent',
                      transition: '0.2s'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Info */}
          <div className="pdp-info-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div className="pdp-category" style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                {product.category} Collection
              </div>
              <h1 className="pdp-title" style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{product.name}</h1>
              <div className="pdp-price" style={{ fontSize: '1.8rem', fontWeight: '400', marginTop: '0.5rem', color: '#333' }}>{product.price}</div>
            </div>
            
            <div className="pdp-description-wrapper">
              <h3 className="pdp-description-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>The Story</h3>
              <p className="pdp-description" style={{ lineHeight: '1.8', color: '#555' }}>
                {product.description}
              </p>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className="pdp-specs-section">
                <h3 className="pdp-description-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {product.specs.map((spec, idx) => (
                    <div key={idx} style={{ padding: '0.8rem', background: '#fcfcfc', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#999', display: 'block', textTransform: 'uppercase' }}>{spec.label}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pdp-actions" style={{ marginTop: '1rem' }}>
              <button 
                className="pdp-add-btn" 
                onClick={() => addToCart(product)}
                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
              >
                <span>Add to Cart</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
              
              <div className="pdp-shipping-info" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="pdp-shipping-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>Dispatching in <b>{storeSettings?.store?.deliveryDuration || '3-5 Business Days'}</b></span>
                </div>
                <div className="pdp-shipping-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  <span>White Glove Professional Assembly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      {showLightbox && (
        <div className="pdp-lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <button className="pdp-lightbox-close" onClick={() => setShowLightbox(false)}>&times;</button>
          
          <button className="pdp-lightbox-arrow prev" onClick={prevImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="pdp-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={allImages[lightboxIndex]} alt="" className="pdp-lightbox-image" />
            <div className="pdp-lightbox-counter">{lightboxIndex + 1} / {allImages.length}</div>
          </div>
          
          <button className="pdp-lightbox-arrow next" onClick={nextImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
