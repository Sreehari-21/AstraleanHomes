const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'build')));

const USERS_FILE = path.join(__dirname, 'users.json');
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Helper: Read Data
function readData(file) {
  try {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return null;
  }
}

// Helper: Read users
function readUsers() {
  const db = readData(DB_FILE);
  return (db && db.users) ? db.users : [];
}

// Helper: Write users
function writeUsers(users) {
  const db = readData(DB_FILE) || { products: [], categories: { major: [], sub: [], collections: [] }, users: [], orders: [] };
  db.users = users;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// --- API ROUTES ---

// Get All Products (Filtered by category if provided)
app.get('/api/products', (req, res) => {
  const db = readData(DB_FILE);
  if (!db || !db.products) return res.status(500).json({ message: 'DB not found' });
  
  let products = db.products;
  const category = req.query.category;
  
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  res.json(products);
});

// Get Categories Hierarchy
app.get('/api/categories', (req, res) => {
  const db = readData(DB_FILE);
  if (!db || !db.categories) return res.status(500).json({ message: 'Categories not found' });
  res.json(db.categories);
});

// Add/Update Categories (Helper for Admin)
app.post('/api/categories/:type', (req, res) => {
  const { type } = req.params;
  const newData = req.body;
  const db = readData(DB_FILE);
  if (!db) return res.status(500).json({ message: 'DB not found' });

  if (!db.categories[type]) db.categories[type] = [];
  
  // Simple ID generation or use provided ID
  if (!newData.id) newData.id = `${type}-${Date.now()}`;
  
  db.categories[type].push(newData);
  
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(newData);
});

// Get Single Product
app.get('/api/products/:id', (req, res) => {
  const db = readData(DB_FILE);
  if (!db || !db.products) return res.status(500).json({ message: 'DB not found' });
  
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  res.json(product);
});

// Delete Product
app.delete('/api/products/:id', (req, res) => {
  const db = readData(DB_FILE);
  if (!db || !db.products) return res.status(500).json({ message: 'DB not found' });
  
  const idToDelete = req.params.id;
  console.log(`[DELETE] Request for product ID: "${idToDelete}"`);
  
  const initialLength = db.products.length;
  // Log available IDs to debug mismatch
  console.log(`Available IDs: ${db.products.map(p => p.id || p._id).join(', ')}`);
  
  db.products = db.products.filter(p => {
    const pid = String(p.id || p._id);
    return pid !== idToDelete;
  });
  
  if (db.products.length === initialLength) {
    console.warn(`[DELETE] Failed: Product ID "${idToDelete}" not found.`);
    return res.status(404).json({ message: 'Product not found' });
  }
  
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  console.log(`[DELETE] Success: Product ID "${idToDelete}" deleted.`);
  res.json({ message: 'Product deleted successfully' });
});

// Add/Update Product
app.post('/api/products', (req, res) => {
  console.log(`[POST] /api/products received. Payload size: ${JSON.stringify(req.body).length} bytes`);
  const productData = req.body;
  const db = readData(DB_FILE);
  if (!db || !db.products) return res.status(500).json({ message: 'DB not found' });

  const index = db.products.findIndex(p => p.id === productData.id);
  
  if (index !== -1) {
    // Update existing product
    db.products[index] = { ...db.products[index], ...productData };
    console.log(`[POST] Updated product ID: "${productData.id}"`);
  } else {
    // Add new product
    db.products.push(productData);
    console.log(`[POST] Added new product ID: "${productData.id}"`);
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(productData);
});

// Get Store Settings
app.get('/api/settings', (req, res) => {
  // Return default or mock settings if settings.json doesn't exist
  const settings = {
    store: {
      name: "AstraleanHomes",
      deliveryDuration: "3-5 Business Days",
      contactEmail: "support@astraleanhomes.com"
    }
  };
  res.json(settings);
});

// Auth Routes (Modified to use helper)

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, phone, password } = req.body;
  const users = readUsers();

  if (email && users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  if (phone && users.find(u => u.phone === phone)) {
    return res.status(400).json({ message: 'Phone number already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { 
    id: Date.now(),
    email, 
    phone, 
    password: hashedPassword,
    role: 'user' 
  };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Mock OTP Database (In-memory for simplicity)
const otpStore = {};

// Send OTP (Mock)
app.post('/api/auth/send-otp', (req, res) => {
  const { identity } = req.body; // email or phone
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
  const { identity, password } = req.body; // frontend sends 'identity' instead of 'email'
  const users = readUsers();
  
  const user = users.find(u => u.email === identity || u.phone === identity);

  if(!user) return res.status(400).json({ message: 'Invalid email/phone or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  
  if(!isMatch) return res.status(400).json({ message: 'Invalid email/phone or password' });

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
});

// Enquiries Routes
app.post('/api/enquiries', (req, res) => {
  const { name, email, message } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const db = readData(DB_FILE);
  if (!db) return res.status(500).json({ message: 'DB not found' });

  if (!db.enquiries) db.enquiries = [];
  
  const newEnquiry = {
    id: `enq-${Date.now()}`,
    name: name || 'Newsletter Subscriber',
    email,
    message: message || 'N/A (Subscribed to Newsletter)',
    date: new Date().toISOString()
  };

  db.enquiries.push(newEnquiry);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  res.status(201).json({ message: 'Submitted successfully', enquiry: newEnquiry });
});

app.get('/api/enquiries', (req, res) => {
  const db = readData(DB_FILE);
  if (!db || !db.enquiries) return res.json([]);
  res.json(db.enquiries);
});

app.delete('/api/enquiries/:id', (req, res) => {
  const db = readData(DB_FILE);
  if (!db || !db.enquiries) return res.status(404).json({ message: 'No enquiries found' });

  const initialLength = db.enquiries.length;
  db.enquiries = db.enquiries.filter(e => e.id !== req.params.id);

  if (db.enquiries.length === initialLength) {
    return res.status(404).json({ message: 'Enquiry not found' });
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  res.json({ message: 'Enquiry deleted successfully' });
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


// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
