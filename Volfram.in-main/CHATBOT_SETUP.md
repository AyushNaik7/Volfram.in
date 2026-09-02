# Chatbot Setup Guide

## Issues Fixed

1. **API Route Mismatch**: Frontend was calling `/api/chat` but backend expects `/api/chat/chat`
   - ✅ Fixed: Updated all frontend API calls to use `/api/chat/chat`

2. **Invalid OpenAI Model**: Backend was using `openai/gpt-oss-20b` which doesn't exist
   - ✅ Fixed: Now uses `gpt-3.5-turbo` for OpenAI or `llama-3.3-70b-versatile` for Groq

3. **Missing Environment Variables**: No proper environment configuration
   - ✅ Fixed: Created `.env.example` with all required variables

4. **Poor Error Handling**: No validation for missing API keys
   - ✅ Fixed: Added proper error messages and configuration checks

## Setup Instructions

### Backend Setup

1. **Navigate to the Backend folder**:
   ```bash
   cd Volfram.in-main/Backend
   ```

2. **Create `.env` file** from the example:
   ```bash
   cp .env.example .env
   ```

3. **Configure your API key** (Choose ONE option):

   **Option A: Using Groq (FREE and FAST - Recommended)**
   - Visit: https://console.groq.com/keys
   - Create a free account
   - Generate an API key (starts with `gsk_`)
   - Add to `.env`:
     ```
     OPENAI_API_KEY=gsk_your_groq_api_key_here
     ```

   **Option B: Using OpenAI (Paid)**
   - Visit: https://platform.openai.com/api-keys
   - Generate an API key (starts with `sk-`)
   - Add to `.env`:
     ```
     OPENAI_API_KEY=sk-your_openai_api_key_here
     ```

4. **Configure other required variables** in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/volfram
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:5173
   ```

5. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

6. **Start the backend server**:
   ```bash
   npm run dev
   ```
   The server should start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the Frontend folder**:
   ```bash
   cd Volfram.in-main/Frontend/volform
   ```

2. **Create `.env` file** if it doesn't exist:
   ```bash
   cp .env.example .env
   ```

3. **Configure the backend URL** in `.env`:
   ```env
   VITE_CHATBOT_API_URL=http://localhost:5000
   VITE_BACKEND_API_URL=http://localhost:5000
   ```

4. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

### Testing the Chatbot

1. Open your browser and go to `http://localhost:5173`
2. Look for the chat widget button (💬) in the bottom-right corner
3. Click it to open the chat interface
4. Try these test messages:
   - "What products do you offer?"
   - "Tell me about PRDS systems"
   - "I need a quotation for a boiler"

## Troubleshooting

### Chatbot button appears but doesn't respond

**Check backend console for errors:**
```bash
cd Volfram.in-main/Backend
npm run dev
```

Look for:
- ✅ "Server running on port 5000"
- ✅ "Connected to MongoDB"
- ⚠️  "OPENAI_API_KEY is not set" - Add your API key to `.env`

### Error: "Chatbot service is not configured"

This means `OPENAI_API_KEY` is missing in `.env`. Add it following the steps above.

### Error: "Something went wrong"

1. **Check backend logs** - The actual error will be logged there
2. **Verify API key** - Make sure it's valid and not expired
3. **Check network** - Open browser DevTools (F12) → Network tab
4. **Test API directly**:
   ```bash
   curl -X POST http://localhost:5000/api/chat/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

### Frontend can't connect to backend

1. Check if backend is running on port 5000
2. Verify CORS settings in `Backend/src/index.js`
3. Make sure `VITE_CHATBOT_API_URL` in frontend `.env` points to correct backend URL

## Model Information

### Groq (Free - Recommended for Development)
- Model: `llama-3.3-70b-versatile`
- Speed: Very fast
- Cost: Free
- Rate Limits: 30 requests/minute (free tier)

### OpenAI (Paid)
- Model: `gpt-3.5-turbo`
- Speed: Fast
- Cost: ~$0.002 per 1K tokens
- Rate Limits: Based on your account tier

## Optional: Supabase Configuration

For conversation history storage (optional):

1. Create a Supabase account: https://supabase.com
2. Create a new project
3. Add to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   ```
4. Run the schema from `Backend/supabase-schema.sql`

Without Supabase, the chatbot works in "simplified mode" - it still responds to messages but doesn't save conversation history.

## Production Deployment

Before deploying to production:

1. ✅ Set strong `JWT_SECRET`
2. ✅ Update `FRONTEND_URL` to your production domain
3. ✅ Use production MongoDB URI
4. ✅ Ensure API keys are in production environment variables
5. ✅ Never commit `.env` files to git (already in `.gitignore`)

## Support

If you continue to have issues:
1. Check the browser console (F12) for frontend errors
2. Check the backend terminal for server errors
3. Verify all environment variables are set correctly
4. Test the API endpoint directly with curl/Postman
