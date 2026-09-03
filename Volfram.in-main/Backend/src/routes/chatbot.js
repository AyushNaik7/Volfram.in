const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const openai = require('../config/openai');
const { isGemini, model: geminiModel } = require('../config/gemini');

// System prompt with Volfram product knowledge
const SYSTEM_PROMPT = `You are a helpful quotation assistant for Volfram Systems India Pvt. Ltd., a boiler and steam system company.

Your role is to help customers get accurate quotations for steam systems, boilers, PRDS (Pressure Reducing & De-superheating Stations), and related equipment.

You should:
1. Greet customers warmly
2. Ask about their requirements (product type, specifications, dimensions, pressure, temperature, etc.)
3. Gather all necessary technical details
4. Calculate pricing based on the specifications
5. Generate a quotation

Available Products:
- Steam Pipe Sizing Systems
- PRDS (Pressure Reducing & De-superheating Station)
- Boiler Systems
- Condensate Recovery Systems
- Steam Flow Meters
- Safety Valves
- Custom Steam Solutions

You should also be able to answer basic questions about the company using the information below, even if the customer isn't asking for a quotation.

## Company Info & FAQs

Q: Who is Volfram Systems / what does the company do?
A: Volfram Systems India Pvt. Ltd. is an IBR-certified steam engineering and pressure vessel manufacturing company. We deliver sustainable, efficient steam systems, and have been serving the industry for 14 years with 600+ happy customers globally.

Q: What industries does Volfram Systems serve?
A: We serve Pharmaceutical & Chemical, Food & Beverage, Textile & Paper, and Oil & Gas industries, among others.

Q: What products does Volfram Systems offer?
A: Our products fall into these categories:
- Steam Generation: Small Industrial Boiler, Packaged Solid Fuel Boiler, Packaged Oil/Gas Fired Boiler
- Boiler House Accessories: TDS Based Automatic Boiler Blow Down System, Chemical Dosing System, Packaged Feed Water Tank System, Deaerator Head, Level Control System, Steam Injector, V-Wise Smart Boiler Controller, Orifice Flow Meter
- Steam Distribution: Steam Trap, Strainer, Valves, Pressure Reducing Station (PRS), Pressure Reducing & De-Superheating Station (PRDS), Steam Control Valve, Temperature Control System, Pressure Gauges, Automatic Pumping Trap, Moisture Separator, Sight Glass
- Customized Package Solutions: Condensate Recovery System, Condensate Contamination Monitoring & Control System, Heat Exchanger, Waste Heat Recovery System, pH Control System, Steam Based Hot Water Generation System, Vapomax Pump, Autoclave
- Process Instruments: Pressure Transmitter

Q: Does Volfram make boilers?
A: Yes — we manufacture Small Industrial Boilers, Packaged Solid Fuel Boilers, and Packaged Oil/Gas Fired Boilers, along with a full range of boiler house accessories.

Q: What is a PRDS / Pressure Reducing and De-Superheating Station?
A: It's part of our Steam Distribution product line, used to reduce steam pressure and control temperature (de-superheating) as steam is distributed through a plant.

Q: Do you offer condensate recovery systems?
A: Yes, we offer Condensate Recovery Systems as well as Condensate Contamination Monitoring & Control Systems as part of our Customized Package Solutions. We've installed 422+ condensate recovery systems across various industry segments.

Q: What services does Volfram Systems provide besides manufacturing?
A: We offer:
- Steam & Condensate System Audits of existing plants
- Designing of complete Steam & Condensate Systems for new projects
Our audits cover Steam Generation efficiency, Steam Distribution (pipe sizing, insulation, pressure reduction), Steam Utilization, and Heat Recovery. We also help with implementation, post-implementation monitoring, savings evaluation, and training your engineering/maintenance/boiler team.

Q: What is a steam audit?
A: A steam audit studies your existing plant's steam generation, distribution, and utilization efficiency, then recommends how to reduce fuel costs — including designing and implementing energy conservation projects and training your team to sustain the savings.

Q: Is Volfram Systems a distributor for any other brands?
A: Yes, we are the Principal Distributor for Walchem and Pyxis Lab products in India, Bangladesh, and Sri Lanka.

Q: Where is Volfram Systems located?
A: We have two locations:
- Corporate / Admin Office: 402, Rutuvihar, Waranasi Society, Warje, Pune – 411058, Maharashtra, India
- Manufacturing Unit: Akurdi Industrial Estate, Plot No. 3B+3 Part / 32, D-1 Block, MIDC, Chinchwad, Pune – 411019, Maharashtra, India

Q: Where is your manufacturing unit?
A: Akurdi Industrial Estate, Plot No. 3B+3 Part / 32, D-1 Block, MIDC, Chinchwad, Pune – 411019, Maharashtra, India.

Q: Where is your corporate/admin office?
A: 402, Rutuvihar, Waranasi Society, Warje, Pune – 411058, Maharashtra, India.

Q: How can I contact Volfram Systems?
A:
- Email: steam@volfram.in
- General Enquiry / Sales Dept: +91 9309534688
- Purchase Dept: +91 9172033598
- WhatsApp is also available via the contact links on our website
You can also just share your requirement here and I'll help you get started with a quotation.

Q: Does Volfram Systems have social media / can I see more of your work?
A: Yes — we're active on Instagram (@volfram_systems), Facebook (Volfram Systems), LinkedIn, and YouTube, where we post product demos and event coverage (e.g. Boiler India Expo, Boiler World Expo Africa).

Q: How many years has Volfram Systems been in business?
A: We've been serving the industry for 14 years.

If a customer asks something not covered by the information above (e.g. detailed pricing, technical datasheets, certifications beyond IBR, staff/leadership details), be honest that you don't have that specific detail and direct them to email steam@volfram.in or call +91 9309534688 rather than guessing.

Ask questions one at a time to avoid overwhelming the customer. Be technical but friendly.`;

// POST /api/chat/chat - Handle chat messages
router.post('/chat/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({
                success: false,
                error: 'Chatbot service is not configured. Please contact the administrator.',
                reply: 'Sorry, the chatbot service is currently unavailable. Please email steam@volfram.in for assistance.'
            });
        }

        // Check if Supabase is available
        if (!supabase) {
            // Simplified mode: Just respond with AI, no conversation history
            const chatMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ];

            // Determine which model to use based on API key type
            const isGroq = process.env.OPENAI_API_KEY.startsWith('gsk_');
            const model = isGroq ? 'openai/gpt-oss-120b' : 'gpt-4o-mini';

            console.log(`Using model: ${model} (Groq: ${isGroq})`);

            // Get AI response
            const completion = await openai.chat.completions.create({
                model: model,
                messages: chatMessages,
                temperature: 0.7,
                max_tokens: 1000
            });

            const aiResponse = completion.choices[0].message.content;

            return res.json({
                success: true,
                response: aiResponse,
                reply: aiResponse,  // Add reply field for frontend compatibility
                note: 'Running in simplified mode without conversation history'
            });
        }

        // Full mode with Supabase (original code)
        const { conversationId, customerInfo } = req.body;
        let conversation;
        let customer;

        // Create or get customer
        if (customerInfo && !conversationId) {
            const { data: existingCustomer } = await supabase
                .from('customers')
                .select('*')
                .eq('email', customerInfo.email)
                .single();

            if (existingCustomer) {
                customer = existingCustomer;
            } else {
                const { data: newCustomer, error } = await supabase
                    .from('customers')
                    .insert([customerInfo])
                    .select()
                    .single();

                if (error) throw error;
                customer = newCustomer;
            }
        }

        // Create or get conversation
        if (!conversationId) {
            const { data: newConversation, error } = await supabase
                .from('conversations')
                .insert([{
                    customer_id: customer?.id,
                    status: 'active',
                    context: {}
                }])
                .select()
                .single();

            if (error) throw error;
            conversation = newConversation;
        } else {
            const { data: existingConversation } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', conversationId)
                .single();

            conversation = existingConversation;
        }

        // Save user message
        await supabase.from('messages').insert([{
            conversation_id: conversation.id,
            role: 'user',
            content: message
        }]);

        // Get conversation history
        const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: true });

        // Prepare messages for OpenAI
        const chatMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Determine which model to use based on API key type
        const isGroq = process.env.OPENAI_API_KEY.startsWith('gsk_');
        const model = isGroq ? 'openai/gpt-oss-120b' : 'gpt-4o-mini';

        console.log(`Using model: ${model} (Groq: ${isGroq})`);

        // Get AI response
        const completion = await openai.chat.completions.create({
            model: model,
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 1000
        });

        const aiResponse = completion.choices[0].message.content;

        // Save AI response
        await supabase.from('messages').insert([{
            conversation_id: conversation.id,
            role: 'assistant',
            content: aiResponse
        }]);

        res.json({
            success: true,
            conversationId: conversation.id,
            response: aiResponse,
            reply: aiResponse  // Add reply field for frontend compatibility
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/chat/history/:conversationId - Get conversation history
router.get('/history/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.json({
            success: true,
            messages
        });

    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;