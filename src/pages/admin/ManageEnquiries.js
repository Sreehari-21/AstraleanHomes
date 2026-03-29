import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import './AdminDashboard.css'; // Reusing dashboard styles for consistency

function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/enquiries`);
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await axios.delete(`${API_URL}/api/enquiries/${id}`);
      setEnquiries(enquiries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Manage Enquiries</h1>
        <p>View and manage newsletter subscriptions.</p>

        {loading ? (
          <p>Loading enquiries...</p>
        ) : (
          <div className="admin-table-container" style={{ 
            marginTop: '2rem', 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '1.2rem' }}>Date</th>
                  <th style={{ padding: '1.2rem' }}>Name</th>
                  <th style={{ padding: '1.2rem' }}>Email</th>
                  <th style={{ padding: '1.2rem' }}>Message</th>
                  <th style={{ padding: '1.2rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No enquiries found.</td>
                  </tr>
                ) : (
                  [...enquiries].reverse().map((enquiry) => (
                    <tr key={enquiry.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '1.2rem', whiteSpace: 'nowrap' }}>
                        {new Date(enquiry.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1.2rem', fontWeight: '500' }}>{enquiry.name}</td>
                      <td style={{ padding: '1.2rem' }}>{enquiry.email}</td>
                      <td style={{ padding: '1.2rem', maxWidth: '300px' }}>{enquiry.message}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <button 
                          onClick={() => handleDelete(enquiry.id)}
                          style={{ 
                            background: '#ff4d4f', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageEnquiries;
