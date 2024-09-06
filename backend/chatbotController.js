const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Set up Dialogflow client
const projectId = 'YOUR_DIALOGFLOW_PROJECT_ID';
const sessionClient = new dialogflow.SessionsClient();

exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  const sessionId = uuid.v4();

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ message: result.fulfillmentText });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing your message' });
  }
};