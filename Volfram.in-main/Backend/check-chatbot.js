#!/usr/bin/env node

/**
 * Chatbot Configuration Checker
 * Run this script to verify your chatbot setup
 * Usage: node check-chatbot.js
 */

require('dotenv').config();

console.log('\n🔍 Checking Chatbot Configuration...\n');
console.log('═'.repeat(50));

let hasErrors = false;
let hasWarnings = false;

// Check 1: OpenAI API Key
console.log('\n1️⃣  OpenAI/Groq API Key');
if (!process.env.OPENAI_API_KEY) {
    console.log('   ❌ MISSING - OPENAI_API_KEY is not set in .env');
    console.log('   → Get a FREE Groq key: https://console.groq.com/keys');
    console.log('   → Or OpenAI key: https://platform.openai.com/api-keys');
    hasErrors = true;
} else {
    const key = process.env.OPENAI_API_KEY;
    const masked = key.substring(0, 7) + '...' + key.substring(key.length - 4);
    
    if (key.startsWith('gsk_')) {
        console.log('   ✅ Groq API key detected: ' + masked);
        console.log('   → Will use model: llama-3.3-70b-versatile');
    } else if (key.startsWith('sk-')) {
        console.log('   ✅ OpenAI API key detected: ' + masked);
        console.log('   → Will use model: gpt-3.5-turbo');
    } else {
        console.log('   ⚠️  Unknown API key format: ' + masked);
        console.log('   → Groq keys start with "gsk_"');
        console.log('   → OpenAI keys start with "sk-"');
        hasWarnings = true;
    }
}

// Check 2: MongoDB
console.log('\n2️⃣  MongoDB Connection');
if (!process.env.MONGODB_URI) {
    console.log('   ⚠️  MONGODB_URI is not set (may cause issues)');
    hasWarnings = true;
} else {
    console.log('   ✅ MONGODB_URI is configured');
    console.log('   → ' + process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
}

// Check 3: Frontend URL (CORS)
console.log('\n3️⃣  Frontend URL (CORS)');
if (!process.env.FRONTEND_URL) {
    console.log('   ⚠️  FRONTEND_URL not set (using defaults)');
    console.log('   → Defaults: localhost:5173, localhost:3000');
    hasWarnings = true;
} else {
    console.log('   ✅ FRONTEND_URL: ' + process.env.FRONTEND_URL);
}

// Check 4: JWT Secret
console.log('\n4️⃣  JWT Secret');
if (!process.env.JWT_SECRET) {
    console.log('   ⚠️  JWT_SECRET not set (auth may not work)');
    hasWarnings = true;
} else {
    console.log('   ✅ JWT_SECRET is configured');
}

// Check 5: Supabase (optional)
console.log('\n5️⃣  Supabase (Optional - for conversation history)');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.log('   ℹ️  Not configured (chatbot will work without history)');
    console.log('   → Set SUPABASE_URL and SUPABASE_KEY to enable');
} else {
    console.log('   ✅ Supabase is configured');
    console.log('   → Conversation history will be saved');
}

// Check 6: Port
console.log('\n6️⃣  Server Port');
const port = process.env.PORT || 5000;
console.log('   ✅ Will run on port: ' + port);

// Check 7: Test OpenAI connection (if key exists)
if (process.env.OPENAI_API_KEY) {
    console.log('\n7️⃣  Testing AI Connection...');
    
    const OpenAI = require('openai');
    const isGroq = process.env.OPENAI_API_KEY.startsWith('gsk_');
    
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: isGroq ? 'https://api.groq.com/openai/v1' : undefined
    });
    
    const model = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';
    
    openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
    })
    .then(response => {
        console.log('   ✅ AI connection successful!');
        console.log('   → Model: ' + model);
        console.log('   → Response: ' + response.choices[0].message.content.substring(0, 50) + '...');
        printSummary();
    })
    .catch(error => {
        console.log('   ❌ AI connection failed!');
        console.log('   → Error: ' + error.message);
        if (error.status === 401) {
            console.log('   → Your API key is invalid or expired');
        } else if (error.status === 429) {
            console.log('   → Rate limit exceeded, but key is valid');
        }
        hasErrors = true;
        printSummary();
    });
} else {
    printSummary();
}

function printSummary() {
    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 Summary:');
    
    if (hasErrors) {
        console.log('\n❌ ERRORS FOUND - Chatbot will NOT work');
        console.log('   Please fix the errors above before starting the server\n');
        process.exit(1);
    } else if (hasWarnings) {
        console.log('\n⚠️  WARNINGS - Chatbot should work but with limitations');
        console.log('   Consider fixing the warnings for full functionality\n');
    } else {
        console.log('\n✅ ALL CHECKS PASSED - Chatbot is ready!');
        console.log('   Run: npm run dev\n');
    }
    
    console.log('📚 For detailed setup instructions, see: CHATBOT_SETUP.md\n');
}
