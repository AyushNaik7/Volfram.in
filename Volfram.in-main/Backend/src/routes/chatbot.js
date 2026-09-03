const express = require('express');
const router = express.Router();
const { openai, config } = require('../config/openai');
const supabase = require('../config/supabase');

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

/**
 * Generate AI response using configured LLM provider
 * @param {Array} messages - Array of chat messages
 * @returns {Promise<string>} - AI response text
 */
async function generateAIResponse(messages) {
    if (!openai || !config) {
        throw new Error('LLM service is not configured');
    }

    const completion = await openai.chat.completions.create({
        model: config.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
    });

    return completion.choices[0].message.content;
}

/**
 * Classify error type and return appropriate response
 */
function handleChatError(error, provider, model) {
    // Log detailed error for debugging
    console.error('❌ Chat Error:');
    console.error(`   Provider: ${provider || 'unknown'}`);
    console.error(`   Model: ${model || 'unknown'}`);
    console.error(`   Error: ${error.message}`);
    
    if (error.status) {
        console.error(`   HTTP Status: ${error.status}`);
    }

    // Classify error type
    let statusCode = 500;
    let errorType = 'upstream_error';
    let userMessage = 'Sorry, something went wrong. Please email steam@volfram.in for assistance.';

    // Configuration/authentication errors (4xx-style)
    if (error.status === 401 || error.status === 403) {
        statusCode = 503;
        errorType = 'authentication_error';
        userMessage = 'Chatbot service is misconfigured. Please contact support.';
    } else if (error.status === 404) {
        statusCode = 503;
        errorType = 'model_not_found';
        userMessage = 'The AI model is unavailable. Please contact support.';
    } else if (error.status === 429) {
        statusCode = 503;
        errorType = 'rate_limit';
        userMessage = 'Service is temporarily busy. Please try again in a moment.';
    } else if (!openai || !config) {
        statusCode = 503;
        errorType = 'not_configured';
        userMessage = 'Chatbot service is not configured. Please contact support.';
    }

    return {
        statusCode,
        body: {
            success: false,
            error: errorType,
            message: userMessage,
            reply: userMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
    };
}

// POST /api/chat/chat - Handle chat messages
router.post('/chat/chat', async (req, res) => {
    try {
        const { message, conversationId, customerInfo } = req.body;

        // Validate request
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'validation_error',
                message: 'Message is required'
            });
        }

        // Check if LLM is configured
        if (!openai || !config) {
            const errorResponse = handleChatError(
                new Error('LLM not configured'),
                config?.provider,
                config?.model
            );
            return res.status(errorResponse.statusCode).json(errorResponse.body);
        }

        // Check if Supabase is available for conversation history
        if (!supabase) {
            // Simplified mode: Just respond with AI, no conversation history
            const chatMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ];

            const aiResponse = await generateAIResponse(chatMessages);

            return res.json({
                success: true,
                response: aiResponse,
                reply: aiResponse,
                note: 'Running in simplified mode without conversation history'
            });
        }

        // Full mode with Supabase conversation history
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

        // Prepare messages for LLM
        const chatMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Get AI response
        const aiResponse = await generateAIResponse(chatMessages);

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
            reply: aiResponse
        });

    } catch (error) {
        const errorResponse = handleChatError(error, config?.provider, config?.model);
        res.status(errorResponse.statusCode).json(errorResponse.body);
    }
});

// GET /api/chat/history/:conversationId - Get conversation history
router.get('/history/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!supabase) {
            return res.status(503).json({
                success: false,
                error: 'not_configured',
                message: 'Conversation history is not available'
            });
        }

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
            error: 'history_error',
            message: error.message
        });
    }
});

module.exports = router;
