# 🚀 Quick Start - Fix Your Chatbot

## TL;DR - Get Chatbot Working in 5 Minutes

### Step 1: Get a FREE API Key (Groq - Recommended)
1. Go to: https://console.groq.com/keys
2. Sign up (free)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

### Step 2: Configure Backend
```bash
cd Volfram.in-main/Backend

# Create .env file from example
cp .env.example .env

# Edit .env and add your API key
# OPENAI_API_KEY=gsk_paste_your_key_here
```

### Step 3: Test Configuration
```bash
npm run check-chatbot
```

You should see: ✅ ALL CHECKS PASSED

### Step 4: Start Backend
```bash
npm run dev
```

Should show:
- ✅ Server running on port 5000
- ✅ Connected to MongoDB

### Step 5: Configure Frontend
```bash
cd ../../Frontend/volform

# Make sure .env exists
cp .env.example .env

# Verify it has:
# VITE_CHATBOT_API_URL=http://localhost:5000
```

### Step 6: Start Frontend
```bash
npm run dev
```

### Step 7: Test Chatbot
1. Open browser: http://localhost:5173
2. Click the 💬 button (bottom-right)
3. Type: "What products do you offer?"

## What Was Fixed?

### 🐛 Issues Found:
1. ❌ Frontend calling wrong API route (`/api/chat` instead of `/api/chat/chat`)
2. ❌ Backend using non-existent OpenAI model (`openai/gpt-oss-20b`)
3. ❌ No environment variable configuration
4. ❌ Poor error handling

### ✅ Fixes Applied:
1. ✅ Updated ChatWidget.jsx to use correct route `/api/chat/chat`
2. ✅ Changed to use valid models: `llama-3.3-70b-versatile` (Groq) or `gpt-3.5-turbo` (OpenAI)
3. ✅ Created .env.example with all required variables
4. ✅ Added proper error handling and validation
5. ✅ Created diagnostic tool: `npm run check-chatbot`

## Still Not Working?

### 1. Run the diagnostic tool:
```bash
cd Volfram.in-main/Backend
npm run check-chatbot
```

### 2. Check backend logs:
Look for error messages when you try to chat

### 3. Check browser console:
Press F12 → Console tab → Look for errors

### 4. Test API directly:
```bash
curl -X POST http://localhost:5000/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Expected response:
```json
{
  "success": true,
  "response": "Hello! Welcome to Volfram Systems...",
  "reply": "Hello! Welcome to Volfram Systems..."
}
```

## Need More Help?

📖 See detailed instructions: [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)

## API Key Options

### Groq (FREE - Recommended for Development)
- Website: https://console.groq.com/keys
- Cost: FREE
- Model: llama-3.3-70b-versatile
- Speed: Very fast
- Rate Limit: 30 req/min (free tier)

### OpenAI (Paid)
- Website: https://platform.openai.com/api-keys
- Cost: ~$0.002 per 1K tokens
- Model: gpt-3.5-turbo
- Speed: Fast
- Rate Limit: Based on account tier

## File Changes Summary

### Modified Files:
- `Frontend/volform/src/components/chatbot/ChatWidget.jsx` - Fixed API routes
- `Backend/src/routes/chatbot.js` - Updated model selection
- `Backend/src/config/openai.js` - Added validation
- `Backend/package.json` - Added check-chatbot script

### New Files:
- `Backend/.env.example` - Environment template
- `Backend/check-chatbot.js` - Diagnostic tool
- `CHATBOT_SETUP.md` - Detailed setup guide
- `QUICK_START.md` - This file

## Production Checklist

Before deploying:
- [ ] Set strong JWT_SECRET
- [ ] Update FRONTEND_URL to production domain
- [ ] Use production MongoDB URI
- [ ] Verify API key has sufficient rate limits
- [ ] Test chatbot thoroughly
- [ ] Set up Supabase for conversation history (optional)
