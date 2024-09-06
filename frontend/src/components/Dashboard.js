import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper, Snackbar, Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';
import axios from 'axios';
import Chatbot from './Chatbot'; // Make sure this import path is correct

function Dashboard() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newActivityType, setNewActivityType] = useState('');
  const [newActivityDuration, setNewActivityDuration] = useState('');
  const [newActivityNote, setNewActivityNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoodEntries();
    fetchActivities();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/mood', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoodEntries(response.data);
    } catch (error) {
      console.error('Error fetching mood entries', error);
      setError('Failed to fetch mood entries. Please try again.');
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities', error);
      setError('Failed to fetch activities. Please try again.');
    }
  };

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/mood', 
        { mood: parseInt(newMood), note: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMood('');
      setNewNote('');
      fetchMoodEntries();
    } catch (error) {
      console.error('Error creating mood entry', error);
      setError('Failed to add mood entry. Please try again.');
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/activity', 
        { type: newActivityType, duration: parseInt(newActivityDuration), note: newActivityNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewActivityType('');
      setNewActivityDuration('');
      setNewActivityNote('');
      fetchActivities();
    } catch (error) {
      console.error('Error creating activity', error);
      setError('Failed to add activity. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mental Health Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Mood Entry Form */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add New Mood Entry
              </Typography>
              <form onSubmit={handleMoodSubmit}>
                <TextField
                  fullWidth
                  label="Mood (1-5)"
                  type="number"
                  value={newMood}
                  onChange={(e) => setNewMood(e.target.value)}
                  InputProps={{ inputProps: { min: 1, max: 5 } }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Mood Entry
                </Button>
              </form>
            </Paper>

            {/* Activity Entry Form */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add New Activity
              </Typography>
              <form onSubmit={handleActivitySubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Activity Type</InputLabel>
                  <Select
                    value={newActivityType}
                    label="Activity Type"
                    onChange={(e) => setNewActivityType(e.target.value)}
                  >
                    <MenuItem value="exercise">Exercise</MenuItem>
                    <MenuItem value="meditation">Meditation</MenuItem>
                    <MenuItem value="reading">Reading</MenuItem>
                    <MenuItem value="socializing">Socializing</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={newActivityDuration}
                  onChange={(e) => setNewActivityDuration(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Note"
                  value={newActivityNote}
                  onChange={(e) => setNewActivityNote(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="secondary">
                  Add Activity
                </Button>
              </form>
            </Paper>

            {/* Recent Entries */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Entries
              </Typography>
              <List>
                {[...moodEntries, ...activities]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((entry, index) => (
                    <ListItem key={index} divider>
                      <ListItemText 
                        primary={entry.mood ? `Mood: ${entry.mood}` : `Activity: ${entry.type}`} 
                        secondary={`${entry.note} - ${new Date(entry.createdAt).toLocaleString()}`} 
                      />
                    </ListItem>
                  ))
                }
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Chatbot />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </Container>
  );
}

export default Dashboard;