const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // or any port you prefer

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
    app.listen(PORT, '0.0.0.0', () => {
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

// API endpoint to handle feedback submissions
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, text, page, category, entryId } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and feedback text are required.' });
    }
    await db.collection('feedback').insertOne({
      name,
      text,
      page,
      category,
      entryId,
      date: new Date()
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: 'Failed to save feedback.' });
  }
});

// API endpoint to handle inquiry form submissions
app.post('/api/inquiry', async (req, res) => {
  try {
    const { email, fname, lname, message } = req.body;
    if (!email || !fname || !lname) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    await db.collection('inquiry').insertOne({
      email,
      fname,
      lname,
      message,
      date: new Date()
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving inquiry:', err);
    // Send the error message to the client for easier debugging
    res.status(500).json({ error: 'Failed to save inquiry.', details: err.message });
  }
});

// GET endpoint to fetch feedback for a specific entry
app.get('/api/feedback', async (req, res) => {
  try {
    const { page, category, entryId } = req.query;
    // Build query object based on available params
    const query = {};
    if (page) query.page = page;
    if (category) query.category = category;
    if (entryId) query.entryId = entryId;
    const feedbacks = await db.collection('feedback')
      .find(query)
      .sort({ date: -1 })
      .toArray();
    // Format date for each feedback
    const formatted = feedbacks.map(fb => ({
      ...fb,
      date: fb.date ? new Date(fb.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
    }));
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});
