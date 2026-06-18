-- Volfram Calculator Database Schema
-- Run this in Supabase SQL Editor first before running seed.js

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS material_stress CASCADE;
DROP TABLE IF EXISTS pipe_data CASCADE;
DROP TABLE IF EXISTS steam_tables CASCADE;

-- Steam Tables (Saturated Steam Properties)
CREATE TABLE steam_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pressure_bar DECIMAL(6,2) NOT NULL,
    temp_c DECIMAL(6,2),
    sp_volume DECIMAL(10,4),
    density DECIMAL(10,4),
    sensible_heat DECIMAL(10,2),
    latent_heat DECIMAL(10,2),
    total_heat DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pipe Data (Standard Pipe Sizes)
CREATE TABLE pipe_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    size_nb INTEGER NOT NULL,
    schedule VARCHAR(20),
    outer_dia_mm DECIMAL(10,2),
    wall_thickness_mm DECIMAL(10,3),
    material VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Material Stress Values
CREATE TABLE material_stress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temperature_c DECIMAL(6,2) NOT NULL,
    a106_grb DECIMAL(10,2),
    a516_gr70 DECIMAL(10,2),
    ss304 DECIMAL(10,2),
    ss316 DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255),
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(50) DEFAULT 'active',
    context JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quotations
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    customer_id UUID REFERENCES customers(id),
    quotation_number VARCHAR(50) UNIQUE,
    product_details JSONB,
    calculations JSONB,
    total_price DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'draft',
    pdf_url TEXT,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_steam_pressure ON steam_tables(pressure_bar);
CREATE INDEX idx_pipe_size ON pipe_data(size_nb);
CREATE INDEX idx_material_temp ON material_stress(temperature_c);
CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);

-- Success message
SELECT 'Database schema created successfully! Now run: node seed.js' as message;
