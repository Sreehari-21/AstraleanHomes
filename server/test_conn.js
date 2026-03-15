const { MongoClient } = require('mongodb');
require('dotenv').config();

const passwordEncoded = encodeURIComponent('admin2321@astralean');
const variations = [
  `mongodb+srv://Admin:${passwordEncoded}@cluster0.m9gbyov.mongodb.net/?retryWrites=true&w=majority`,
  `mongodb+srv://admin:${passwordEncoded}@cluster0.m9gbyov.mongodb.net/?retryWrites=true&w=majority`,
  `mongodb+srv://Admin:admin2321@cluster0.m9gbyov.mongodb.net/?retryWrites=true&w=majority`, // Just in case
  `mongodb+srv://admin:admin2321@cluster0.m9gbyov.mongodb.net/?retryWrites=true&w=majority`
];

async function testConnections() {
  for (const uri of variations) {
    console.log(`Testing URI: ${uri.replace(/:[^@]+@/, ':****@')}`);
    const client = new MongoClient(uri);
    try {
      await client.connect();
      console.log('✅ SUCCESS! Connection established.');
      await client.close();
      process.exit(0);
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
    } finally {
      await client.close();
    }
  }
  console.log('Finished testing all variations.');
  process.exit(1);
}

testConnections();
