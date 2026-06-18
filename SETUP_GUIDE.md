# Quick Setup Guide - Volfram Quotation Chatbot

## Prerequisites

- Node.js installed
- Supabase account
- OpenAI API account

## Step-by-Step Setup

### Step 1: Supabase Database Setup

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `volfram-quotation`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

5. Once created, go to **SQL Editor** (left sidebar)
6. Click "New Query"
7. Copy the entire content from `Backend/supabase-schema.sql`
8. Paste and click "Run"
9. You should see "Success. No rows returned"

10. Go to **Settings** > **API** (left sidebar)
11. Copy these values:
    - Project URL
    - anon/public key

### Step 2: OpenAI API Setup

1. Go to https://platform.openai.com
2. Sign up or login
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Name it "Volfram Chatbot"
6. Copy the key (you won't see it again!)
7. Add credits: Go to **Billing** > Add payment method > Add $10-20 credits

### Step 3: Configure Backend

1. Open `Backend/.env` file
2. Replace the placeholder values:

```env
PORT=8000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_long_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key_here
```

3. Save the file

### Step 4: Seed Database with Excel Data

```bash
cd Backend
node src/utils/seedData.js
```

You should see:
```
Starting database seeding...
Seeding steam tables...
✓ Steam tables seeded
Seeding material specifications...
✓ Material specs seeded
Seeding products...
✓ Products seeded
Seeding calculator templates...
✓ Calculator templates seeded

✅ Database seeding completed!
```

### Step 5: Verify Everything is Running

Both servers should already be running from earlier. Check:

1. **Backend**: http://localhost:8000
   - Should show "Volfram Quotation API"

2. **Frontend**: http://localhost:5173
   - Should show the website with a blue chat button in bottom-right

### Step 6: Test the Chatbot

1. Open http://localhost:5173
2. Click the blue chat button (bottom-right corner)
3. Chat window opens with welcome message
4. Try typing: "I need a PRDS system"
5. The bot should respond with questions about specifications

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify .env file has correct values
- Check `npm install` completed successfully

### Frontend won't start
- Check if port 5173 is already in use
- Verify `npm install` completed in Frontend/volform
- Clear browser cache

### Chatbot not responding
- Check backend is running (http://localhost:8000)
- Open browser console (F12) for errors
- Verify OpenAI API key is valid and has credits
- Check Supabase credentials are correct

### Database errors
- Verify schema was run successfully in Supabase
- Check Supabase project is active
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct

## Testing the System

### Test Conversation Flow

1. **Start Chat**: Click chat button
2. **Product Selection**: "I need a steam pipe sizing system"
3. **Specifications**: Bot asks for flow rate, pressure, etc.
4. **Provide Details**: "Flow rate is 8000 kg/hr, pressure is 6 bar"
5. **Get Quote**: Bot calculates and provides quotation

### Check Database

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Check these tables have data:
   - `steam_tables` - Should have ~14 rows
   - `material_specs` - Should have 4 rows
   - `products` - Should have 4 rows
   - `calculator_templates` - Should have 1 row

4. After chatting, check:
   - `customers` - Your test customer
   - `conversations` - Your conversation
   - `messages` - Your chat messages

## Next Development Steps

1. **Enhance AI Training**
   - Add more Excel formulas to the AI context
   - Train on specific product calculations

2. **Add Calculation Engine**
   - Implement steam pipe sizing calculator
   - Implement PRDS calculator
   - Add pricing logic

3. **PDF Generation**
   - Install PDF library
   - Create quotation template
   - Generate downloadable PDFs

4. **Admin Dashboard**
   - View all quotations
   - Approve/reject quotes
   - Manage customers

5. **Email Notifications**
   - Send quotation to customer
   - Notify team of new requests

## Support

If you encounter issues:
1. Check the console logs (backend terminal)
2. Check browser console (F12)
3. Verify all environment variables
4. Ensure Supabase and OpenAI accounts are active

Contact: steam@volfram.in
