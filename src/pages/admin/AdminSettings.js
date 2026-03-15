import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminSettings() {
  const [settings, setSettings] = useState({
    razorpayEnabled: false,
    codEnabled: true,
    razorpayKey: ''
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/settings');
      if (response.data && response.data.payment) {
        setSettings(response.data.payment);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // json-server updates the entire object at the endpoint
      await axios.put('http://localhost:5001/api/settings', { payment: settings });
      setSuccessMsg('Payment settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  if (loading) return <div className="admin-page"><p>Loading settings...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: '600px' }}>
        <h1>Payment Settings</h1>
        <p>Configure how customers can pay for their orders.</p>

        {successMsg && (
          <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {successMsg}
          </div>
        )}

        <div className="admin-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="checkbox" 
                id="codEnabled" 
                name="codEnabled"
                checked={settings.codEnabled}
                onChange={handleChange}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="codEnabled" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Enable Cash on Delivery (COD)</label>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="checkbox" 
                id="razorpayEnabled" 
                name="razorpayEnabled"
                checked={settings.razorpayEnabled}
                onChange={handleChange}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="razorpayEnabled" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Enable Credit/Debit Cards (Razorpay)</label>
            </div>

            {settings.razorpayEnabled && (
              <div style={{ marginLeft: '2.5rem', marginTop: '-0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Razorpay Key ID</label>
                <input 
                  type="text" 
                  name="razorpayKey" 
                  placeholder="rzp_test_..." 
                  value={settings.razorpayKey} 
                  onChange={handleChange} 
                  className="admin-input" 
                  required={settings.razorpayEnabled}
                />
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
                  Required to mock the live payment gateway window.
                </p>
              </div>
            )}

            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Save Payment Configuration</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
