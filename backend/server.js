require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GymLeader = require('./models/GymLeader');

const app = express();
app.use(express.json());
app.use(cors());

// Connect using the connection string from .env (never hard-coded)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Returns true when the error came from Mongoose validation or a bad ObjectId
const isBadRequest = (err) => err.name === 'ValidationError' || err.name === 'CastError';

// GET all leaders -> 200 + array | 500
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find();
    res.status(200).json(leaders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one leader -> 200 + leader | 404 | 500
app.get('/api/leaders/:id', async (req, res) => {
  try {
    const leader = await GymLeader.findById(req.params.id);
    if (!leader) return res.status(404).json({ message: 'Gym Leader not found' });
    res.status(200).json(leader);
  } catch (err) {
    // A malformed id can never match a document, so treat it as not found
    if (err.name === 'CastError') return res.status(404).json({ message: 'Gym Leader not found' });
    res.status(500).json({ message: err.message });
  }
});

// POST create -> 201 + saved leader | 400 if validation fails
app.post('/api/leaders', async (req, res) => {
  try {
    const leader = await GymLeader.create(req.body);
    res.status(201).json(leader);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update -> 200 + UPDATED leader | 400 | 404
app.put('/api/leaders/:id', async (req, res) => {
  try {
    const updated = await GymLeader.findByIdAndUpdate(req.params.id, req.body, {
      new: true,            // return the updated document, not the old one
      runValidators: true,  // enforce the schema rules on updates too
    });
    if (!updated) return res.status(404).json({ message: 'Gym Leader not found' });
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Gym Leader not found' });
    res.status(isBadRequest(err) ? 400 : 500).json({ message: err.message });
  }
});

// DELETE -> 200 + confirmation message | 404 | 500
app.delete('/api/leaders/:id', async (req, res) => {
  try {
    const deleted = await GymLeader.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Gym Leader not found' });
    res.status(200).json({ message: `${deleted.name} was removed from the registry` });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Gym Leader not found' });
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
