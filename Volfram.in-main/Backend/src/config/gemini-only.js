const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('⚠️  Gemini API key is not set. Chatbot will not work.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

if (model) {
    console.log('✅ Using FREE Gemini AI (gemini-1.5-flash)');
}

module.exports = { model };
