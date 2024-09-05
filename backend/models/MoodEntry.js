const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: Number, required: true, min: 1, max: 5 }, // 1: Very Bad, 5: Very Good
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);