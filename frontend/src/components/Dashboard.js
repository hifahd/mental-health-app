import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/mood', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoodEntries(response.data);
    } catch (error) {
      console.error('Error fetching mood entries', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/mood', 
        { mood: parseInt(newMood), note: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMood('');
      setNewNote('');
      fetchMoodEntries();
    } catch (error) {
      console.error('Error creating mood entry', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mood Tracker Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Mood Entry
          </Typography>
          <form onSubmit={handleSubmit}>
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
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Mood Entries
          </Typography>
          <List>
            {moodEntries.map((entry, index) => (
              <ListItem key={index} divider>
                <ListItemText 
                  primary={`Mood: ${entry.mood}`} 
                  secondary={`${entry.note} - ${new Date(entry.createdAt).toLocaleString()}`} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard;