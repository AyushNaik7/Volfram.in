# 🔧 Chatbot Not Working on Vercel - Fix

## Your Issue

Chatbot shows loading dots (...) but never responds.

## Root Cause

The frontend is deployed but doesn't know where your backend is (or backend isn't deployed yet).

---

## Solution: Set Environment Variables on Vercel

### Step 1: Check if Backend is Deployed

Do you have a backend deployed? If not, deploy it first!

#### Deploy Backend:

1. **Go to Vercel Dashboard** → Click **Add New** → **Project**
2. **Import your repository** (same repo, different project)
3. **Configure:**
   - Project Name: `volfram-backend`
   - Root Directory: `Backend`
   - Framework: Other
   - Build Command: (leave empty)
   - Install Command: `npm install`

4. **Add Environment Variables** (Settings → Environment Variables):
   ```
   OPENAI_API_KEY=gsk_your_groq_key_here
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_32_char_secret
   NODE_ENV=production
   ```

5. **Deploy** and copy the URL (e.g., `https://volfram-backend.vercel.app`)

---

### Step 2: Add Environment Variables to Frontend

1. **Go to your Frontend project on Vercel**
2. **Settings** → **Environment Variables**
3. **Add these variables:**

```
Name: VITE_CHATBOT_API_URL
Value: https://your-backend-url.vercel.app
Environment: Production, Preview, Development
```

```
Name: VITE_BACKEND_API_URL
Value: https://your-backend-url.vercel.app
Environment: Production, Preview, Development
```

4. **Click Save**

---

### Step 3: Redeploy Frontend

1. **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for build to complete

---

### Step 4: Update Backend CORS

1. **Go to Backend project** on Vercel
2. **Settings** → **Environment Variables**
3. **Add:**
   ```
   Name: FRONTEND_URL
   Value: https://volfram-ashen.vercel.app
   Environment: Production
   ```
4. **Redeploy backend**

---

## Quick Test

After redeployment:

1. Open: https://volfram-ashen.vercel.app
2. Open browser console (F12) → Network tab
3. Click chatbot and send message
4. Check if API call succeeds

---

## If Still Not Working

### Check 1: Backend is Running

Visit: `https://your-backend-url.vercel.app/`

Should show: **"Backend is running 🚀"**

If not, backend deployment failed. Check Vercel logs.

### Check 2: Environment Variables Set

**Frontend:**
- In browser console, type: `console.log(import.meta.env.VITE_CHATBOT_API_URL)`
- Should show your backend URL, not `undefined`

**Backend:**
- Check Vercel logs for: "OPENAI_API_KEY is not set" warnings

### Check 3: Network Requests

In browser (F12 → Network tab):
- Look for request to `/api/chat/chat`
- If it's going to `http://localhost:8000` → Environment variable not set
- If it's 404 → Wrong endpoint
- If it's CORS error → Backend FRONTEND_URL not set

---

## Common Issues

### Issue: Request goes to localhost:8000
**Cause:** Environment variable not set in Vercel
**Fix:** Add `VITE_CHATBOT_API_URL` and redeploy

### Issue: CORS error
**Cause:** Backend doesn't allow your frontend domain
**Fix:** Add `FRONTEND_URL` to backend and redeploy backend

### Issue: 404 Not Found
**Cause:** Backend not deployed or wrong URL
**Fix:** Deploy backend first, then update frontend env vars

### Issue: 503 Service Unavailable
**Cause:** Backend crashed, likely due to missing OPENAI_API_KEY or MONGODB_URI
**Fix:** Check backend logs on Vercel, add missing environment variables

---

## Environment Variables Checklist

### Frontend Project on Vercel:
- [ ] `VITE_CHATBOT_API_URL` = backend URL
- [ ] `VITE_BACKEND_API_URL` = backend URL
- [ ] Variables added to Production environment
- [ ] Frontend redeployed after adding variables

### Backend Project on Vercel:
- [ ] `OPENAI_API_KEY` = your Groq/OpenAI key
- [ ] `MONGODB_URI` = MongoDB connection string
- [ ] `JWT_SECRET` = random 32+ character string
- [ ] `FRONTEND_URL` = frontend URL
- [ ] `NODE_ENV` = production
- [ ] Backend redeployed after adding variables

---

## Quick Command to Test Backend

```bash
# Replace with your actual backend URL
curl https://your-backend-url.vercel.app/api/chat/chat \
  -X POST \
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

---

## Video Guide

If you prefer visual instructions:
1. [How to Set Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
2. [Deploying Node.js to Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)

---

## Need More Help?

1. Share your backend Vercel URL
2. Share any error messages from Vercel logs (Deployments → View Function Logs)
3. Share browser console errors (F12 → Console tab)

This will help diagnose the exact issue!
