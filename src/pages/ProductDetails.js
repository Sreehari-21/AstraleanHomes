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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Using json-server query format ?id=value
        const response = await axios.get(`http://localhost:5000/products?id=${id}`);
        // json-server returns an array for queries, even if there's only one match
        if (response.data && response.data.length > 0) {
          setProduct(response.data[0]);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); // Scroll to top when page loads
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

  return (
    <div className="pdp-container">
      <div className="pdp-wrapper">
        <div className="pdp-image-section">
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            alt={product.name} 
            className="pdp-main-image" 
          />
        </div>
        
        <div className="pdp-info-section">
          <div className="pdp-category">{product.category || 'Collection'}</div>
          <h1 className="pdp-title">{product.name}</h1>
          <div className="pdp-price">{product.price}</div>
          
          <div className="pdp-description-wrapper">
            <h3 className="pdp-description-title">The Details</h3>
            <p className="pdp-description">
              {product.description || 'This premium handcrafted piece is designed for modern living. Elevate your space with its sleek design and unparalleled comfort. Every detail is meticulously curated to bring you the best in contemporary home furnishings.'}
            </p>
          </div>
          
          <div className="pdp-actions">
            <button 
              className="pdp-add-btn" 
              onClick={() => addToCart(product)}
            >
              <span>Add to Cart</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </button>
            
            <div className="pdp-shipping-info">
              <div className="pdp-shipping-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Dispatches in 3-5 days</span>
              </div>
              <div className="pdp-shipping-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <span>White Glove Delivery</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
