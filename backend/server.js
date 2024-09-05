const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry');
const Activity = require('./models/Activity');

// Import auth controller
const authController = require('./auth/authController');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Mental Health Support App API' });
});

// Auth routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});