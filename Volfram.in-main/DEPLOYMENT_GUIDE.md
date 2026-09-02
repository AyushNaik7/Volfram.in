# 🚀 Deployment Guide

## Issue: Incorrect Root Directory

### Error You're Getting:
```
The specified Root Directory "Volfram.in-main/Volfram.in-main/Volfram.in-main/Frontend/volform" does not exist
```

### Fix: Update Root Directory Path

The path has repeated `Volfram.in-main` folders. Here's how to fix it:

## Quick Fix on Vercel

### Step 1: Fix Root Directory

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** (top menu)
4. Click **General** (left sidebar)
5. Scroll to **Root Directory**
6. **Change to:** `Frontend/volform`
7. Click **Save**

### Step 2: Set Environment Variables

Still in Settings, go to **Environment Variables**:

**Required Variables:**
```
VITE_CHATBOT_API_URL=https://your-backend-url.vercel.app
VITE_BACKEND_API_URL=https://your-backend-url.vercel.app
```

Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (**...**) on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete ✅

---

## Complete Deployment Setup

If you're deploying both Frontend and Backend to Vercel:

### A. Deploy Backend First

1. **Create New Project on Vercel:**
   - Click **Add New** → **Project**
   - Import your repository
   - Name it: `volfram-backend`

2. **Configure Backend:**
   - **Framework Preset:** Other
   - **Root Directory:** `Backend`
   - **Build Command:** Leave empty (Node.js doesn't need build)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   OPENAI_API_KEY=gsk_your_groq_api_key_here
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

   Optional (for Supabase):
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   ```

4. **Deploy Backend**
   - Click **Deploy**
   - Copy the deployment URL (e.g., `https://volfram-backend.vercel.app`)

### B. Deploy Frontend

1. **Create New Project on Vercel:**
   - Click **Add New** → **Project**
   - Import your repository (or use same repo)
   - Name it: `volfram-frontend`

2. **Configure Frontend:**
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend/volform`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   ```
   VITE_CHATBOT_API_URL=https://volfram-backend.vercel.app
   VITE_BACKEND_API_URL=https://volfram-backend.vercel.app
   ```

4. **Deploy Frontend**
   - Click **Deploy**
   - Wait for build to complete

### C. Update Backend CORS

After frontend deployment, update backend's `FRONTEND_URL`:

1. Go to backend project on Vercel
2. **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` to your frontend URL
4. Redeploy backend

---

## Deployment Checklist

### Before Deploying:

- [ ] Backend `.env` has all required variables
- [ ] Frontend `.env` points to correct backend URL
- [ ] MongoDB database is accessible from internet
- [ ] API keys are valid (Groq/OpenAI)
- [ ] CORS is configured correctly

### Backend Deployment:

- [ ] Root Directory: `Backend`
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] API responding (test: `https://your-backend.vercel.app/`)

### Frontend Deployment:

- [ ] Root Directory: `Frontend/volform`
- [ ] VITE_CHATBOT_API_URL points to backend
- [ ] VITE_BACKEND_API_URL points to backend
- [ ] Deployment successful
- [ ] Website loads correctly

### After Deployment:

- [ ] Test chatbot functionality
- [ ] Check browser console for errors
- [ ] Verify API calls are reaching backend
- [ ] Test on mobile devices

---

## Common Deployment Issues

### Issue 1: "Module not found" errors

**Solution:** Check that all dependencies are in `package.json`, not just dev dependencies.

```bash
# Reinstall dependencies
npm install --save package-name
```

### Issue 2: Environment variables not working

**Solution:** 
- Frontend variables MUST start with `VITE_`
- After adding variables, redeploy (don't just rebuild)
- Variables are injected at build time, not runtime

### Issue 3: CORS errors in production

**Solution:** Update backend environment variables:
```
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

Then redeploy backend.

### Issue 4: Chatbot not responding

**Checklist:**
1. Backend deployed and accessible?
2. `OPENAI_API_KEY` set in backend?
3. Frontend has correct `VITE_CHATBOT_API_URL`?
4. Check backend logs on Vercel

### Issue 5: Build fails with "command not found"

**Solution:** Check `package.json` has correct scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

### Issue 6: MongoDB connection fails

**Solutions:**
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check connection string format
- Verify database user has correct permissions

---

## Testing Your Deployment

### Test Backend:
```bash
# Health check
curl https://your-backend.vercel.app/

# Test chatbot endpoint
curl -X POST https://your-backend.vercel.app/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Expected response:
```json
{
  "success": true,
  "response": "Hello! Welcome to Volfram...",
  "reply": "Hello! Welcome to Volfram..."
}
```

### Test Frontend:
1. Open `https://your-frontend.vercel.app`
2. Click chatbot button (💬)
3. Send a message
4. Check browser console (F12) for errors

---

## Alternative: Deploy to Render.com

If Vercel doesn't work well:

### Backend on Render:
1. Create **Web Service**
2. Connect repository
3. **Root Directory:** `Backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables

### Frontend on Render:
1. Create **Static Site**
2. Connect repository
3. **Root Directory:** `Frontend/volform`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `dist`
6. Add environment variables

---

## Project Structure for Deployment

Your repository structure:
```
Volfram.in-main/
├── Backend/              ← Backend root directory
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
├── Frontend/
│   └── volform/         ← Frontend root directory
│       ├── src/
│       ├── package.json
│       ├── vercel.json
│       └── .env.example
│
├── vercel.json          ← Optional: monorepo config
└── DEPLOYMENT_GUIDE.md  ← This file
```

---

## MongoDB Atlas Setup

If you don't have MongoDB set up:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user
4. **Network Access:** Add IP `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Add to backend environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/volfram?retryWrites=true&w=majority
   ```

---

## Security Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable MongoDB authentication
- [ ] Restrict MongoDB network access if possible
- [ ] Use HTTPS only (Vercel does this automatically)
- [ ] Set rate limiting for API endpoints
- [ ] Validate all user inputs
- [ ] Keep dependencies updated

---

## Vercel CLI Deployment (Alternative)

Install Vercel CLI:
```bash
npm i -g vercel
```

Deploy backend:
```bash
cd Volfram.in-main/Backend
vercel --prod
```

Deploy frontend:
```bash
cd Volfram.in-main/Frontend/volform
vercel --prod
```

---

## Getting Help

If deployment still fails:

1. **Check Vercel Logs:**
   - Deployment → View Function Logs
   - Look for specific errors

2. **Check Browser Console:**
   - F12 → Console tab
   - Network tab for failed requests

3. **Test Locally First:**
   - Make sure everything works on `localhost`
   - Then deploy

4. **Common Error Messages:**
   - "Module not found" → Missing dependency
   - "CORS error" → Backend FRONTEND_URL wrong
   - "500 error" → Check backend logs
   - "404 error" → Check API endpoint URLs

---

## Success Indicators

Your deployment is successful when:

✅ Backend URL loads and shows: "Backend is running 🚀"
✅ Frontend URL loads the website
✅ Chatbot button (💬) appears
✅ Chatbot responds to messages
✅ No errors in browser console
✅ API calls succeed (check Network tab)

---

## Next Steps After Deployment

1. **Custom Domain** - Add your own domain in Vercel
2. **Analytics** - Set up Vercel Analytics
3. **Monitoring** - Monitor API usage and errors
4. **Backups** - Set up MongoDB backups
5. **CI/CD** - Automatic deployments on git push (Vercel does this)

---

## Support Resources

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 🎥 [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- 💬 [Vercel Discord](https://vercel.com/discord)
- 📚 [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

**Remember:** The most common issue is incorrect Root Directory. Always set it to:
- **Backend:** `Backend`
- **Frontend:** `Frontend/volform`

NOT: `Volfram.in-main/Backend` or `Volfram.in-main/Volfram.in-main/...`
