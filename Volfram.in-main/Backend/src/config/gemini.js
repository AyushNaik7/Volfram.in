const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('⚠️  API key is not set. Chatbot will not work properly.');
}

// Check if it's a Gemini key (starts with AIza)
const isGemini = apiKey && apiKey.startsWith('AIza');

let genAI = null;
let model = null;

if (isGemini) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Using Gemini AI (gemini-1.5-flash)');
}

module.exports = { isGemini, model };
