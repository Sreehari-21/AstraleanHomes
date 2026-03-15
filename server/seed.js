const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const dbPath = path.join(__dirname, '../data/db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Seed Products
    if (dbData.products && dbData.products.length > 0) {
      await Product.insertMany(dbData.products);
      console.log(`${dbData.products.length} products seeded successfully.`);
    }

    // Seed Users (need to save individually to trigger pre-save hashing)
    if (dbData.users && dbData.users.length > 0) {
      for (const userData of dbData.users) {
        const user = new User({
          email: userData.email,
          password: userData.password,
          role: userData.role
        });
        await user.save();
      }
      console.log(`${dbData.users.length} users seeded successfully.`);
    }

    console.log('Seeding completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
