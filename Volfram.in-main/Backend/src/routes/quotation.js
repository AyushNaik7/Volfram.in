const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/quotation/generate - Generate quotation
router.post('/generate', async (req, res) => {
    try {
        const { conversationId, productDetails, calculations } = req.body;

        // Get conversation and customer
        const { data: conversation } = await supabase
            .from('conversations')
            .select('*, customers(*)')
            .eq('id', conversationId)
            .single();

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        // Generate quotation number
        const quotationNumber = `VOL-${Date.now()}`;

        // Calculate total price (simplified - you'll add complex logic)
        const totalPrice = calculations.totalPrice || 0;

        // Create quotation
        const { data: quotation, error } = await supabase
            .from('quotations')
            .insert([{
                conversation_id: conversationId,
                customer_id: conversation.customer_id,
                quotation_number: quotationNumber,
                product_details: productDetails,
                calculations: calculations,
                total_price: totalPrice,
                status: 'draft',
                valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }])
            .select()
            .single();

        if (error) throw error;

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
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data: quotation, error } = await supabase
            .from('quotations')
            .select('*, customers(*)')
            .eq('id', id)
            .single();

        if (error) throw error;

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

        const { data: quotations, error } = await supabase
            .from('quotations')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) throw error;

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
