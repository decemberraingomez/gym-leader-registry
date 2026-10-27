const mongoose = require('mongoose');

const gymLeaderSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, trim: true },
  region: { type: String, required: true, enum: ['Kanto', 'Johto', 'Hoenn'] },
  town: { type: String, required: true, trim: true },
  badge: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  aceLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    validate: { validator: Number.isInteger, message: 'aceLevel must be a whole number' },
  },
  motto: { type: String, maxlength: 150 },
}, { collection: 'leaders' }); // keep using the existing 'leaders' collection so old entries still show

module.exports = mongoose.model('GymLeader', gymLeaderSchema);
