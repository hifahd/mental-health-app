const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

const mentalHealthTopics = {
  anxiety: ["deep breathing", "mindfulness", "cognitive restructuring", "exposure therapy"],
  depression: ["behavioral activation", "cognitive therapy", "exercise", "social support"],
  stress: ["time management", "relaxation techniques", "problem-solving", "self-care"],
  sleep: ["sleep hygiene", "relaxation techniques", "cognitive behavioral therapy for insomnia"],
  relationships: ["communication skills", "boundary setting", "conflict resolution", "empathy building"]
};

const responses = {
  greeting: ["Hello! How are you feeling today?", "Hi there! How can I support you today?"],
  farewell: ["Take care! Remember, I'm here if you need to talk.", "Wishing you well. Don't hesitate to reach out if you need support."],
  gratitude: ["I'm glad I could help. Is there anything else on your mind?", "You're welcome! Remember, seeking support is a sign of strength."],
  confusion: ["I'm sorry if I wasn't clear. Could you tell me more about what's on your mind?", "Let me try to explain that better. What specifically would you like to know?"],
  empathy: ["That sounds really challenging. How are you coping?", "I'm sorry you're going through that. Would you like to talk more about it?"],
  encouragement: ["You're taking important steps by reaching out. That's commendable.", "Remember, progress isn't always linear. Every small step counts."],
  resources: ["There are many resources available. Would you like some information on professional help?", "Sometimes, talking to a mental health professional can be very beneficial. Would you like some information on how to find one?"]
};

function analyzeMessage(message) {
  const tokens = tokenizer.tokenize(message.toLowerCase());
  const sentimentScore = sentiment.getSentiment(tokens);
  
  let topics = [];
  for (let topic in mentalHealthTopics) {
    if (mentalHealthTopics[topic].some(keyword => tokens.includes(keyword))) {
      topics.push(topic);
    }
  }

  if (tokens.some(token => ['hi', 'hello', 'hey'].includes(token))) return { type: 'greeting', sentiment: sentimentScore, topics };
  if (tokens.some(token => ['bye', 'goodbye', 'later'].includes(token))) return { type: 'farewell', sentiment: sentimentScore, topics };
  if (tokens.some(token => ['thanks', 'thank', 'helpful'].includes(token))) return { type: 'gratitude', sentiment: sentimentScore, topics };
  if (tokens.some(token => ['what', 'how', 'why', 'confused'].includes(token))) return { type: 'confusion', sentiment: sentimentScore, topics };
  if (sentimentScore < -1) return { type: 'empathy', sentiment: sentimentScore, topics };
  if (sentimentScore > 1) return { type: 'encouragement', sentiment: sentimentScore, topics };
  
  return { type: 'resources', sentiment: sentimentScore, topics };
}

function generateResponse(analysis) {
  let response = responses[analysis.type][Math.floor(Math.random() * responses[analysis.type].length)];
  
  if (analysis.topics.length > 0) {
    const topic = analysis.topics[0];
    const strategies = mentalHealthTopics[topic];
    response += ` Regarding ${topic}, have you considered trying ${strategies[Math.floor(Math.random() * strategies.length)]}?`;
  }

  return response;
}

exports.sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const analysis = analyzeMessage(message);
    const response = generateResponse(analysis);

    res.json({ message: response, analysis });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing your message' });
  }
};