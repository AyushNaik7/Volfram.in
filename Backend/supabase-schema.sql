-- Volfram Quotation Chatbot Database Schema

-- Products/Services Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'steam_pipe', 'prds', 'boiler', etc.
    description TEXT,
    base_specifications JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pricing Rules Table
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    rule_name VARCHAR(255),
    parameters JSONB, -- Store dimension ranges, pressure ranges, etc.
    price_formula TEXT, -- Formula for calculation
    base_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Calculator Templates (from Excel sheets)
CREATE TABLE calculator_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(255) NOT NULL, -- 'Steam Pipe Size', 'PRDS', etc.
    template_type VARCHAR(100),
    input_fields JSONB, -- Field definitions
    calculation_logic JSONB, -- Formulas and logic
    output_fields JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255),
    industry VARCHAR(100), -- 'pharma', 'chemical', etc.
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations Table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    context JSONB, -- Store conversation context
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB, -- Additional data like calculations
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quotations Table
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    customer_id UUID REFERENCES customers(id),
    quotation_number VARCHAR(50) UNIQUE,
    product_details JSONB, -- All product specifications
    calculations JSONB, -- Calculation results
    total_price DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'approved', 'rejected'
    pdf_url TEXT,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Material Specifications (from Excel)
CREATE TABLE material_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_grade VARCHAR(100),
    material_type VARCHAR(100), -- 'Carbon Steel', 'Stainless Steel', etc.
    temperature_range JSONB,
    allowable_stress JSONB,
    specifications JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Steam Tables (Saturated Steam Data)
CREATE TABLE steam_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gauge_pressure DECIMAL(6,2),
    boiling_point DECIMAL(6,2),
    specific_volume DECIMAL(8,4),
    density DECIMAL(8,4),
    sensible_heat DECIMAL(8,2),
    latent_heat DECIMAL(8,2),
    total_heat DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_pricing_rules_product ON pricing_rules(product_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
