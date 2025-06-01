const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = 3000; // or any port you prefer

// Use MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

let db, freejournalCollection;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db('blog');
    freejournalCollection = db.collection('freejournal');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// API endpoint to handle form submissions
app.post('/api/freejournal', async (req, res) => {
  try {
    console.log('Received form data:', req.body); // Debug log
    const { name, email, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    await freejournalCollection.insertOne({ name, email, message, date: new Date() });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving to database:', err);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});
