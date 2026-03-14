import React from 'react';
import './AdminDashboard.css';

function ManageOrders() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Manage Orders</h1>
        <p>This is where you will view customer orders.</p>
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'white', borderRadius: '12px' }}>
          <p>No new orders.</p>
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
