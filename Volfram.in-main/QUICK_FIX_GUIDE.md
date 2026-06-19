# ⚡ Quick Fix Guide - Deploy Now!

## 🎯 What Was Fixed
✅ **13 hardcoded localhost URLs** → Now use environment variables  
✅ **CORS blocking** → Properly configured for production  
✅ **Wrong API endpoints** → Updated to production URLs  

---

## 🚀 Deploy in 3 Steps (5 minutes)

### Step 1: Push Code Changes
```bash
cd Volfram.in-main
git add .
git commit -m "Fix: Replace localhost URLs with environment variables for production"
git push origin main
```

### Step 2: Configure Vercel (Frontend)

1. Go to: https://vercel.com/dashboard
2. Select your project → **Settings** → **Environment Variables**
3. **Add/Update these two variables:**

```
VITE_CHATBOT_API_URL=https://volfram-bot-backend.onrender.com
VITE_BACKEND_API_URL=https://volfram-in.onrender.com
```

4. Click **Deployments** tab → Latest deployment → **"..."** → **Redeploy**

### Step 3: Configure Render (Backends)

#### Chatbot Backend:
1. Go to: https://render.com/dashboard
2. Select **chatbot backend service** → **Environment**
3. **Add this variable:**
```
FRONTEND_URL=https://volfram.in
```
4. Click **Manual Deploy** → Deploy latest commit

#### Main Backend:
1. Select **main backend service** → **Environment**
2. **Add these two variables:**
```
FRONTEND_URL=https://volfram.in
BACKEND_URL=https://volfram-in.onrender.com
```
3. Click **Manual Deploy** → Deploy latest commit

---

## ✅ Test It!

1. Open: https://volfram.in
2. Open browser DevTools (F12) → **Console** tab
3. Click the **chatbot** (bottom right)
4. Type: "What products do you offer?"

**Expected:** Bot responds with product information, NO errors in console ✅

---

## 🆘 If Still Broken

### Check 1: Vercel Environment Variables
- Must start with `VITE_`
- Must click "Redeploy" after adding them

### Check 2: Render Services Running
- Both backends should show "Live" status
- Check Logs tab for errors

### Check 3: Browser Console
- F12 → Console
- Look for CORS or network errors
- Screenshot and check against DEPLOYMENT_CHECKLIST.md

---

## 📋 Environment Variables Quick Reference

| Platform | Variable | Value |
|----------|----------|-------|
| **Vercel** | `VITE_CHATBOT_API_URL` | `https://volfram-bot-backend.onrender.com` |
| **Vercel** | `VITE_BACKEND_API_URL` | `https://volfram-in.onrender.com` |
| **Render (Chatbot)** | `FRONTEND_URL` | `https://volfram.in` |
| **Render (Main)** | `FRONTEND_URL` | `https://volfram.in` |
| **Render (Main)** | `BACKEND_URL` | `https://volfram-in.onrender.com` |

---

## ⚠️ Common Mistakes

❌ **Forgot to redeploy after adding env vars** → Click Redeploy!  
❌ **Typo in environment variable names** → Copy-paste exact names  
❌ **Added trailing slash in URLs** → No slash at the end!  
❌ **Set env vars but didn't deploy** → Must trigger new build  

---

**Time to fix:** ~5 minutes  
**Downtime:** None (deployments are seamless)  
**Risk level:** Low (changes are non-breaking)

**See also:**
- `DEPLOYMENT_CHECKLIST.md` - Detailed deployment guide
- `CHANGES_SUMMARY.md` - All code changes explained
