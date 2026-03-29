const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true }, // Main cover image
  images: { type: [String], default: [] },  // Additional gallery images
  description: { type: String, required: true },
  category: { type: String, required: true },
  specs: [{
    label: { type: String },
    value: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
