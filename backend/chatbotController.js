const natural = require('natural');
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const wordnet = require('wordnet');

// Advanced tokenization
const tokenizer = new natural.AggressiveTokenizerPt();

// Improved sentiment analysis
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// Emotion detection
const emotions = {
  joy: ['happy', 'excited', 'delighted', 'content'],
  sadness: ['sad', 'depressed', 'gloomy', 'heartbroken'],
  anger: ['angry', 'furious', 'irritated', 'annoyed'],
  fear: ['scared', 'anxious', 'nervous', 'worried'],
  surprise: ['surprised', 'astonished', 'amazed', 'shocked'],
  disgust: ['disgusted', 'repulsed', 'revolted', 'sickened']
};

// Mental health topics and interventions
const mentalHealthTopics = {
  anxiety: {
    symptoms: ['worry', 'restlessness', 'tension', 'rapid heartbeat'],
    interventions: [
      "Practice deep breathing exercises to calm your nervous system.",
      "Try progressive muscle relaxation to reduce physical tension.",
      "Challenge negative thoughts using cognitive restructuring techniques.",
      "Engage in regular physical exercise to reduce anxiety symptoms.",
      "Consider mindfulness meditation to stay grounded in the present moment."
    ]
  },
  depression: {
    symptoms: ['sadness', 'hopelessness', 'loss of interest', 'fatigue'],
    interventions: [
      "Set small, achievable daily goals to build a sense of accomplishment.",
      "Establish a consistent sleep schedule to regulate your mood.",
      "Reach out to trusted friends or family for social support.",
      "Engage in activities you used to enjoy, even if you don't feel like it initially.",
      "Consider keeping a gratitude journal to focus on positive aspects of your life."
    ]
  },
  stress: {
    symptoms: ['overwhelmed', 'irritability', 'difficulty concentrating', 'sleep problems'],
    interventions: [
      "Prioritize and organize tasks to make them more manageable.",
      "Practice time management techniques like the Pomodoro method.",
      "Incorporate regular breaks and self-care activities into your routine.",
      "Try stress-reducing activities like yoga or tai chi.",
      "Learn to say 'no' to additional commitments when you're feeling overwhelmed."
    ]
  },
  trauma: {
    symptoms: ['flashbacks', 'avoidance', 'hypervigilance', 'nightmares'],
    interventions: [
      "Consider seeking professional help from a trauma-informed therapist.",
      "Practice grounding techniques to stay connected to the present moment.",
      "Engage in trauma-sensitive yoga or body-based therapies.",
      "Join a support group for survivors of similar experiences.",
      "Learn and practice self-compassion techniques."
    ]
  },
  addiction: {
    symptoms: ['cravings', 'loss of control', 'continued use despite consequences', 'withdrawal'],
    interventions: [
      "Reach out to a addiction specialist or counselor for professional support.",
      "Attend support group meetings like AA, NA, or SMART Recovery.",
      "Identify and avoid triggers that lead to substance use.",
      "Develop healthy coping mechanisms to replace addictive behaviors.",
      "Create a strong support network of friends and family who support your recovery."
    ]
  }
};

// Conversation context
let conversationContext = {
  currentTopic: null,
  emotionalState: null,
  previousInterventions: [],
  userBackground: {}
};

// Load Universal Sentence Encoder model
let model;
use.load().then(loadedModel => {
  model = loadedModel;
});

// Function to get sentence embeddings
async function getEmbedding(text) {
  const embeddings = await model.embed(text);
  return embeddings.arraySync()[0];
}

// Function to calculate cosine similarity
function cosineSimilarity(embedding1, embedding2) {
  const dotProduct = embedding1.reduce((sum, a, i) => sum + a * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

// Function to detect emotions in text
function detectEmotions(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const detectedEmotions = {};
  for (let emotion in emotions) {
    detectedEmotions[emotion] = emotions[emotion].filter(word => tokens.includes(word)).length;
  }
  return detectedEmotions;
}

// Function to identify mental health topics
function identifyTopics(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const identifiedTopics = {};
  for (let topic in mentalHealthTopics) {
    identifiedTopics[topic] = mentalHealthTopics[topic].symptoms.filter(symptom => tokens.includes(symptom)).length;
  }
  return identifiedTopics;
}

// Function to generate a response based on analysis
async function generateResponse(analysis, userMessage) {
  let response = '';

  // Update conversation context
  conversationContext.currentTopic = Object.keys(analysis.topics).reduce((a, b) => analysis.topics[a] > analysis.topics[b] ? a : b);
  conversationContext.emotionalState = Object.keys(analysis.emotions).reduce((a, b) => analysis.emotions[a] > analysis.emotions[b] ? a : b);

  // Empathetic acknowledgment
  if (analysis.sentiment < 0) {
    response += "I'm sorry to hear that you're feeling this way. ";
  } else if (analysis.sentiment > 0) {
    response += "It's great to hear that you're feeling positive. ";
  }

  // Address identified topic
  if (conversationContext.currentTopic) {
    const topic = conversationContext.currentTopic;
    const interventions = mentalHealthTopics[topic].interventions;
    const newIntervention = interventions.find(i => !conversationContext.previousInterventions.includes(i));
    
    if (newIntervention) {
      response += `Regarding ${topic}, here's a suggestion that might help: ${newIntervention} `;
      conversationContext.previousInterventions.push(newIntervention);
    } else {
      response += `It seems like ${topic} is still on your mind. Remember, healing takes time and it's okay to have ups and downs. `;
    }
  }

  // Emotional support
  if (conversationContext.emotionalState) {
    switch (conversationContext.emotionalState) {
      case 'joy':
        response += "I'm glad you're feeling positive. What's contributing to your good mood?";
        break;
      case 'sadness':
        response += "It's okay to feel sad. Would you like to talk more about what's bringing you down?";
        break;
      case 'anger':
        response += "I can sense that you're feeling frustrated. Is there a specific situation that's bothering you?";
        break;
      case 'fear':
        response += "It's natural to feel anxious sometimes. Can you identify what's making you feel this way?";
        break;
      case 'surprise':
        response += "That sounds unexpected. How are you processing this surprise?";
        break;
      case 'disgust':
        response += "I'm sorry you're experiencing these negative feelings. Would you like to discuss what's causing them?";
        break;
    }
  }

  // If no specific topic or emotion was identified, ask an open-ended question
  if (!response) {
    response = "I'm here to listen and support you. Can you tell me more about what's on your mind?";
  }

  // Use WordNet to find synonyms and create more varied responses
  const words = tokenizer.tokenize(response);
  for (let i = 0; i < words.length; i++) {
    if (Math.random() < 0.1) { // 10% chance to replace a word with a synonym
      const synsets = await new Promise(resolve => wordnet.lookup(words[i], resolve));
      if (synsets.length > 0) {
        const synonyms = synsets[0].synonyms;
        if (synonyms.length > 0) {
          words[i] = synonyms[Math.floor(Math.random() * synonyms.length)];
        }
      }
    }
  }
  response = words.join(' ');

  return response;
}

exports.sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const embedding = await getEmbedding(message);
    const sentimentScore = sentiment.getSentiment(tokenizer.tokenize(message));
    const emotions = detectEmotions(message);
    const topics = identifyTopics(message);

    const analysis = {
      embedding,
      sentiment: sentimentScore,
      emotions,
      topics
    };

    const response = await generateResponse(analysis, message);

    res.json({ message: response, analysis });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: "I apologize, but I'm having trouble processing your message right now. Could you please try rephrasing or ask me something else?" });
  }
};