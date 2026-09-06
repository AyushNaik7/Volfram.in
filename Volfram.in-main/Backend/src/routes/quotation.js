const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatConversation = require('../models/ChatConversation.models.js');
const Quotation = require('../models/Quotation.models.js');

// POST /api/quotation/generate - Generate quotation
router.post('/generate', async (req, res) => {
    try {
        const { conversationId, productDetails, calculations } = req.body;

        if (!mongoose.isValidObjectId(conversationId)) {
            return res.status(400).json({ success: false, error: 'A valid conversationId is required.' });
        }

        const conversation = await ChatConversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        const quotation = await Quotation.create({
            conversationId: conversation._id,
            customerId: conversation.customerInfo?.id || conversation.customerInfo?.email || '',
            customerInfo: conversation.customerInfo,
            quotationNumber: `VOL-${Date.now()}`,
            productDetails,
            calculations: calculations || {},
            totalPrice: calculations?.totalPrice || 0,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        res.json({
            success: true,
            quotation
        });

    } catch (error) {
        console.error('Quotation generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/quotation/:id - Get quotation
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === 'customer') return next();

        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, error: 'Invalid quotation id.' });
        const quotation = await Quotation.findById(id);
        if (!quotation) return res.status(404).json({ success: false, error: 'Quotation not found' });

        res.json({
            success: true,
            quotation
        });

    } catch (error) {
        console.error('Get quotation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/quotation/customer/:customerId - Get customer quotations
router.get('/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const quotations = await Quotation.find({ customerId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            quotations
        });

    } catch (error) {
        console.error('Get customer quotations error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
