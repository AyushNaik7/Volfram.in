const assert = require('node:assert/strict');
const ChatbotLead = require('../src/models/ChatbotLead.models.js');
const router = require('../src/routes/chatbot.js');

const leadRoute = router.stack.find((layer) => layer.route?.path === '/chat/lead').route;
const [authMiddleware, saveLead] = leadRoute.stack.map((layer) => layer.handle);

function invokeLead(body, headers = {}) {
    return new Promise((resolve, reject) => {
        const req = { body, headers };
        const res = {
            statusCode: 200,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(value) {
                resolve({ statusCode: this.statusCode, value });
            }
        };

        try {
            authMiddleware(req, res, () => {
                Promise.resolve(saveLead(req, res)).catch(reject);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function run() {
    const originalFindOneAndUpdate = ChatbotLead.findOneAndUpdate;
    let savedUpdate;
    ChatbotLead.findOneAndUpdate = async (_filter, update) => {
        savedUpdate = update;
        return { _id: 'guest-lead-id', ...update.$set };
    };

    try {
        const result = await invokeLead({
            session_id: 'guest-session',
            customerInfo: {
                name: '  Guest Customer  ',
                email: '  GUEST@EXAMPLE.COM ',
                phone: ' +91 9876543210 '
            },
            quoteDetails: { product: 'PRDS Station' },
            message: 'Quotation request'
        });

        assert.equal(result.statusCode, 201);
        assert.equal(savedUpdate.$set.user, null);
        assert.equal(savedUpdate.$set.customerName, 'Guest Customer');
        assert.equal(savedUpdate.$set.customerEmail, 'guest@example.com');
        assert.equal(savedUpdate.$set.customerPhone, '+91 9876543210');
        assert.equal(savedUpdate.$set.quoteSubmitted, true);

        savedUpdate = undefined;
        const missingContact = await invokeLead({
            session_id: 'guest-session-without-email',
            customerInfo: { name: 'Guest Customer', phone: '+91 9876543210' }
        });
        assert.equal(missingContact.statusCode, 400);
        assert.equal(savedUpdate, undefined);
    } finally {
        ChatbotLead.findOneAndUpdate = originalFindOneAndUpdate;
    }

    console.log('Guest chatbot lead tests passed.');
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
