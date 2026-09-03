# Chatbot Refactor - File Diffs

## File 1: `Backend/src/config/openai.js`

### BEFORE (Broken - Only Groq Detection)
```javascript
const OpenAI = require('openai');

// DEPRECATED: This file is no longer used. Use gemini-only.js instead.

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY is not set. Chatbot will not work properly.');
}

const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key' // Prevent initialization errors
});

module.exports = openai;
```

### AFTER (Fixed - Multi-Provider Detection)
```javascript
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
```

### Key Changes:
- ✅ **Added `detectProvider()` function** - Recognizes Groq (`gsk_`), Gemini (`AIzaSy`), OpenAI (default)
- ✅ **Added environment variable overrides** - `LLM_MODEL_GROQ`, `LLM_MODEL_GEMINI`, `LLM_MODEL_OPENAI`
- ✅ **Added startup logging** - Shows provider and model without exposing keys
- ✅ **Changed export** - Now exports `{ openai, config, detectProvider }` instead of just client
- ✅ **Correct Gemini baseURL** - `https://generativelanguage.googleapis.com/v1beta/openai/`
- ✅ **Current free models** - `gemini-2.5-flash` (not deprecated `gemini-2.0-flash`)

---

## File 2: `Backend/src/routes/chatbot.js`

### BEFORE (From deleted file - had Groq-only logic)
The route had this duplicated in TWO places (simplified mode + full Supabase mode):
```javascript
// Determine which model to use based on API key type
const isGroq = process.env.OPENAI_API_KEY.startsWith('gsk_');
const model = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';  // ❌ Deprecated Groq model!

console.log(`Using model: ${model} (Groq: ${isGroq})`);

// Get AI response
const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
    temperature: 0.7,
    max_tokens: 1000
});
```

Error handling:
```javascript
} catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
        success: false,
        error: error.message  // ❌ Exposes raw error to user
    });
}
```

### AFTER (Refactored - Shared Config + Better Errors)

Import shared config:
```javascript
const { openai, config } = require('../config/openai');
```

Extract AI response generation (no more duplication):
```javascript
/**
 * Generate AI response using configured LLM provider
 */
async function generateAIResponse(messages) {
    if (!openai || !config) {
        throw new Error('LLM service is not configured');
    }

    const completion = await openai.chat.completions.create({
        model: config.model,  // ✅ Single source of truth
        messages,
        temperature: 0.7,
        max_tokens: 1000
    });

    return completion.choices[0].message.content;
}
```

Enhanced error handling:
```javascript
/**
 * Classify error type and return appropriate response
 */
function handleChatError(error, provider, model) {
    // Log detailed error for debugging
    console.error('❌ Chat Error:');
    console.error(`   Provider: ${provider || 'unknown'}`);
    console.error(`   Model: ${model || 'unknown'}`);
    console.error(`   Error: ${error.message}`);
    
    if (error.status) {
        console.error(`   HTTP Status: ${error.status}`);
    }

    let statusCode = 500;
    let errorType = 'upstream_error';
    let userMessage = 'Sorry, something went wrong. Please email steam@volfram.in for assistance.';

    // Configuration/authentication errors (4xx-style)
    if (error.status === 401 || error.status === 403) {
        statusCode = 503;
        errorType = 'authentication_error';
        userMessage = 'Chatbot service is misconfigured. Please contact support.';
    } else if (error.status === 404) {
        statusCode = 503;
        errorType = 'model_not_found';
        userMessage = 'The AI model is unavailable. Please contact support.';
    } else if (error.status === 429) {
        statusCode = 503;
        errorType = 'rate_limit';
        userMessage = 'Service is temporarily busy. Please try again in a moment.';
    }

    return {
        statusCode,
        body: {
            success: false,
            error: errorType,
            message: userMessage,
            reply: userMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
    };
}
```

Route usage:
```javascript
router.post('/chat/chat', async (req, res) => {
    try {
        // ... validation ...
        
        // Simplified mode (no Supabase)
        const chatMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message }
        ];

        const aiResponse = await generateAIResponse(chatMessages);  // ✅ Shared helper

        return res.json({
            success: true,
            response: aiResponse,
            reply: aiResponse
        });

    } catch (error) {
        const errorResponse = handleChatError(error, config?.provider, config?.model);
        res.status(errorResponse.statusCode).json(errorResponse.body);  // ✅ Proper classification
    }
});
```

### Key Changes:
- ✅ **Removed duplicate detection** - No more `isGroq` checks in route
- ✅ **Removed hardcoded models** - Uses `config.model` from openai.js
- ✅ **Extracted `generateAIResponse()`** - Single function for both modes
- ✅ **Added `handleChatError()`** - Classifies errors with proper HTTP status codes
- ✅ **Better logging** - Shows provider + model + status + error in logs
- ✅ **User-friendly errors** - Returns helpful messages, hides raw errors in prod
- ✅ **Same logic for both modes** - Simplified (no Supabase) and Full (with Supabase)

---

## File 3: `Backend/src/index.js`

### BEFORE
```javascript
const chatbotRoutes = require("./routes/chatbot-gemini.js");
```

### AFTER
```javascript
const chatbotRoutes = require("./routes/chatbot.js");
```

### Key Changes:
- ✅ **Switched to unified route** - Now using refactored `chatbot.js` instead of Gemini-specific version

---

## Summary of Changes

### Problem → Solution

| Problem | Before | After |
|---------|--------|-------|
| Only Groq keys worked | `if (apiKey.startsWith('gsk_'))` | Detects Groq, Gemini, OpenAI |
| Deprecated models hardcoded | `'llama-3.3-70b-versatile'` | `process.env.LLM_MODEL_GROQ \|\| 'openai/gpt-oss-120b'` |
| Logic duplicated in 2 places | Copy-pasted in both modes | Single `generateAIResponse()` helper |
| Generic 500 errors | `error.message` | Classified error types with proper status codes |
| No visibility at startup | Silent | Logs provider + model |
| Model changes need deploy | Hardcoded in code | Override via env vars |

### Lines of Code

| File | Before | After | Change |
|------|--------|-------|--------|
| `config/openai.js` | 14 lines | 56 lines | +42 (provider detection) |
| `routes/chatbot.js` | ~250 lines | ~280 lines | +30 (error handling) |
| **Total** | ~264 lines | ~336 lines | +72 lines (better architecture) |

### Maintenance Impact

**Before:** Model deprecation = code change + deploy + test cycle
**After:** Model deprecation = change 1 env var on Render dashboard

**Before:** Unknown provider = silent 500 error
**After:** Unknown provider = logged at startup with provider name

**Before:** Debugging requires guessing which provider/model was used
**After:** Every error logs provider + model + HTTP status
