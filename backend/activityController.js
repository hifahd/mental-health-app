const Activity = require('./models/Activity');

exports.createActivity = async (req, res) => {
  try {
    const { type, duration, note } = req.body;
    const userId = req.userData.userId;

    const newActivity = new Activity({
      user: userId,
      type,
      duration,
      note
    });

    await newActivity.save();

    res.status(201).json({ message: 'Activity created successfully', activity: newActivity });
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};