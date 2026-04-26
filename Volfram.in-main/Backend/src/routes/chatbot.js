const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const openai = require('../config/openai');

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

Ask questions one at a time to avoid overwhelming the customer. Be technical but friendly.`;

// POST /api/chat - Handle chat messages
router.post('/chat', async (req, res) => {
    try {
        const { message, conversationId, customerInfo } = req.body;

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

        // Get AI response
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 500
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
            response: aiResponse
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
