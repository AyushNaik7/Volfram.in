# 🔐 Environment Variables Guide

## Backend Environment Variables

### Required Variables

Copy these to your Backend deployment (Vercel → Settings → Environment Variables):

```env
# API Configuration
OPENAI_API_KEY=gsk_your_groq_api_key_here

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/volfram?retryWrites=true&w=majority

# Security
JWT_SECRET=your-super-secret-minimum-32-characters-long-random-string

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Server
NODE_ENV=production
PORT=5000
```

### Optional Variables

```env
# Supabase (for conversation history)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Email (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

---

## Frontend Environment Variables

Copy these to your Frontend deployment (Vercel → Settings → Environment Variables):

```env
# Backend API URLs
VITE_CHATBOT_API_URL=https://your-backend-domain.vercel.app
VITE_BACKEND_API_URL=https://your-backend-domain.vercel.app
```

⚠️ **Important:** Frontend environment variables MUST start with `VITE_`

---

## How to Get Each Variable

### 1. OPENAI_API_KEY (Required)

**Option A: Groq (FREE - Recommended)**
1. Go to: https://console.groq.com/keys
2. Sign up (free)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

**Option B: OpenAI (Paid)**
1. Go to: https://platform.openai.com/api-keys
2. Sign in (requires credit card)
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. MONGODB_URI (Required)

**Using MongoDB Atlas (Free):**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `volfram`

**Example:**
```
mongodb+srv://myuser:mypassword123@cluster0.xxxxx.mongodb.net/volfram?retryWrites=true&w=majority
```

**Important:** In MongoDB Atlas:
- Go to **Network Access**
- Click **Add IP Address**
- Click **Allow Access from Anywhere** (0.0.0.0/0)
- This allows Vercel to connect

### 3. JWT_SECRET (Required)

Generate a secure random string (minimum 32 characters):

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
Visit: https://www.grc.com/passwords.htm (use "63 random alpha-numeric characters")

**Example:**
```
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c3a8f5f167f44f4964e6c998dee827110c
```

### 4. FRONTEND_URL (Required)

This is your frontend deployment URL.

**After deploying frontend:**
1. Copy the URL from Vercel (e.g., `https://volfram-frontend.vercel.app`)
2. Add to backend environment variables
3. Redeploy backend

**Example:**
```
FRONTEND_URL=https://volfram-frontend.vercel.app
```

### 5. SUPABASE_URL & SUPABASE_KEY (Optional)

**Only needed if you want conversation history.**

1. Go to: https://supabase.com
2. Create account
3. Create new project
4. Go to **Settings** → **API**
5. Copy:
   - Project URL → `SUPABASE_URL`
   - Project API key (anon public) → `SUPABASE_KEY`

**Example:**
```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. EMAIL_USER & EMAIL_PASS (Optional)

**For Gmail:**
1. Enable 2-factor authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create app password for "Mail"
4. Use this 16-character password (not your regular password)

**Example:**
```
EMAIL_USER=yourcompany@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

---

## Setting Environment Variables on Vercel

### Method 1: Dashboard (Recommended)

1. Go to your project on Vercel
2. Click **Settings**
3. Click **Environment Variables** (left sidebar)
4. For each variable:
   - Enter **Name** (e.g., `OPENAI_API_KEY`)
   - Enter **Value** (e.g., `gsk_abc123...`)
   - Select **Production** (and optionally Preview/Development)
   - Click **Save**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Add environment variable
vercel env add OPENAI_API_KEY production
# Then paste your API key when prompted
```

### Method 3: Import from .env

1. Create `.env.production` file locally
2. Add all variables
3. In Vercel dashboard → Environment Variables
4. Click **Add** → **Plaintext**
5. Paste entire file content
6. Click **Save**

---

## Environment Variable Checklist

### Before Deploying Backend:
- [ ] OPENAI_API_KEY is set (Groq or OpenAI)
- [ ] MONGODB_URI points to accessible database
- [ ] JWT_SECRET is strong and random (32+ chars)
- [ ] NODE_ENV is set to "production"

### Before Deploying Frontend:
- [ ] VITE_CHATBOT_API_URL points to backend URL
- [ ] VITE_BACKEND_API_URL points to backend URL
- [ ] Variables start with `VITE_` prefix

### After Deploying Both:
- [ ] Backend FRONTEND_URL updated to actual frontend URL
- [ ] Backend redeployed after URL update
- [ ] Test chatbot functionality

---

## Common Mistakes

### ❌ Wrong: Frontend variables without VITE_ prefix
```env
CHATBOT_API_URL=https://...  # Won't work!
```

### ✅ Correct: With VITE_ prefix
```env
VITE_CHATBOT_API_URL=https://...  # Works!
```

### ❌ Wrong: Hardcoded URLs in code
```javascript
const API_URL = "http://localhost:5000"  // Don't do this!
```

### ✅ Correct: Using environment variables
```javascript
const API_URL = import.meta.env.VITE_CHATBOT_API_URL
```

### ❌ Wrong: Committing .env files
```
git add .env  # Never do this!
```

### ✅ Correct: Using .env.example
```bash
# In repository
.env.example  # Template only, no real values

# Keep .env in .gitignore
.env
.env.local
.env.production
```

---

## Security Best Practices

1. **Never commit real API keys** to Git
   - Use `.env.example` with dummy values
   - Add `.env*` to `.gitignore`

2. **Use strong JWT secrets**
   - Minimum 32 characters
   - Random alphanumeric
   - Different for dev/prod

3. **Rotate keys periodically**
   - Change JWT_SECRET every few months
   - Regenerate API keys if compromised

4. **Limit API key permissions**
   - MongoDB: Create user with limited permissions
   - Supabase: Use anon key, not service key

5. **Monitor usage**
   - Check OpenAI/Groq usage regularly
   - Set up MongoDB alerts
   - Monitor Vercel logs

---

## Testing Environment Variables

### Test Backend Variables:
```bash
# SSH into Vercel deployment or check logs
# Backend should log on startup:
# ✅ "Using model: llama-3.3-70b-versatile (Groq: true)"
# ✅ "Connected to MongoDB"
# ✅ "Server running on port 5000"
```

### Test Frontend Variables:
Open browser console (F12) and type:
```javascript
console.log(import.meta.env.VITE_CHATBOT_API_URL)
// Should show: "https://your-backend.vercel.app"
```

---

## Troubleshooting

### Problem: "OPENAI_API_KEY is not set"
**Solution:** Add the variable in Vercel → Settings → Environment Variables, then redeploy

### Problem: "Cannot connect to MongoDB"
**Solutions:**
- Check connection string is correct
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check database user exists and password is correct

### Problem: "CORS error" in browser
**Solutions:**
- Update FRONTEND_URL in backend to actual frontend URL
- Redeploy backend after updating
- Check frontend URL doesn't have trailing slash

### Problem: Changes not reflecting
**Solution:** After adding/changing environment variables, you must **redeploy**. Changes don't take effect automatically.

### Problem: Variables undefined in code
**Frontend:** Make sure variable starts with `VITE_`
**Backend:** Make sure `require('dotenv').config()` is called

---

## Quick Copy-Paste Templates

### For Backend (.env):
```env
# Required
OPENAI_API_KEY=
MONGODB_URI=
JWT_SECRET=
FRONTEND_URL=
NODE_ENV=production
PORT=5000

# Optional
SUPABASE_URL=
SUPABASE_KEY=
EMAIL_USER=
EMAIL_PASS=
```

### For Frontend (.env):
```env
VITE_CHATBOT_API_URL=
VITE_BACKEND_API_URL=
```

---

## Need Help?

- 🚀 Quick deployment fix: [DEPLOYMENT_QUICK_FIX.md](./DEPLOYMENT_QUICK_FIX.md)
- 📚 Full deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🤖 Chatbot setup: [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)
- ⚡ Quick start: [QUICK_START.md](./QUICK_START.md)

---

**Remember:** After adding or changing environment variables on Vercel, you must **redeploy** for changes to take effect!
