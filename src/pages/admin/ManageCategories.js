import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import './AdminDashboard.css'; // Reuse dashboard styles

function ManageCategories() {
  const [categories, setCategories] = useState({ major: [], sub: [], collections: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('major');

  // Form states
  const [newMajor, setNewMajor] = useState({ name: '' });
  const [newSub, setNewSub] = useState({ name: '', majorId: '', image: '', link: '' });
  const [newCollection, setNewCollection] = useState({ name: '', subId: '', image: '', link: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMajor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/categories/major`, newMajor);
      setNewMajor({ name: '' });
      fetchCategories();
    } catch (error) {
      alert('Error adding major category');
    }
  };

  const handleAddSub = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/categories/sub`, newSub);
      setNewSub({ name: '', majorId: '', image: '', link: '' });
      fetchCategories();
    } catch (error) {
      alert('Error adding sub category');
    }
  };

  const handleAddCollection = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/categories/collections`, newCollection);
      setNewCollection({ name: '', subId: '', image: '', link: '' });
      fetchCategories();
    } catch (error) {
      alert('Error adding collection');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <h1>Manage Category Hierarchy</h1>
      
      <div className="admin-tabs" style={{ marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('major')} className={activeTab === 'major' ? 'active' : ''}>Major Categories</button>
        <button onClick={() => setActiveTab('sub')} className={activeTab === 'sub' ? 'active' : ''}>Subcategories</button>
        <button onClick={() => setActiveTab('collections')} className={activeTab === 'collections' ? 'active' : ''}>Collections</button>
      </div>

      {activeTab === 'major' && (
        <div className="manage-section">
          <h3>Add Major Category</h3>
          <form onSubmit={handleAddMajor}>
            <input 
              type="text" 
              placeholder="Category Name (e.g. Living Room)" 
              value={newMajor.name} 
              onChange={(e) => setNewMajor({ ...newMajor, name: e.target.value })}
              required 
            />
            <button type="submit" className="add-btn">Add Major Category</button>
          </form>

          <h3>Current Major Categories</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.major.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sub' && (
        <div className="manage-section">
          <h3>Add Subcategory</h3>
          <form onSubmit={handleAddSub}>
            <input 
              type="text" 
              placeholder="Subcategory Name (e.g. Sofas)" 
              value={newSub.name} 
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              required 
            />
            <select 
              value={newSub.majorId} 
              onChange={(e) => setNewSub({ ...newSub, majorId: e.target.value })}
              required
            >
              <option value="">Select Major Category</option>
              {categories.major.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Image URL" 
              value={newSub.image} 
              onChange={(e) => setNewSub({ ...newSub, image: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="Link (e.g. /sofas)" 
              value={newSub.link} 
              onChange={(e) => setNewSub({ ...newSub, link: e.target.value })}
            />
            <button type="submit" className="add-btn">Add Subcategory</button>
          </form>

          <h3>Current Subcategories</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Major Category</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {categories.sub.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{categories.major.find(m => m.id === s.majorId)?.name || s.majorId}</td>
                  <td>{s.link}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'collections' && (
        <div className="manage-section">
          <h3>Add Collection</h3>
          <form onSubmit={handleAddCollection}>
            <input 
              type="text" 
              placeholder="Collection Name (e.g. King Beds)" 
              value={newCollection.name} 
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              required 
            />
            <select 
              value={newCollection.subId} 
              onChange={(e) => setNewCollection({ ...newCollection, subId: e.target.value })}
              required
            >
              <option value="">Select Subcategory</option>
              {categories.sub.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Image URL" 
              value={newCollection.image} 
              onChange={(e) => setNewCollection({ ...newCollection, image: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="Link (e.g. /king-beds)" 
              value={newCollection.link} 
              onChange={(e) => setNewCollection({ ...newCollection, link: e.target.value })}
            />
            <button type="submit" className="add-btn">Add Collection</button>
          </form>

          <h3>Current Collections</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subcategory</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {categories.collections.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{categories.sub.find(s => s.id === c.subId)?.name || c.subId}</td>
                  <td>{c.link}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
