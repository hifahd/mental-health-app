const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const responses = {
  greeting: ["Hello! How are you feeling today?", "Hi there! How can I help you?"],
  mood_inquiry: ["I'm sorry you're feeling that way. Would you like to talk about it?", "That sounds challenging. Is there anything specific on your mind?"],
  positive_reinforcement: ["That's great to hear! What's been going well for you?", "I'm glad you're feeling good. What's contributing to your positive mood?"],
  general_advice: ["Remember, it's okay to take things one step at a time.", "Have you tried any relaxation techniques today?", "Sometimes, talking to a friend can really help."],
  goodbye: ["Take care! Remember, I'm here if you need to talk.", "Wishing you well. Don't hesitate to reach out if you need support."]
};

function chooseResponse(category) {
  const options = responses[category];
  return options[Math.floor(Math.random() * options.length)];
}

function analyzeMessage(message) {
  const tokens = tokenizer.tokenize(message.toLowerCase());
  
  if (tokens.some(token => ['hi', 'hello', 'hey'].includes(token))) {
    return 'greeting';
  }
  if (tokens.some(token => ['sad', 'depressed', 'unhappy', 'anxious', 'worried'].includes(token))) {
    return 'mood_inquiry';
  }
  if (tokens.some(token => ['happy', 'good', 'great', 'excellent'].includes(token))) {
    return 'positive_reinforcement';
  }
  if (tokens.some(token => ['bye', 'goodbye', 'later'].includes(token))) {
    return 'goodbye';
  }
  return 'general_advice';
}

exports.sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const category = analyzeMessage(message);
    const response = chooseResponse(category);

    res.json({ message: response });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing your message' });
  }
};