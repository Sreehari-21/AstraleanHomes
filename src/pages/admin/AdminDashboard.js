import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Admin Dashboard</h1>
          <Link to="/" className="btn" style={{ background: '#f0f0f0', color: '#333' }}>View Store</Link>
        </div>
        <p>Welcome to the store management portal. From here you can manage products, view orders, and update store settings.</p>
        
        <div className="admin-grid">
          <Link to="/admin/products" className="admin-card">
            <div className="card-icon">🏷️</div>
            <h3>Manage Products</h3>
            <p>Add, edit, and delete products from your catalog</p>
          </Link>
          
          <Link to="/admin/orders" className="admin-card">
            <div className="card-icon">📦</div>
            <h3>Manage Orders</h3>
            <p>Track customer orders and manage fulfillment</p>
          </Link>
          
          <Link to="/admin/settings" className="admin-card">
            <div className="card-icon">⚙️</div>
            <h3>Store Settings</h3>
            <p>Configure payment methods and store details</p>
          </Link>

          <Link to="/admin/categories" className="admin-card">
            <div className="card-icon">🌳</div>
            <h3>Manage Categories</h3>
            <p>Organize Major, Sub, and Collections</p>
          </Link>

          <Link to="/admin/enquiries" className="admin-card">
            <div className="card-icon">📧</div>
            <h3>Manage Enquiries</h3>
            <p>View newsletter subscriptions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
