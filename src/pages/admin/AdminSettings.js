import { API_URL } from "../../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminSettings() {
  const [settings, setSettings] = useState({
    razorpayEnabled: false,
    codEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings`);
        if (response.data && response.data.payment) {
          setSettings(response.data.payment);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, checked, type, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.put(`${API_URL}/api/settings`, { payment: settings }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  if (loading) return <div className="admin-container">Loading settings...</div>;

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Store Settings</h1>
          <Link to="/admin/dashboard" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>&lsaquo; Return to Dashboard</Link>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {successMsg}
          </div>
        )}

        <div className="settings-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="razorpayEnabled"
                  checked={settings.razorpayEnabled}
                  onChange={handleChange}
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                Enable Razorpay (Online Payments)
              </label>
            </div>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="codEnabled"
                  checked={settings.codEnabled}
                  onChange={handleChange}
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                Enable Cash on Delivery (COD)
              </label>
            </div>

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
