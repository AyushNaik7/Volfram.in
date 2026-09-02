const OpenAI = require('openai');

// Check if using Groq or OpenAI based on API key prefix
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY is not set. Chatbot will not work properly.');
}

const isGroq = apiKey && apiKey.startsWith('gsk_');

const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key', // Prevent initialization errors
    baseURL: isGroq ? 'https://api.groq.com/openai/v1' : undefined
});

module.exports = openai;
