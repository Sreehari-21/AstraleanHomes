import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import CategoryImageFields from '../../components/CategoryImageFields';
import { getPrimaryImage, normalizeCategoryImages } from '../../utils/categoryImages';
import './AdminDashboard.css';

const EMPTY_MAJOR = { id: '', name: '', description: '', image: '', images: [] };
const EMPTY_SUB = { id: '', name: '', majorId: '', link: '', description: '', image: '', images: [] };
const EMPTY_COLLECTION = { id: '', name: '', subId: '', link: '', description: '', image: '', images: [] };

function ManageCategories() {
  const [categories, setCategories] = useState({ major: [], sub: [], collections: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('major');
  const [successMsg, setSuccessMsg] = useState('');

  const [majorForm, setMajorForm] = useState(EMPTY_MAJOR);
  const [subForm, setSubForm] = useState(EMPTY_SUB);
  const [collectionForm, setCollectionForm] = useState(EMPTY_COLLECTION);

  const [editMajorId, setEditMajorId] = useState('');
  const [editSubId, setEditSubId] = useState('');
  const [editCollectionId, setEditCollectionId] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSuccess = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

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

  const saveCategory = async (type, formData, editingId) => {
    const payload = normalizeCategoryImages({
      ...formData,
      ...(editingId ? { id: editingId } : {}),
    });

    if (editingId) {
      await axios.put(`${API_URL}/api/categories/${type}/${editingId}`, payload);
      return 'updated';
    }

    const { id, ...createPayload } = payload;
    await axios.post(`${API_URL}/api/categories/${type}`, createPayload);
    return 'added';
  };

  const handleAddMajor = async (e) => {
    e.preventDefault();
    try {
      const action = await saveCategory('major', majorForm, editMajorId);
      setMajorForm(EMPTY_MAJOR);
      setEditMajorId('');
      await fetchCategories();
      showSuccess(`Major category ${action === 'updated' ? 'updated' : 'added'} successfully.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving major category');
    }
  };

  const handleAddSub = async (e) => {
    e.preventDefault();
    try {
      const action = await saveCategory('sub', subForm, editSubId);
      setSubForm(EMPTY_SUB);
      setEditSubId('');
      await fetchCategories();
      showSuccess(`Subcategory ${action === 'updated' ? 'updated' : 'added'} successfully.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving subcategory');
    }
  };

  const handleAddCollection = async (e) => {
    e.preventDefault();
    try {
      const action = await saveCategory('collections', collectionForm, editCollectionId);
      setCollectionForm(EMPTY_COLLECTION);
      setEditCollectionId('');
      await fetchCategories();
      showSuccess(`Collection ${action === 'updated' ? 'updated' : 'added'} successfully.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving collection');
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await axios.delete(`${API_URL}/api/categories/${type}/${id}`);
      if (type === 'major' && editMajorId === id) {
        setEditMajorId('');
        setMajorForm(EMPTY_MAJOR);
      }
      if (type === 'sub' && editSubId === id) {
        setEditSubId('');
        setSubForm(EMPTY_SUB);
      }
      if (type === 'collections' && editCollectionId === id) {
        setEditCollectionId('');
        setCollectionForm(EMPTY_COLLECTION);
      }
      await fetchCategories();
      showSuccess('Category deleted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const loadMajorForEdit = (id) => {
    setEditMajorId(id);
    if (!id) {
      setMajorForm(EMPTY_MAJOR);
      return;
    }
    const item = categories.major.find((c) => c.id === id);
    if (!item) return;
    setMajorForm({
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      image: item.image || '',
      images: item.images || [],
    });
  };

  const loadSubForEdit = (id) => {
    setEditSubId(id);
    if (!id) {
      setSubForm(EMPTY_SUB);
      return;
    }
    const item = categories.sub.find((c) => c.id === id);
    if (!item) return;
    setSubForm({
      id: item.id,
      name: item.name || '',
      majorId: item.majorId || '',
      link: item.link || '',
      description: item.description || '',
      image: item.image || '',
      images: item.images || [],
    });
  };

  const loadCollectionForEdit = (id) => {
    setEditCollectionId(id);
    if (!id) {
      setCollectionForm(EMPTY_COLLECTION);
      return;
    }
    const item = categories.collections.find((c) => c.id === id);
    if (!item) return;
    setCollectionForm({
      id: item.id,
      name: item.name || '',
      subId: item.subId || '',
      link: item.link || '',
      description: item.description || '',
      image: item.image || '',
      images: item.images || [],
    });
  };

  const tabs = [
    { id: 'major', label: 'Major Categories' },
    { id: 'sub', label: 'Subcategories' },
    { id: 'collections', label: 'Collections' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-container admin-container-wide">
        <div className="admin-page-header">
          <div>
            <h1>Manage Categories</h1>
            <Link to="/admin/dashboard" className="admin-back-link">&lsaquo; Return to Dashboard</Link>
          </div>
        </div>

        <p className="admin-page-subtitle">
          Add or edit categories, upload images from your device, and attach multiple gallery images.
        </p>

        {successMsg && <div className="admin-success-banner">{successMsg}</div>}

        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="admin-loading">Loading categories...</p>
        ) : (
          <>
            {activeTab === 'major' && (
              <div className="manage-section">
                <div className="admin-form-card">
                  <h3>{editMajorId ? 'Edit Major Category' : 'Add Major Category'}</h3>
                  <form onSubmit={handleAddMajor} className="admin-form">
                    <label className="admin-field-label">Select to edit</label>
                    <select
                      className="admin-input"
                      value={editMajorId}
                      onChange={(e) => loadMajorForEdit(e.target.value)}
                    >
                      <option value="">+ Create new major category</option>
                      {categories.major.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Category name (e.g. Living Room)"
                      value={majorForm.name}
                      onChange={(e) => setMajorForm({ ...majorForm, name: e.target.value })}
                      required
                    />
                    <textarea
                      className="admin-input"
                      placeholder="Short description (optional)"
                      rows="2"
                      value={majorForm.description}
                      onChange={(e) => setMajorForm({ ...majorForm, description: e.target.value })}
                    />

                    <CategoryImageFields
                      image={majorForm.image}
                      images={majorForm.images}
                      onImageChange={(image) => setMajorForm({ ...majorForm, image })}
                      onImagesChange={(images) => setMajorForm({ ...majorForm, images })}
                    />

                    <div className="admin-form-actions">
                      <button type="submit" className="btn admin-submit-btn">
                        {editMajorId ? 'Update Major Category' : 'Add Major Category'}
                      </button>
                      {editMajorId && (
                        <button
                          type="button"
                          className="btn admin-cancel-btn"
                          onClick={() => loadMajorForEdit('')}
                        >
                          Cancel edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="admin-table-container">
                  <h3>Current Major Categories</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Name</th>
                        <th>Images</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.major.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="admin-table-empty">No major categories yet.</td>
                        </tr>
                      ) : (
                        categories.major.map((c) => (
                          <tr key={c.id}>
                            <td>
                              {getPrimaryImage(c) ? (
                                <img src={getPrimaryImage(c)} alt={c.name} className="admin-table-thumb" />
                              ) : (
                                '—'
                              )}
                            </td>
                            <td>{c.name}</td>
                            <td>{(c.images?.length || (c.image ? 1 : 0))}</td>
                            <td className="admin-table-actions">
                              <button type="button" className="admin-edit-btn" onClick={() => loadMajorForEdit(c.id)}>
                                Edit
                              </button>
                              <button type="button" className="admin-delete-btn" onClick={() => handleDelete('major', c.id, c.name)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'sub' && (
              <div className="manage-section">
                <div className="admin-form-card">
                  <h3>{editSubId ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
                  <form onSubmit={handleAddSub} className="admin-form admin-form-grid">
                    <select
                      className="admin-input admin-form-full"
                      value={editSubId}
                      onChange={(e) => loadSubForEdit(e.target.value)}
                    >
                      <option value="">+ Create new subcategory</option>
                      {categories.sub.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Subcategory name (e.g. Sofas)"
                      value={subForm.name}
                      onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                      required
                    />
                    <select
                      className="admin-input"
                      value={subForm.majorId}
                      onChange={(e) => setSubForm({ ...subForm, majorId: e.target.value })}
                      required
                    >
                      <option value="">Select major category</option>
                      {categories.major.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Link (e.g. /sofas)"
                      value={subForm.link}
                      onChange={(e) => setSubForm({ ...subForm, link: e.target.value })}
                    />
                    <textarea
                      className="admin-input"
                      placeholder="Short description (optional)"
                      rows="2"
                      value={subForm.description}
                      onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                    />

                    <div className="admin-form-full">
                      <CategoryImageFields
                        image={subForm.image}
                        images={subForm.images}
                        onImageChange={(image) => setSubForm({ ...subForm, image })}
                        onImagesChange={(images) => setSubForm({ ...subForm, images })}
                      />
                    </div>

                    <div className="admin-form-actions admin-form-full">
                      <button type="submit" className="btn admin-submit-btn">
                        {editSubId ? 'Update Subcategory' : 'Add Subcategory'}
                      </button>
                      {editSubId && (
                        <button type="button" className="btn admin-cancel-btn" onClick={() => loadSubForEdit('')}>
                          Cancel edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="admin-table-container">
                  <h3>Current Subcategories</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Name</th>
                        <th>Major</th>
                        <th>Link</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.sub.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="admin-table-empty">No subcategories yet.</td>
                        </tr>
                      ) : (
                        categories.sub.map((s) => (
                          <tr key={s.id}>
                            <td>
                              {getPrimaryImage(s) ? (
                                <img src={getPrimaryImage(s)} alt={s.name} className="admin-table-thumb" />
                              ) : (
                                '—'
                              )}
                            </td>
                            <td>{s.name}</td>
                            <td>{categories.major.find((m) => m.id === s.majorId)?.name || s.majorId}</td>
                            <td>{s.link}</td>
                            <td className="admin-table-actions">
                              <button type="button" className="admin-edit-btn" onClick={() => loadSubForEdit(s.id)}>
                                Edit
                              </button>
                              <button type="button" className="admin-delete-btn" onClick={() => handleDelete('sub', s.id, s.name)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'collections' && (
              <div className="manage-section">
                <div className="admin-form-card">
                  <h3>{editCollectionId ? 'Edit Collection' : 'Add Collection'}</h3>
                  <form onSubmit={handleAddCollection} className="admin-form admin-form-grid">
                    <select
                      className="admin-input admin-form-full"
                      value={editCollectionId}
                      onChange={(e) => loadCollectionForEdit(e.target.value)}
                    >
                      <option value="">+ Create new collection</option>
                      {categories.collections.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Collection name (e.g. King Beds)"
                      value={collectionForm.name}
                      onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                      required
                    />
                    <select
                      className="admin-input"
                      value={collectionForm.subId}
                      onChange={(e) => setCollectionForm({ ...collectionForm, subId: e.target.value })}
                      required
                    >
                      <option value="">Select subcategory</option>
                      {categories.sub.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Link (e.g. /king-beds)"
                      value={collectionForm.link}
                      onChange={(e) => setCollectionForm({ ...collectionForm, link: e.target.value })}
                    />
                    <textarea
                      className="admin-input"
                      placeholder="Short description (optional)"
                      rows="2"
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                    />

                    <div className="admin-form-full">
                      <CategoryImageFields
                        image={collectionForm.image}
                        images={collectionForm.images}
                        onImageChange={(image) => setCollectionForm({ ...collectionForm, image })}
                        onImagesChange={(images) => setCollectionForm({ ...collectionForm, images })}
                      />
                    </div>

                    <div className="admin-form-actions admin-form-full">
                      <button type="submit" className="btn admin-submit-btn">
                        {editCollectionId ? 'Update Collection' : 'Add Collection'}
                      </button>
                      {editCollectionId && (
                        <button type="button" className="btn admin-cancel-btn" onClick={() => loadCollectionForEdit('')}>
                          Cancel edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="admin-table-container">
                  <h3>Current Collections</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Name</th>
                        <th>Subcategory</th>
                        <th>Link</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.collections.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="admin-table-empty">No collections yet.</td>
                        </tr>
                      ) : (
                        categories.collections.map((c) => (
                          <tr key={c.id}>
                            <td>
                              {getPrimaryImage(c) ? (
                                <img src={getPrimaryImage(c)} alt={c.name} className="admin-table-thumb" />
                              ) : (
                                '—'
                              )}
                            </td>
                            <td>{c.name}</td>
                            <td>{categories.sub.find((s) => s.id === c.subId)?.name || c.subId}</td>
                            <td>{c.link}</td>
                            <td className="admin-table-actions">
                              <button type="button" className="admin-edit-btn" onClick={() => loadCollectionForEdit(c.id)}>
                                Edit
                              </button>
                              <button type="button" className="admin-delete-btn" onClick={() => handleDelete('collections', c.id, c.name)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManageCategories;
