import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './ProductPage.css';

function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_URL}/api/enquiries`, formData);
      setStatus({ type: 'success', message: 'Thank you for contacting us! We will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero-section contact-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Get in Touch</h1>
          <p>Questions, inquiries, or custom orders — we're here for you.</p>
        </div>
      </section>

      <section className="contact-section">
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {status.message && (
            <div className={`form-status ${status.type}`} style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: status.type === 'success' ? '#f6ffed' : '#fff1f0',
              border: `1px solid ${status.type === 'success' ? '#b7eb8f' : '#ffa39e'}`,
              color: status.type === 'success' ? '#52c41a' : '#f5222d'
            }}>
              {status.message}
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default Contact;
