const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiModels() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY not set');
        process.exit(1);
    }

    console.log('🔑 Testing API key:', apiKey.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names
    const modelsToTest = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro'
    ];
    
    console.log('\n🧪 Testing which models work with your API key:\n');
    
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            const text = result.response.text();
            
            console.log(`✅ ${modelName} - WORKS`);
            console.log(`   Response: ${text.substring(0, 50)}...`);
        } catch (error) {
            if (error.status === 404) {
                console.log(`❌ ${modelName} - NOT FOUND (404)`);
            } else if (error.status === 400) {
                console.log(`⚠️  ${modelName} - BAD REQUEST (400): ${error.message.substring(0, 80)}`);
            } else {
                console.log(`❌ ${modelName} - ERROR: ${error.message.substring(0, 80)}`);
            }
        }
    }
}

testGeminiModels();
