import React from 'react';

function CategoryImageFields({ image, images, onImageChange, onImagesChange }) {
  const gallery = images || [];

  const handleFileRead = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleMainUpload = (e) => {
    handleFileRead(e.target.files[0], (result) => onImageChange(result));
    e.target.value = '';
  };

  const handleGalleryUpload = (index, e) => {
    handleFileRead(e.target.files[0], (result) => {
      const next = [...gallery];
      next[index] = result;
      onImagesChange(next);
    });
    e.target.value = '';
  };

  const handleGalleryUrlChange = (index, value) => {
    const next = [...gallery];
    next[index] = value;
    onImagesChange(next);
  };

  const addGalleryField = () => onImagesChange([...gallery, '']);

  const removeGalleryField = (index) => {
    onImagesChange(gallery.filter((_, i) => i !== index));
  };

  return (
    <div className="category-image-fields">
      <div className="category-image-block">
        <label className="admin-field-label">Main image</label>
        <div className="category-image-row">
          <input
            type="text"
            className="admin-input"
            placeholder="Main image URL"
            value={image || ''}
            onChange={(e) => onImageChange(e.target.value)}
          />
          <label className="admin-file-btn">
            Upload from device
            <input type="file" accept="image/*" onChange={handleMainUpload} hidden />
          </label>
        </div>
        {image && (
          <img src={image} alt="Main preview" className="category-image-preview" />
        )}
      </div>

      <div className="category-image-block">
        <div className="category-image-header">
          <label className="admin-field-label">Additional images</label>
          <button type="button" className="admin-secondary-btn" onClick={addGalleryField}>
            + Add image
          </button>
        </div>

        {gallery.length === 0 ? (
          <p className="admin-field-hint">Optional gallery images for this category.</p>
        ) : (
          gallery.map((img, index) => (
            <div key={index} className="category-image-row">
              <input
                type="text"
                className="admin-input"
                placeholder={`Gallery image ${index + 1} URL`}
                value={img}
                onChange={(e) => handleGalleryUrlChange(index, e.target.value)}
              />
              <label className="admin-file-btn">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGalleryUpload(index, e)}
                  hidden
                />
              </label>
              <button
                type="button"
                className="admin-remove-btn"
                onClick={() => removeGalleryField(index)}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryImageFields;
