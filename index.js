const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MONGODB_URL = 'mongodb+srv://bumbleroofing:7fIO0kx5JwsSXtM9@rest.woruh.mongodb.net/?retryWrites=true&w=majority'; // Replace this with your MongoDB connection string
const DB_NAME = 'bumbleroofing'; // Replace this with your MongoDB database name
const COLLECTION_NAME = 'areadata'; // Replace this with your MongoDB collection name

app.use(cors());

let db;

// Connect to MongoDB
async function connectToDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Middleware to parse the request body as JSON
app.use(bodyParser.json());

// Endpoint to save data
app.post('/savedata', async (req, res) => {
  const { id, value } = req.body;

  if (!id || !value) {
    return res.status(400).json({ error: 'Missing id or value in the request body' });
  }

  // Save data to MongoDB collection
  try {
    await db.collection(COLLECTION_NAME).insertOne({ id, value });
    res.json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('Failed to save data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Endpoint to get data by id
app.post('/getdata', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing id in the request body' });
  }

  // Find the data in the MongoDB collection by id
  try {
    const result = await db.collection(COLLECTION_NAME).findOne({ id });
    if (!result) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(result.value);
  } catch (err) {
    console.error('Failed to get data:', err);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

// Start the server after connecting to the database
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
});
