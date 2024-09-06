import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        AI Support Chat
      </Typography>
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', mb: 2, p: 2, maxHeight: 400 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: message.sender === 'user' ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main', mr: message.sender === 'user' ? 0 : 1, ml: message.sender === 'user' ? 1 : 0 }}>
                  {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
                <Paper elevation={1} sx={{ p: 1, bgcolor: message.sender === 'user' ? 'primary.light' : 'secondary.light', maxWidth: '70%' }}>
                  <ListItemText primary={message.text} />
                </Paper>
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}

export default Chatbot;