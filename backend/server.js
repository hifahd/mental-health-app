const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import controllers
const authController = require('./auth/authController');
const moodController = require('./moodController');
const activityController = require('./activityController');

// Import middleware
const authMiddleware = require('./auth/authMiddleware');

const app = express();
const port = process.env.PORT || 5000; // Changed to 5000

app.use(cors({
  origin: 'http://localhost:3000' // This allows requests from your React app
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Mental Health Support App API' });
});

// Auth routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);

// Mood routes
app.post('/api/mood', authMiddleware, moodController.createMoodEntry);
app.get('/api/mood', authMiddleware, moodController.getMoodEntries);

// Activity routes
app.post('/api/activity', authMiddleware, activityController.createActivity);
app.get('/api/activity', authMiddleware, activityController.getActivities);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});