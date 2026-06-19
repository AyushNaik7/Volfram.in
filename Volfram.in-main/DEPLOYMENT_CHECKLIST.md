# 🚀 Volfram Chatbot Production Deployment Checklist

## ✅ Issues Fixed

### 1. Hardcoded localhost URLs (13 instances)
All hardcoded `localhost:7000` and `localhost:8000` URLs have been replaced with environment variable references:

**Files Updated:**
- ✅ `Frontend/volform/src/components/chatbot/ChatWidget.jsx` - Uses `VITE_CHATBOT_API_URL`
- ✅ `Frontend/volform/src/components/chatbot/Chatbot.jsx` - Uses `VITE_CHATBOT_API_URL`
- ✅ `Frontend/volform/src/services/api.js` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/pages/Clients.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/pages/Events.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/pages/Gallery.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/pages/Register.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/pages/ContactUs.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/components/admin/PageForm.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/components/admin/PagesList.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Frontend/volform/src/components/admin/ImageManager.jsx` - Uses `VITE_BACKEND_API_URL`
- ✅ `Backend/src/utils/sendMail.js` - Uses `BACKEND_URL`

### 2. CORS Configuration
Updated all backends to use proper CORS configuration with production origins:

**Files Updated:**
- ✅ `volfram-bot/backend/server.js` - CORS configured with `FRONTEND_URL`
- ✅ `Backend/src/app.js` - CORS configured with `FRONTEND_URL`
- ✅ `Backend/src/index.js` - CORS configured with `FRONTEND_URL`

### 3. Environment Variables
Updated all environment files with production URLs:

**Files Updated:**
- ✅ `Frontend/volform/.env` - Production API endpoints
- ✅ `volfram-bot/backend/.env` - Added `FRONTEND_URL`
- ✅ `Backend/.env` - Added `FRONTEND_URL` and `BACKEND_URL`

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION SETUP                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Vercel)                                          │
│  └─ https://volfram.in                                      │
│     ├─ VITE_CHATBOT_API_URL=https://volfram-bot-backend... │
│     └─ VITE_BACKEND_API_URL=https://volfram-in.onrender... │
│                                                              │
│  Chatbot Backend (Render)                                   │
│  └─ https://volfram-bot-backend.onrender.com               │
│     ├─ PORT=8000                                            │
│     ├─ FRONTEND_URL=https://volfram.in                     │
│     ├─ SUPABASE_URL=...                                     │
│     ├─ SUPABASE_ANON_KEY=...                               │
│     └─ OPENROUTER_API_KEY=...                              │
│                                                              │
│  Main Backend (Render)                                      │
│  └─ https://volfram-in.onrender.com                        │
│     ├─ PORT=7000                                            │
│     ├─ FRONTEND_URL=https://volfram.in                     │
│     ├─ BACKEND_URL=https://volfram-in.onrender.com         │
│     ├─ MONGO_URI=...                                        │
│     └─ Other env vars                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Vercel (Frontend) Configuration

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these environment variables:**
   ```
   VITE_CHATBOT_API_URL=https://volfram-bot-backend.onrender.com
   VITE_BACKEND_API_URL=https://volfram-in.onrender.com
   ```

3. **Redeploy the frontend** (important!)
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"
   - This ensures new environment variables are picked up

### Step 2: Render - Chatbot Backend Configuration

1. **Go to Render Dashboard** → chatbot backend service → Environment

2. **Verify/Add these environment variables:**
   ```
   PORT=8000
   FRONTEND_URL=https://volfram.in
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   OPENROUTER_API_KEY=<your-openrouter-api-key>
   ```

3. **Manual Deploy** (if needed)
   - Click "Manual Deploy" → "Deploy latest commit"

### Step 3: Render - Main Backend Configuration

1. **Go to Render Dashboard** → main backend service → Environment

2. **Verify/Add these environment variables:**
   ```
   PORT=7000
   FRONTEND_URL=https://volfram.in
   BACKEND_URL=https://volfram-in.onrender.com
   MONGO_URI=<your-mongodb-uri>
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   OPENAI_API_KEY=<your-openrouter-api-key>
   JWT_SECRET=<your-jwt-secret>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-email-app-password>
   ```

3. **Manual Deploy** (if needed)
   - Click "Manual Deploy" → "Deploy latest commit"

---

## 🧪 Testing the Deployment

### Test Chatbot Functionality

1. **Open production site:** https://volfram.in
2. **Open browser DevTools** → Network tab
3. **Click the chatbot widget** (bottom right)
4. **Send a test message:** "What products do you offer?"

**Expected behavior:**
- ✅ Request goes to `https://volfram-bot-backend.onrender.com/api/chat`
- ✅ No CORS errors in console
- ✅ Bot responds with Volfram product information

**If it fails, check:**
- ❌ `ERR_CONNECTION_REFUSED` → Backend not running on Render
- ❌ `CORS error` → FRONTEND_URL not set correctly in backend
- ❌ `404 Not Found` → Wrong endpoint URL in frontend env vars

### Test Main Backend Features

1. **Contact form:** Fill out and submit
   - Should POST to `https://volfram-in.onrender.com/api/enquiry`

2. **Gallery/Events pages:** Check images load
   - Should fetch from `https://volfram-in.onrender.com/api/public-images/...`

3. **Admin features:** Login and test dashboard
   - Should authenticate via `https://volfram-in.onrender.com/api/auth/...`

---

## 🔍 Debugging Common Issues

### Issue: Chatbot shows "Something went wrong"

**Possible causes:**
1. Backend not deployed/running
   - Check Render logs: Dashboard → Service → Logs
   
2. Wrong API URL in Vercel
   - Check: Vercel → Environment Variables
   - Should be: `https://volfram-bot-backend.onrender.com`
   
3. CORS blocking request
   - Check browser console for CORS errors
   - Verify `FRONTEND_URL=https://volfram.in` in chatbot backend

### Issue: CORS error in browser console

**Error message:** `Access to fetch at '...' has been blocked by CORS policy`

**Fix:**
1. Go to Render backend environment variables
2. Ensure `FRONTEND_URL=https://volfram.in` (no trailing slash!)
3. Redeploy the backend service

### Issue: Vercel deployment doesn't pick up new env vars

**Fix:**
1. After adding/changing env vars in Vercel
2. Go to Deployments tab
3. Select latest deployment → Redeploy
4. Environment variables only apply to NEW builds

### Issue: Email verification links point to localhost

**Fix:**
- Already fixed! `sendMail.js` now uses `BACKEND_URL` env var
- Ensure `BACKEND_URL=https://volfram-in.onrender.com` is set in Render

---

## ✨ What Changed?

### Before (Broken in Production):
```javascript
// ❌ WRONG - Hardcoded localhost
const response = await fetch('http://localhost:8000/api/chat', {...});
```

### After (Works in Production):
```javascript
// ✅ CORRECT - Uses environment variable
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8000';
const response = await fetch(`${CHATBOT_API_URL}/api/chat`, {...});
```

---

## 📝 Quick Reference

### Environment Variable Naming Convention

| Platform | Variable | Value |
|----------|----------|-------|
| Vercel (Frontend) | `VITE_CHATBOT_API_URL` | `https://volfram-bot-backend.onrender.com` |
| Vercel (Frontend) | `VITE_BACKEND_API_URL` | `https://volfram-in.onrender.com` |
| Render (Chatbot) | `FRONTEND_URL` | `https://volfram.in` |
| Render (Main Backend) | `FRONTEND_URL` | `https://volfram.in` |
| Render (Main Backend) | `BACKEND_URL` | `https://volfram-in.onrender.com` |

### Important Notes

⚠️ **Vite Environment Variables:**
- Must start with `VITE_` to be accessible in browser
- Requires rebuild to take effect
- Available via `import.meta.env.VITE_*`

⚠️ **Vercel Deployment:**
- Changing env vars requires redeployment
- Use "Redeploy" button after env var changes

⚠️ **Render Services:**
- Auto-redeploys on git push
- Manual redeploy after env var changes
- Check logs for startup errors

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend loads at https://volfram.in
- [ ] Chatbot widget appears (bottom right)
- [ ] Chatbot responds to messages (no CORS errors)
- [ ] Contact form submits successfully
- [ ] Gallery/Events images load from backend
- [ ] Admin login works
- [ ] No console errors related to localhost
- [ ] Email verification links point to production URL

---

## 🆘 Need Help?

If issues persist after following this guide:

1. **Check Render Logs:**
   - Render Dashboard → Service → Logs
   - Look for startup errors or crash messages

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for CORS, network, or 404 errors

3. **Verify Environment Variables:**
   - Vercel: Dashboard → Settings → Environment Variables
   - Render: Dashboard → Service → Environment

4. **Test Endpoints Directly:**
   ```bash
   # Test chatbot backend
   curl https://volfram-bot-backend.onrender.com/health
   
   # Test main backend
   curl https://volfram-in.onrender.com/
   ```

---

**Last Updated:** June 20, 2026
**Status:** ✅ Ready for Production Deployment
