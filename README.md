# Volfram Quotation Chatbot System

AI-powered quotation system for Volfram Systems India Pvt. Ltd. - Automates custom quotations for boilers, steam systems, and PRDS equipment.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Real-time**: Supabase Real-time subscriptions

## Features

- 🤖 AI-powered chatbot for customer interaction
- 📊 Automated quotation generation based on Excel calculator data
- 💾 Customer conversation history
- 📄 PDF quotation generation
- 🔄 Real-time chat updates
- 📈 Admin dashboard for quote management

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Go to SQL Editor and run the schema from `Backend/supabase-schema.sql`
4. Get your project URL and anon key from Settings > API

### 2. OpenAI Setup

1. Create an OpenAI account at https://platform.openai.com
2. Generate an API key from API Keys section
3. Add credits to your account

### 3. Backend Setup

```bash
cd Backend

# Install dependencies (already done)
npm install

# Update .env file with your credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# Seed the database with Excel data
node src/utils/seedData.js

# Start the server
npm run dev
```

### 4. Frontend Setup

```bash
cd Frontend/volform

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Project Structure

```
Volform_Website-main/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js       # Supabase client
│   │   │   └── openai.js         # OpenAI client
│   │   ├── routes/
│   │   │   ├── chatbot.js        # Chat endpoints
│   │   │   └── quotation.js      # Quotation endpoints
│   │   ├── utils/
│   │   │   └── seedData.js       # Database seeding
│   │   ├── app.js                # Express app
│   │   └── index.js              # Server entry
│   ├── supabase-schema.sql       # Database schema
│   └── .env                      # Environment variables
│
└── Frontend/
    └── volform/
        └── src/
            ├── components/
            │   └── chatbot/
            │       └── Chatbot.jsx   # Chat UI component
            └── App.jsx               # Main app

```

## API Endpoints

### Chat Endpoints

- `POST /api/chat/chat` - Send message to chatbot
- `GET /api/chat/history/:conversationId` - Get conversation history

### Quotation Endpoints

- `POST /api/quotation/generate` - Generate quotation
- `GET /api/quotation/:id` - Get quotation by ID
- `GET /api/quotation/customer/:customerId` - Get customer quotations

## Database Schema

### Main Tables

- **customers** - Customer information
- **conversations** - Chat conversations
- **messages** - Chat messages
- **quotations** - Generated quotations
- **products** - Product catalog
- **pricing_rules** - Pricing logic
- **calculator_templates** - Excel calculator templates
- **steam_tables** - Saturated steam data
- **material_specs** - Material specifications

## How It Works

1. **Customer Interaction**: Customer opens chat widget on website
2. **Requirement Gathering**: AI chatbot asks questions about product needs
3. **Specification Collection**: Bot collects technical details (pressure, temperature, flow rate, dimensions)
4. **Calculation**: Backend uses Excel formulas to calculate specifications
5. **Quotation Generation**: System generates detailed quotation with pricing
6. **Review & Approval**: Customer reviews, Volfram team approves
7. **Order Processing**: Quotation converts to order

## Excel Data Integration

The system uses data from the Volfram Calculator Excel sheet:

- **Steam Tables** - Saturated steam properties
- **Material Specs** - Allowable stress values for different materials
- **Pipe Data** - Standard pipe sizes and schedules
- **Calculation Formulas** - Engineering calculations for sizing

## Next Steps

1. ✅ Basic chatbot setup
2. ✅ Database schema
3. ✅ API endpoints
4. ⏳ Enhanced AI training with Excel formulas
5. ⏳ PDF quotation generation
6. ⏳ Admin dashboard
7. ⏳ Email notifications
8. ⏳ Payment integration

## Environment Variables

```env
# Backend
PORT=8000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

## Support

For issues or questions, contact: steam@volfram.in

## License

Proprietary - Volfram Systems India Pvt. Ltd.
