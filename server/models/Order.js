const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    id: String,
    name: String,
    price: String,
    quantity: Number,
    image: String
  }],
  total: Number,
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String
  },
  status: { type: String, default: 'Pending' },
  userEmail: String,
  paymentMethod: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
