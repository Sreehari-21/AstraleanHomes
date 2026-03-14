import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the store management portal.</p>
        
        <div className="admin-grid">
          <Link to="/admin/products" className="admin-card">
            <h3>Manage Products</h3>
            <p>Add, edit, or remove inventory from the store.</p>
          </Link>
          <Link to="/admin/orders" className="admin-card">
            <h3>Manage Orders</h3>
            <p>View customer orders and update shipping statuses.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
