const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini-only');

const SYSTEM_PROMPT = `You are a helpful quotation assistant for Volfram Systems India Pvt. Ltd., a boiler and steam system company.

Your role is to help customers get accurate quotations for steam systems, boilers, PRDS (Pressure Reducing & De-superheating Stations), and related equipment.

Available Products:
- Steam Pipe Sizing Systems
- PRDS (Pressure Reducing & De-superheating Station)
- Boiler Systems
- Condensate Recovery Systems
- Steam Flow Meters
- Safety Valves
- Custom Steam Solutions

Company Contact:
- Email: steam@volfram.in
- Phone: +91 9309534688

Ask questions one at a time. Be technical but friendly.`;

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

        if (!model) {
            return res.status(503).json({
                success: false,
                error: 'Chatbot service is not configured.',
                reply: 'Sorry, the chatbot service is currently unavailable. Please email steam@volfram.in for assistance.'
            });
        }

        // Generate response with FREE Gemini
        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`;
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        console.log('✅ FREE Gemini response generated');

        return res.json({
            success: true,
            response: aiResponse,
            reply: aiResponse
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            reply: 'Sorry, something went wrong. Please email steam@volfram.in for assistance.'
        });
    }
});

module.exports = router;
