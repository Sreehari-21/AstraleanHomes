import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function ManageOrders() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Manage Orders</h1>
          <Link to="/admin/dashboard" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>&lsaquo; Return to Dashboard</Link>
        </div>
        <p>This is where you will view customer orders.</p>
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'white', borderRadius: '12px' }}>
          <p>No new orders.</p>
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
