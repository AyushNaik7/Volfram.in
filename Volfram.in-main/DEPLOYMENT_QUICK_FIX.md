# ⚡ Quick Fix for Deployment Error

## Your Error:
```
The specified Root Directory "Volfram.in-main/Volfram.in-main/Volfram.in-main/Frontend/volform" does not exist
```

## The Problem:
Your Vercel Root Directory setting has **repeated paths**. It should be simple.

---

## 🔧 Fix in 3 Steps (2 minutes)

### Step 1: Go to Vercel Settings
1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Click **Settings** (top menu)
4. Click **General** (left sidebar)

### Step 2: Update Root Directory
Scroll down to **Root Directory** section:

**Current (WRONG):**
```
Volfram.in-main/Volfram.in-main/Volfram.in-main/Frontend/volform
```

**Change to:**
```
Frontend/volform
```

Click **Save** ✅

### Step 3: Redeploy
1. Click **Deployments** (top menu)
2. Find latest deployment
3. Click three dots (**...**)
4. Click **Redeploy**
5. Wait for build ⏳

---

## ✅ That's It!

Your deployment should now work.

---

## Still Getting Errors?

### If you see "Cannot find module" errors:
Check your `package.json` is in `Frontend/volform/` folder

### If you see "Environment variable" errors:
Go to **Settings** → **Environment Variables** and add:
```
VITE_CHATBOT_API_URL=https://your-backend-url.vercel.app
VITE_BACKEND_API_URL=https://your-backend-url.vercel.app
```

---

## Understanding Root Directory

Your repository structure:
```
your-repo/
└── Volfram.in-main/          ← This is the repo root on GitHub
    └── Frontend/
        └── volform/          ← This is where package.json is
            ├── package.json
            ├── src/
            └── index.html
```

**Vercel Root Directory should be:** `Frontend/volform`

NOT:
- ❌ `Volfram.in-main/Frontend/volform`
- ❌ `Volfram.in-main/Volfram.in-main/...`
- ❌ `/Frontend/volform`

---

## Quick Settings Summary

### Frontend Deployment Settings:
| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `Frontend/volform` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Backend Deployment Settings:
| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Root Directory | `Backend` |
| Build Command | (leave empty) |
| Install Command | `npm install` |

---

## Need More Help?

📖 See full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Test Your Deployment

After successful deployment:

1. **Backend:** Visit `https://your-backend.vercel.app/`
   - Should show: "Backend is running 🚀"

2. **Frontend:** Visit `https://your-frontend.vercel.app/`
   - Should load your website
   - Click 💬 chatbot button
   - Test sending a message

---

**Pro Tip:** Create two separate projects on Vercel:
1. One for Backend (Root: `Backend`)
2. One for Frontend (Root: `Frontend/volform`)

This makes management easier and provides separate URLs for each service.
