const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
}));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from React app
const staticPath = path.join(__dirname, 'build');
console.log('🔧 Static assets will be served from:', staticPath);
if (!fs.existsSync(staticPath)) {
  console.warn('⚠️ Build directory does not exist at startup');
}
app.use(express.static(staticPath));

// --- MONGODB CONNECTION & MODELS ---
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ MONGO_URI environment variable is missing!');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('🔌 Connected to MongoDB Atlas successfully.');
    seedDatabaseIfNeeded();
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });

// Schemas & Models
const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String },
  images: [String],
  description: { type: String },
  category: { type: String, required: true },
  specs: [{ label: String, value: String }]
});
const Product = mongoose.model('Product', ProductSchema);

const CategorySchema = new mongoose.Schema({
  major: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    image: String,
    images: [String]
  }],
  sub: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    majorId: { type: String, required: true },
    image: String,
    link: String,
    description: String,
    images: [String]
  }],
  collections: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    subId: { type: String, required: true },
    image: String,
    link: String,
    description: String,
    images: [String]
  }]
});
const CategoryStore = mongoose.model('CategoryStore', CategorySchema);

const SettingsSchema = new mongoose.Schema({
  payment: {
    razorpayEnabled: { type: Boolean, default: false },
    codEnabled: { type: Boolean, default: true }
  },
  store: {
    name: { type: String, default: "AstraleanHomes" },
    deliveryDuration: { type: String, default: "3-5 Business Days" },
    contactEmail: { type: String, default: "support@astraleanhomes.com" },
    termsAndConditions: { type: String, default: "Standard terms apply." },
    gstNumber: { type: String, default: "" }
  }
});
const Settings = mongoose.model('Settings', SettingsSchema);

const OrderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  customerName: String,
  email: String,
  phone: String,
  address: String,
  items: Array,
  total: String,
  paymentMethod: String,
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const EnquirySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, required: true },
  message: String,
  date: { type: Date, default: Date.now }
});
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

// Seeding function to migrate db.json to Atlas if DB is empty
async function seedDatabaseIfNeeded() {
  try {
    const dbFilePath = path.join(__dirname, 'data', 'db.json');
    if (!fs.existsSync(dbFilePath)) return;

    const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    
    // Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0 && data.users && data.users.length > 0) {
      console.log('🌱 Seeding users from db.json...');
      const usersToInsert = data.users.map(u => ({
        id: String(u.id),
        email: u.email,
        phone: u.phone,
        password: u.password,
        role: u.role || 'user'
      }));
      await User.insertMany(usersToInsert);
    }

    // Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0 && data.products && data.products.length > 0) {
      console.log('🌱 Seeding products from db.json...');
      await Product.insertMany(data.products);
    }

    // Seed Categories
    const categoryStoreCount = await CategoryStore.countDocuments();
    if (categoryStoreCount === 0 && data.categories) {
      console.log('🌱 Seeding categories from db.json...');
      await CategoryStore.create(data.categories);
    }

    // Seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 Seeding default settings...');
      await Settings.create(data.settings || {
        payment: { razorpayEnabled: false, codEnabled: true },
        store: {
          name: "AstraleanHomes",
          deliveryDuration: "3-5 Business Days",
          contactEmail: "support@astraleanhomes.com",
          termsAndConditions: "Standard terms apply.",
          gstNumber: ""
        }
      });
    }

    // Seed Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && data.orders && data.orders.length > 0) {
      console.log('🌱 Seeding orders from db.json...');
      await Order.insertMany(data.orders);
    }

    // Seed Enquiries
    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0 && data.enquiries && data.enquiries.length > 0) {
      console.log('🌱 Seeding enquiries from db.json...');
      await Enquiry.insertMany(data.enquiries);
    }

    console.log('✅ Seeding checks completed.');
  } catch (err) {
    console.error('⚠️ Error checking or seeding database:', err);
  }
}

// Helper for Categories fetch
async function getCategoriesStore() {
  let store = await CategoryStore.findOne();
  if (!store) {
    store = await CategoryStore.create({ major: [], sub: [], collections: [] });
  }
  return store;
}

// --- API ROUTES ---

// Get All Products (Filtered by category if provided)
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    let query = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products', error: err.message });
  }
});

// Get Categories Hierarchy
app.get('/api/categories', async (req, res) => {
  try {
    const store = await getCategoriesStore();
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: 'Categories not found', error: err.message });
  }
});

// Add/Update Categories (Helper for Admin)
app.post('/api/categories/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const allowedTypes = ['major', 'sub', 'collections'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const newData = { ...req.body };
    const store = await getCategoriesStore();

    if (!store[type]) store[type] = [];

    const gallery = Array.isArray(newData.images) ? newData.images.filter(Boolean) : [];
    newData.image = newData.image || gallery[0] || '';
    newData.images = newData.image
      ? [newData.image, ...gallery.filter((img) => img !== newData.image)]
      : gallery;

    const existingIndex = newData.id
      ? store[type].findIndex((item) => item.id === newData.id)
      : -1;

    if (existingIndex !== -1) {
      store[type][existingIndex] = {
        ...store[type][existingIndex].toObject(),
        ...newData,
      };
      await store.save();
      return res.json(store[type][existingIndex]);
    }

    if (!newData.id) newData.id = `${type}-${Date.now()}`;

    store[type].push(newData);
    await store.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ message: 'Error saving category', error: err.message });
  }
});

// Update Category (Admin)
app.put('/api/categories/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const allowedTypes = ['major', 'sub', 'collections'];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const store = await getCategoriesStore();
    const index = store[type].findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedData = { ...req.body, id };
    const gallery = Array.isArray(updatedData.images) ? updatedData.images.filter(Boolean) : [];
    updatedData.image = updatedData.image || gallery[0] || '';
    updatedData.images = updatedData.image
      ? [updatedData.image, ...gallery.filter((img) => img !== updatedData.image)]
      : gallery;

    store[type][index] = {
      ...store[type][index].toObject(),
      ...updatedData,
    };

    await store.save();
    res.json(store[type][index]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
});

// Delete Category (Admin)
app.delete('/api/categories/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const allowedTypes = ['major', 'sub', 'collections'];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const store = await getCategoriesStore();
    const list = store[type];
    const exists = list.some((item) => item.id === id);
    if (!exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (type === 'major') {
      const childSubs = (store.sub || []).filter((sub) => sub.majorId === id);
      if (childSubs.length > 0) {
        return res.status(400).json({
          message: `Cannot delete: ${childSubs.length} subcategory(ies) still use this major category. Delete them first.`,
        });
      }
    }

    if (type === 'sub') {
      const childCollections = (store.collections || []).filter((col) => col.subId === id);
      if (childCollections.length > 0) {
        return res.status(400).json({
          message: `Cannot delete: ${childCollections.length} collection(s) still use this subcategory. Delete them first.`,
        });
      }
    }

    store[type] = list.filter((item) => item.id !== id);
    await store.save();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product', error: err.message });
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id;
    console.log(`[DELETE] Request for product ID: "${idToDelete}"`);
    
    const result = await Product.deleteOne({ id: idToDelete });
    if (result.deletedCount === 0) {
      console.warn(`[DELETE] Failed: Product ID "${idToDelete}" not found.`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log(`[DELETE] Success: Product ID "${idToDelete}" deleted.`);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// Add/Update Product
app.post('/api/products', async (req, res) => {
  try {
    console.log(`[POST] /api/products received. Payload size: ${JSON.stringify(req.body).length} bytes`);
    const productData = req.body;

    const existingProduct = await Product.findOne({ id: productData.id });
    
    if (existingProduct) {
      // Update existing product
      await Product.updateOne({ id: productData.id }, productData);
      console.log(`[POST] Updated product ID: "${productData.id}"`);
    } else {
      // Add new product
      await Product.create(productData);
      console.log(`[POST] Added new product ID: "${productData.id}"`);
    }

    res.status(201).json(productData);
  } catch (err) {
    res.status(500).json({ message: 'Error saving product', error: err.message });
  }
});

// Get Store Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        payment: { razorpayEnabled: false, codEnabled: true },
        store: {
          name: "AstraleanHomes",
          deliveryDuration: "3-5 Business Days",
          contactEmail: "support@astraleanhomes.com",
          termsAndConditions: "Standard terms apply.",
          gstNumber: ""
        }
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving settings', error: err.message });
  }
});

// Update Store Settings
app.put('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        payment: { razorpayEnabled: false, codEnabled: true },
        store: {
          name: "AstraleanHomes",
          deliveryDuration: "3-5 Business Days",
          contactEmail: "support@astraleanhomes.com",
          termsAndConditions: "Standard terms apply.",
          gstNumber: ""
        }
      });
    }

    if (req.body.payment) {
      settings.payment = { ...settings.payment, ...req.body.payment };
    }
    if (req.body.store) {
      settings.store = { ...settings.store, ...req.body.store };
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error saving settings', error: err.message });
  }
});

// --- ORDERS API ---

// Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order({
      id: `ord-${Date.now()}`,
      ...orderData
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// Get All Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
});

// Update Order Status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});

// Delete Order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const result = await Order.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered' });
    }
    if (phone) {
      const exists = await User.findOne({ phone });
      if (exists) return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      id: String(Date.now()),
      email,
      phone,
      password: hashedPassword,
      role: 'user'
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Mock OTP Database (In-memory for simplicity)
const otpStore = {};

// Send OTP (Mock)
app.post('/api/auth/send-otp', (req, res) => {
  const { identity } = req.body;
  if (!identity) return res.status(400).json({ message: 'Identity (Email/Phone) is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[identity] = otp;

  console.log(`[MOCK OTP] Sent to ${identity}: ${otp}`);
  res.json({ message: 'OTP sent successfully (Check server console for mock OTP)' });
});

// Verify OTP (Mock)
app.post('/api/auth/verify-otp', (req, res) => {
  const { identity, otp } = req.body;
  if (otpStore[identity] === otp) {
    delete otpStore[identity];
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
});

// Login (Support Email or Phone)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identity, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identity }, { phone: identity }]
    });

    if (!user) return res.status(400).json({ message: 'Invalid email/phone or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email/phone or password' });

    // Return user info and a mock token
    const payload = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role
    })).toString('base64');

    res.status(200).json({
      message: 'Login successful',
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.mocksignature`,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Enquiries Routes
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const newEnquiry = new Enquiry({
      id: `enq-${Date.now()}`,
      name: name || 'Newsletter Subscriber',
      email,
      message: message || 'N/A (Subscribed to Newsletter)'
    });
    await newEnquiry.save();

    res.status(201).json({ message: 'Submitted successfully', enquiry: newEnquiry });
  } catch (err) {
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
});

app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving enquiries', error: err.message });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const result = await Enquiry.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting enquiry', error: err.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build not found. Please run npm run build or use dev server on port 3000.');
  }
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
