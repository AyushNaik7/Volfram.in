const OpenAI = require('openai');

// OpenRouter configuration
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('⚠️ OPENAI_API_KEY is not set. AI chat replies are disabled, but MongoDB chatbot leads remain available.');
}

// Default model - OpenRouter auto-router picks best available free model
// Can be overridden with LLM_MODEL env var (e.g., z-ai/glm-5.2:free)
const model = process.env.LLM_MODEL || 'openrouter/auto';

// Initialize OpenAI client pointing to OpenRouter
const openai = apiKey ? new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://volfram-ashen.vercel.app',
        'X-Title': 'Volfram Systems Chatbot'
    }
}) : null;

if (openai) {
    console.log('🤖 LLM Provider: OpenRouter');
    console.log(`📦 Model: ${model}`);
}

module.exports = {
    openai,
    model
};
