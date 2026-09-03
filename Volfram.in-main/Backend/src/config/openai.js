const OpenAI = require('openai');

/**
 * Detect LLM provider from API key prefix and return configuration
 * @param {string} apiKey - The API key from environment
 * @returns {{ provider: string, apiKey: string, baseURL: string|undefined, model: string }}
 */
function detectProvider(apiKey) {
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Groq: keys start with gsk_
    if (apiKey.startsWith('gsk_')) {
        return {
            provider: 'Groq',
            apiKey,
            baseURL: 'https://api.groq.com/openai/v1',
            model: process.env.LLM_MODEL_GROQ || 'openai/gpt-oss-120b'
        };
    }

    // Google Gemini / AI Studio: keys start with AIzaSy
    if (apiKey.startsWith('AIzaSy')) {
        return {
            provider: 'Google Gemini',
            apiKey,
            baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
            model: process.env.LLM_MODEL_GEMINI || 'gemini-2.5-flash'
        };
    }

    // OpenAI: typically starts with sk-, but treat anything else as OpenAI
    return {
        provider: 'OpenAI',
        apiKey,
        baseURL: undefined, // Use SDK default
        model: process.env.LLM_MODEL_OPENAI || 'gpt-4o-mini'
    };
}

// Get configuration
const apiKey = process.env.OPENAI_API_KEY;
let config = null;
let openaiClient = null;

if (apiKey) {
    try {
        config = detectProvider(apiKey);
        
        openaiClient = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL
        });

        // Log provider detection at startup (never log the key itself)
        console.log(`🤖 LLM Provider: ${config.provider}`);
        console.log(`📦 Model: ${config.model}`);
    } catch (error) {
        console.error('❌ LLM Configuration Error:', error.message);
    }
} else {
    console.warn('⚠️  OPENAI_API_KEY is not set. Chatbot will not work.');
}

module.exports = {
    openai: openaiClient,
    config,
    detectProvider
};
