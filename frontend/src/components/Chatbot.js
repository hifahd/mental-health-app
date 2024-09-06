import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot', { message: input });
      const botMessage = { text: response.data.message, sender: 'bot' };
      setMessages(messages => [...messages, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' };
      setMessages(messages => [...messages, errorMessage]);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        AI Chatbot
      </Typography>
      <Paper elevation={3} sx={{ height: 300, overflow: 'auto', mb: 2, p: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 1, bgcolor: message.sender === 'user' ? 'primary.light' : 'secondary.light' }}>
                <ListItemText primary={message.text} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chatbot;