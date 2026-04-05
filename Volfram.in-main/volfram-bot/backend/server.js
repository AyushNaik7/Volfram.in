require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { calculatePRDS } = require('./calculators/prds');
const { calculateSteamPipe } = require('./calculators/steamPipe');

const app = express();
console.log("API KEY:", process.env.OPENROUTER_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────
// PARAM EXTRACTOR
// ─────────────────────────────────────
const extractParams = (msg, existing) => {
  const params = { ...existing };
  const lower = msg.toLowerCase();

  // Flow rate
  const flowMatch = msg.match(/(\d+(?:\.\d+)?)\s*kg\/hr/i);
  if (flowMatch) params.flowRate = parseFloat(flowMatch[1]);

  // Pressure - extract all bar values
  const pressureMatches = msg.match(/(\d+(?:\.\d+)?)\s*bar/gi);
  if (pressureMatches) {
    const values = pressureMatches.map(p => parseFloat(p));
    if (!params.inletPressure) params.inletPressure = values[0];
    else if (!params.outletPressure && values[1]) params.outletPressure = values[1];
    if (!params.pressure) params.pressure = values[0];
  }

  // Temperature
  const tempMatches = msg.match(/(\d+(?:\.\d+)?)\s*(?:°c|deg\s*c|celsius)/gi);
  if (tempMatches) {
    const values = tempMatches.map(t => parseFloat(t));
    if (!params.inletTemp) params.inletTemp = values[0];
    else if (!params.outletTemp && values[1]) params.outletTemp = values[1];
  }

  // Plain number fallback (e.g. user just types "500")
  const plainNumber = msg.match(/^(\d+(?:\.\d+)?)$/);
  if (plainNumber) {
    const val = parseFloat(plainNumber[1]);
    if (!params.flowRate) params.flowRate = val;
    else if (!params.inletPressure) params.inletPressure = val;
    else if (!params.outletPressure) params.outletPressure = val;
  }

  // Product type detection
  if (lower.includes('prds') || lower.includes('pressure reducing')) 
    params._product = 'PRDS';
  if (lower.includes('steam pipe') || lower.includes('pipe sizing') || lower.includes('pipe size')) 
    params._product = 'STEAM_PIPE';
  if (lower.includes('boiler')) 
    params._product = 'BOILER';

  return params;
};

// ─────────────────────────────────────
// CHAT ENDPOINT
// ─────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, session_id } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ error: 'message and session_id are required' });
  }

  console.log(`\n📩 [${session_id}] User: ${message}`);

  // ── Fetch existing conversation ──
  let { data: conv, error: fetchError } = await supabase
    .from('conversations')
    .select('*')
    .eq('session_id', session_id)
    .single();
    console.log('🔍 Looking for session:', session_id);
console.log('🔍 Found conv:', conv ? 'YES' : 'NO');
console.log('🔍 Fetch error:', fetchError?.code, fetchError?.message);

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Supabase fetch error:', fetchError);
  }

  let messages = conv?.messages || [];
  let collectedParams = conv?.collected_params || {};
  let productType = conv?.product_type || null;

  console.log(`📋 Session state — product: ${productType} | params:`, collectedParams);

  // ── Add user message ──
  messages.push({ role: 'user', content: message });

  // ── Extract params from user message ──
  collectedParams = extractParams(message, collectedParams);
  if (collectedParams._product) {
    productType = collectedParams._product;
    delete collectedParams._product;
    console.log(`🎯 Product detected: ${productType}`);
  }

  // ── Run calculations if params are complete ──
  let calcResults = null;

  if (
    productType === 'PRDS' &&
    collectedParams.flowRate &&
    collectedParams.inletPressure &&
    collectedParams.outletPressure
  ) {
    try {
      calcResults = await calculatePRDS(collectedParams);
      console.log('✅ PRDS calculation done');
    } catch (e) {
      console.error('PRDS calc error:', e);
    }
  } else if (
    productType === 'STEAM_PIPE' &&
    collectedParams.flowRate &&
    collectedParams.pressure
  ) {
    try {
      calcResults = await calculateSteamPipe(collectedParams);
      console.log('✅ Steam pipe calculation done');
    } catch (e) {
      console.error('Steam pipe calc error:', e);
    }
  }

  // ── Build system prompt ──
  const systemPrompt = `You are Volfram Systems India's engineering assistant chatbot.
Volfram makes boiler steam systems, PRDS stations, and steam pipe systems for pharma companies.

Your job:
1. Greet customer warmly
2. Ask which product they need:
   - PRDS Station (Pressure Reducing & De-superheating)
   - Steam Pipe Sizing
   - Boiler System
3. Collect technical specs ONE BY ONE (never ask multiple questions at once):
   For PRDS: steam flow rate (kg/hr), inlet pressure (bar g), inlet temperature (°C), outlet pressure (bar g), required outlet temperature
   For Steam Pipe: flow rate (kg/hr), steam pressure (bar g)
4. When you have all specs, show calculation results clearly
5. Ask if customer wants to submit inquiry to Volfram team

Current collected info: ${JSON.stringify(collectedParams)}
Product selected: ${productType || 'not selected yet'}
Calculation results: ${calcResults ? JSON.stringify(calcResults.results) : 'not calculated yet'}

Rules:
- Ask ONLY ONE question at a time
- Be friendly and professional
- If customer gives a value, acknowledge it then ask the next missing parameter
- Do NOT ask for info that is already collected (check "Current collected info" above)
- When showing results, format them clearly with line sizes and MOC details
- Always offer to submit inquiry at the end
- Keep responses concise`;

  // ── Call OpenRouter ──
  let botReply = 'Sorry, I could not process your request. Please try again.';

  try {
    const openrouterRes = await fetch(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:8000', // ✅ ADD THIS
      'X-Title': 'Volfram Chatbot' // ✅ ADD THIS
    },
    body: JSON.stringify({
      model:  'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
    }),
  }
);

    const aiData = await openrouterRes.json();
    console.log('🤖 OpenRouter status:', openrouterRes.status);

    if (!openrouterRes.ok || !aiData.choices?.[0]) {
      console.error('OpenRouter error:', JSON.stringify(aiData));
    } else {
      botReply = aiData.choices[0].message.content;
    }
  } catch (e) {
    console.error('OpenRouter fetch failed:', e);
  }

  // ── Save bot reply ──
  messages.push({ role: 'assistant', content: botReply });

  // ── Save/update conversation in Supabase ──
  if (conv) {
    console.log(`💾 Updating session: ${session_id}`);
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        messages,
        collected_params: collectedParams,
        product_type: productType,
        updated_at: new Date()
      })
      .eq('session_id', session_id);

    if (updateError) console.error('Supabase update error:', updateError);
  } else {
    console.log(`🆕 Creating session: ${session_id}`);
    const { error: insertError } = await supabase
      .from('conversations')
      .insert({
        session_id,
        messages,
        collected_params: collectedParams,
        product_type: productType
      });

    if (insertError) console.error('Supabase insert error:', insertError);
  }

  console.log(`🤖 [${session_id}] Bot: ${botReply.substring(0, 80)}...`);

  res.json({
    reply: botReply,
    calcResults,
    collectedParams,
    productType
  });
});

// ─────────────────────────────────────
// INQUIRY SAVE ENDPOINT
// ─────────────────────────────────────
app.post('/api/inquiry', async (req, res) => {
  const {
    session_id,
    customer_name,
    customer_email,
    customer_phone,
    product_type,
    input_params,
    calc_results
  } = req.body;

  if (!customer_name || !customer_email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      session_id,
      customer_name,
      customer_email,
      customer_phone,
      product_type,
      input_params,
      calc_results,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Inquiry insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  console.log(`📬 Inquiry saved: ${data.id} for ${customer_name}`);
  res.json({ success: true, inquiry_id: data.id });
});

// ─────────────────────────────────────
// SERVER START
// ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});