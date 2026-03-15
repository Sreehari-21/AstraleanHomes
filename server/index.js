const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Settings: Mongoose Schema
const settingsSchema = new mongoose.Schema({
  id: { type: String, default: 'global' },
  payment: {
    razorpayEnabled: { type: Boolean, default: false },
    codEnabled: { type: Boolean, default: true },
    razorpayKey: { type: String, default: '' }
  },
  store: {
    deliveryDuration: { type: String, default: '3-5 Business Days' },
    termsAndConditions: { type: String, default: 'Standard terms apply.' },
    gstNumber: { type: String, default: '' }
  }
}, { minimize: false });
const Settings = mongoose.model('Settings', settingsSchema);

// Settings: Get
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ id: 'global' });
    if (!settings) {
      settings = await Settings.create({ id: 'global' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Settings: Update
app.put('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({ id: 'global' }, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Products: Get all
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Products: Get single
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Products: Delete (Admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await Product.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Products: Add/Update (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findOne({ id });
    if (product) {
      Object.assign(product, req.body);
    } else {
      product = new Product(req.body);
    }
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Orders: Create
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
