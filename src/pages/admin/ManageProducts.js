import { API_URL } from "../../config";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    image: '',
    images: [],
    description: '',
    category: 'sofas',
    specs: []
  });

  // Modal State for Deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [categoryData, setCategoryData] = useState({ major: [], sub: [], collections: [] });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
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

  const handleImageUpload = (e, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index === null) {
          setFormData({ ...formData, image: reader.result });
        } else {
          const newImages = [...formData.images];
          newImages[index] = reader.result;
          setFormData({ ...formData, images: newImages });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image helpers
  const addImageField = () => setFormData({ ...formData, images: [...formData.images, ''] });
  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };
  const handleUrlImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  // Spec helpers
  const addSpecField = () => setFormData({ ...formData, specs: [...formData.specs, { label: '', value: '' }] });
  const removeSpecField = (index) => {
    const newSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData({ ...formData, specs: newSpecs });
  };
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      image: '',
      images: [],
      description: '',
      category: 'sofas',
      specs: []
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setFormData({ 
      ...product, 
      images: product.images || [], 
      specs: product.specs || [] 
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const idToDelete = productToDelete.id || productToDelete._id;
      
      await axios.delete(`${API_URL}/api/products/${idToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete', error);
      const msg = error.response?.data?.message || error.message;
      alert(`Failed to delete product: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt_token');
      const dataToSave = { ...formData };
      if (!isEditing) {
        dataToSave.id = `prod-${Date.now()}`;
      }
      await axios.post(`${API_URL}/api/products`, dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. Check console.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Manage Products</h1>
            <Link to="/admin/dashboard" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>&lsaquo; Return to Dashboard</Link>
          </div>
          <button className="btn" onClick={handleAddNew}>+ Add New Product</button>
        </div>

        {showForm && (
          <div className="admin-form-container" style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              
              <section className="form-section">
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>General Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="admin-input" />
                  <input type="text" name="price" placeholder="Price (e.g. ₹99,999)" value={formData.price} onChange={handleChange} required className="admin-input" />
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <select name="category" value={formData.category} onChange={handleChange} className="admin-input" required style={{ width: '100%' }}>
                    <option value="" disabled>Select a Category/Collection</option>
                    {categoryData.major.map(m => (
                      <optgroup key={m.id} label={m.name}>
                        {categoryData.sub.filter(s => s.majorId === m.id).map(s => (
                          <React.Fragment key={s.id}>
                            <option value={s.id}>{s.name}</option>
                            {categoryData.collections.filter(c => c.subId === s.id).map(c => (
                              <option key={c.id} value={c.id}>&nbsp;&nbsp;— {c.name}</option>
                            ))}
                          </React.Fragment>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <textarea name="description" placeholder="Short Meta Description" value={formData.description} onChange={handleChange} required className="admin-input" rows="2" style={{ marginTop: '1rem', width: '100%' }}></textarea>
              </section>

              <section className="form-section">
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Visual Content</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Main Thumbnail</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="text" name="image" placeholder="Main Image URL" value={formData.image} onChange={handleChange} required className="admin-input" style={{ flex: 1 }} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="admin-input" style={{ flex: 1, padding: '0.6rem' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Gallery Images</label>
                    <button type="button" className="btn btn-small" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addImageField}>+ Add Gallery Image</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {formData.images.map((img, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="text" placeholder={`Gallery Image ${idx + 1} URL`} value={img} onChange={(e) => handleUrlImageChange(idx, e.target.value)} className="admin-input" style={{ flex: 4 }} />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} className="admin-input" style={{ flex: 3, padding: '0.6rem' }} />
                        <button type="button" onClick={() => removeImageField(idx)} style={{ padding: '0.6rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>Specifications</h3>
                  <button type="button" className="btn btn-small" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addSpecField}>+ Add Specification</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {formData.specs.map((spec, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input type="text" placeholder="Label (e.g. Dimensions)" value={spec.label} onChange={(e) => handleSpecChange(idx, 'label', e.target.value)} className="admin-input" style={{ flex: 1 }} />
                      <input type="text" placeholder="Value (e.g. 200x100cm)" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} className="admin-input" style={{ flex: 1 }} />
                      <button type="button" onClick={() => removeSpecField(idx)} style={{ padding: '0.6rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                  {formData.specs.length === 0 && <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>No specifications added yet.</p>}
                </div>
              </section>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Save Product</button>
                <button type="button" className="btn" style={{ background: '#ccc', color: '#333', flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
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
                      <button onClick={() => handleDeleteClick(product)} style={{ padding: '0.5rem 1rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Premium Deletion Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '2.5rem', borderRadius: '20px',
              maxWidth: '450px', width: '90%', textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#ff4d4d' }}>⚠️</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>Confirm Deletion</h2>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
                Are you sure you want to permanently delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="btn"
                  style={{ flex: 2, background: isDeleting ? '#ff8080' : '#ff4d4d', color: 'white', border: 'none' }}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="btn"
                  style={{ flex: 1, background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;
