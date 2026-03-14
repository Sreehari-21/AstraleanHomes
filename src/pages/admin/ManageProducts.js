import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '', // for existing products
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'sofas'
  });

  const categories = {
    'Living Room': ['sofas', 'tables', 'chairs'],
    'Bedroom': ['beds', 'kingbeds', 'queenbeds'],
    'Dining Room': ['dining'],
    'Home Decor': ['furnishings', 'storage', 'decor']
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Store as Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      image: '',
      description: '',
      category: 'sofas'
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${String(id)}`);
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Failed to delete', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing (ensure ID is string)
        await axios.put(`http://localhost:5000/products/${String(formData.id)}`, formData);
      } else {
        // Create new
        const newProduct = { ...formData, id: `prod-${Date.now()}` };
        await axios.post('http://localhost:5000/products', newProduct);
      }
      setShowForm(false);
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. Check console.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Manage Products</h1>
          <button className="btn" onClick={handleAddNew}>+ Add New Product</button>
        </div>

        {showForm && (
          <div className="admin-form-container" style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="admin-input" />
              <input type="text" name="price" placeholder="Price (e.g. ₹999)" value={formData.price} onChange={handleChange} required className="admin-input" />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="text" name="image" placeholder="Image URL or upload file" value={formData.image} onChange={handleChange} required className="admin-input" style={{ flex: 1 }} />
                <span style={{ fontWeight: 'bold', color: '#666' }}>OR</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="admin-input" style={{ flex: 1, padding: '0.8rem' }} />
              </div>
              {formData.image && formData.image.startsWith('data:image') && (
                <div style={{ fontSize: '0.85rem', color: '#4CAF50', marginTop: '-0.5rem' }}>✓ Local image loaded successfully.</div>
              )}
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="admin-input" rows="3"></textarea>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input" required>
                <option value="" disabled>Select a Category</option>
                {Object.entries(categories).map(([groupName, items]) => (
                  <optgroup key={groupName} label={groupName}>
                    {items.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'kingbeds' ? 'King Beds' : cat === 'queenbeds' ? 'Queen Beds' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn">Save Product</button>
                <button type="button" className="btn" style={{ background: '#ccc', color: '#333' }} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="admin-products-table" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Image</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{product.name}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{product.category}</td>
                    <td style={{ padding: '1rem' }}>{product.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => handleEdit(product)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(product.id)} style={{ padding: '0.5rem 1rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;
