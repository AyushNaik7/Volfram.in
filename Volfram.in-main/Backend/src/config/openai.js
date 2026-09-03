const OpenAI = require('openai');

// OpenRouter configuration
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is not set. Set your OpenRouter API key.');
    process.exit(1);
}

// Default model - can be overridden with LLM_MODEL env var
const model = process.env.LLM_MODEL || 'qwen/qwen-2-7b-instruct:free';

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://volfram-ashen.vercel.app',
        'X-Title': 'Volfram Systems Chatbot'
    }
});

console.log('🤖 LLM Provider: OpenRouter');
console.log(`📦 Model: ${model}`);

module.exports = {
    openai,
    model
};
