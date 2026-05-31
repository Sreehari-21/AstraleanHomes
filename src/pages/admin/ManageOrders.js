import { API_URL } from "../../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.put(`${API_URL}/api/orders/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setSuccessMsg('Order status updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.delete(`${API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o.id !== id));
      setSuccessMsg('Order deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Manage Orders</h1>
            <Link to="/admin/dashboard" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>&lsaquo; Return to Dashboard</Link>
          </div>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {successMsg}
          </div>
        )}

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="admin-table-container" style={{ 
            marginTop: '2rem', 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '1.2rem' }}>Order Info</th>
                  <th style={{ padding: '1.2rem' }}>Customer Details</th>
                  <th style={{ padding: '1.2rem' }}>Items Ordered</th>
                  <th style={{ padding: '1.2rem' }}>Total Cost</th>
                  <th style={{ padding: '1.2rem' }}>Status</th>
                  <th style={{ padding: '1.2rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No orders placed yet.</td>
                  </tr>
                ) : (
                  [...orders].reverse().map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0', verticalAlign: 'top' }}>
                      {/* Order Info */}
                      <td style={{ padding: '1.2rem' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{order.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.4rem' }}>
                          {new Date(order.date || order.createdAt).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#555', marginTop: '0.4rem' }}>
                          Method: <b>{order.paymentMethod}</b>
                        </div>
                      </td>
                      
                      {/* Customer Details */}
                      <td style={{ padding: '1.2rem', fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName || 'N/A'}</div>
                        <div style={{ color: '#555', marginTop: '0.2rem' }}>📞 {order.shippingAddress?.phone || 'N/A'}</div>
                        <div style={{ color: '#555', marginTop: '0.2rem' }}>✉️ {order.userEmail || 'Guest'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.4rem', maxWidth: '250px' }}>
                          📍 {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                        </div>
                      </td>

                      {/* Items */}
                      <td style={{ padding: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} 
                              />
                              <div>
                                <div style={{ fontWeight: '500' }}>{item.name}</div>
                                <div style={{ color: '#666' }}>{item.price} x {item.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', fontSize: '1.05rem' }}>
                        ₹{order.total}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1.2rem' }}>
                        <select 
                          value={order.status?.toLowerCase() || 'pending'} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            backgroundColor: 
                              order.status?.toLowerCase() === 'delivered' ? '#e6f4ea' :
                              order.status?.toLowerCase() === 'shipped' ? '#e8f0fe' :
                              order.status?.toLowerCase() === 'cancelled' ? '#fce8e6' : '#fff',
                            color: 
                              order.status?.toLowerCase() === 'delivered' ? '#137333' :
                              order.status?.toLowerCase() === 'shipped' ? '#1a73e8' :
                              order.status?.toLowerCase() === 'cancelled' ? '#c5221f' : '#3c4043',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1.2rem' }}>
                        <button 
                          onClick={() => handleDelete(order.id)}
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

export default ManageOrders;
