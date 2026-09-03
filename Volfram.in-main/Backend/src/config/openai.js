const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Detect LLM provider from API key prefix and return configuration
 * @param {string} apiKey - The API key from environment
 * @returns {{ provider: string, apiKey: string, baseURL: string|undefined, model: string, type: string }}
 */
function detectProvider(apiKey) {
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Groq: keys start with gsk_
    if (apiKey.startsWith('gsk_')) {
        return {
            provider: 'Groq',
            type: 'openai',
            apiKey,
            baseURL: 'https://api.groq.com/openai/v1',
            model: process.env.LLM_MODEL_GROQ || 'openai/gpt-oss-120b'
        };
    }

    // Google Gemini / AI Studio: keys can start with AIzaSy or AQ.
    if (apiKey.startsWith('AIzaSy') || apiKey.startsWith('AQ.')) {
        return {
            provider: 'Google Gemini',
            type: 'gemini',
            apiKey,
            baseURL: null, // Gemini uses its own SDK, not OpenAI format
            model: process.env.LLM_MODEL_GEMINI || 'gemini-1.5-flash'
        };
    }

    // OpenAI: typically starts with sk-, but treat anything else as OpenAI
    return {
        provider: 'OpenAI',
        type: 'openai',
        apiKey,
        baseURL: undefined, // Use SDK default
        model: process.env.LLM_MODEL_OPENAI || 'gpt-4o-mini'
    };
}

// Get configuration
const apiKey = process.env.OPENAI_API_KEY;
let config = null;
let openaiClient = null;
let geminiClient = null;

if (apiKey) {
    try {
        config = detectProvider(apiKey);
        console.log(`🔍 Detected provider type: ${config.type}`);
        
        if (config.type === 'gemini') {
            // Use native Gemini SDK
            console.log('🔧 Initializing Gemini client...');
            const genAI = new GoogleGenerativeAI(config.apiKey);
            geminiClient = genAI.getGenerativeModel({ model: config.model });
            console.log('✅ Gemini client initialized');
        } else {
            // Use OpenAI SDK for OpenAI and Groq
            console.log('🔧 Initializing OpenAI client...');
            openaiClient = new OpenAI({
                apiKey: config.apiKey,
                baseURL: config.baseURL
            });
            console.log('✅ OpenAI client initialized');
        }

        // Log provider detection at startup (never log the key itself)
        console.log(`🤖 LLM Provider: ${config.provider}`);
        console.log(`📦 Model: ${config.model}`);
    } catch (error) {
        console.error('❌ LLM Configuration Error:', error.message);
        console.error(error);
    }
} else {
    console.warn('⚠️  OPENAI_API_KEY is not set. Chatbot will not work.');
}

module.exports = {
    openai: openaiClient,
    gemini: geminiClient,
    config,
    detectProvider
};
