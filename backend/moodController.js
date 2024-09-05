const MoodEntry = require('./models/MoodEntry');

exports.createMoodEntry = async (req, res) => {
  try {
    const { mood, note } = req.body;
    const userId = req.userData.userId; // This comes from the auth middleware

    const newMoodEntry = new MoodEntry({
      user: userId,
      mood,
      note
    });

    await newMoodEntry.save();

    res.status(201).json({ message: 'Mood entry created successfully', moodEntry: newMoodEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error creating mood entry', error: error.message });
  }
};

exports.getMoodEntries = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const moodEntries = await MoodEntry.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(moodEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood entries', error: error.message });
  }
};