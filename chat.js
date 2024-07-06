// /api/chat.js

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  assistantId: process.env.OPENAI_ASSISTANT_ID,
});
const openai = new OpenAIApi(configuration);

let conversationThread = {};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, threadId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        thread_id: threadId,
      });

      const responseMessage = response.data.choices[0].message.content.trim();

      // Store the conversation thread
      conversationThread[threadId] = response.data.thread_id;

      res.status(200).json({ response: responseMessage, threadId: response.data.thread_id });
    } catch (error) {
      console.error('Error fetching completion:', error);
      res.status(500).json({ error: 'Error fetching completion' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
