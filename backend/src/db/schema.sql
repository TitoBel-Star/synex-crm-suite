-- =============================================================================
-- ESQUEMA COMPLETO POSTGRESQL PARA MÓDULO ENTERPRISE WHATSAPP BUSINESS + CRM + ERP
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EMPRESAS Y SUCURSALES (Multi-tenant & Multi-branch)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    industry VARCHAR(100) DEFAULT 'General Commercial',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    address TEXT,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CONFIGURACIÓN WHATSAPP CLOUD API (Meta)
CREATE TABLE IF NOT EXISTS whatsapp_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    app_id VARCHAR(100) NOT NULL,
    app_secret_encrypted TEXT NOT NULL,
    business_account_id VARCHAR(100) NOT NULL,
    phone_number_id VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    access_token_encrypted TEXT NOT NULL,
    webhook_verify_token VARCHAR(100) NOT NULL,
    webhook_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GESTIÓN DE OPERADORES Y VENDEDORES (Bandeja Multiagente)
CREATE TABLE IF NOT EXISTS sales_reps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'AGENT', -- AGENT, SUPERVISOR, ADMIN
    status VARCHAR(20) DEFAULT 'ONLINE', -- ONLINE, AWAY, OFFLINE
    active_chats_count INT DEFAULT 0,
    max_concurrent_chats INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CLIENTES Y CONTACTOS CRM (Registro automático si no existe)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    phone_number VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    tax_id VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    customer_type VARCHAR(30) DEFAULT 'PROSPECT', -- PROSPECT, LEAD, CLIENT
    credit_limit NUMERIC(12,2) DEFAULT 0.00,
    current_balance NUMERIC(12,2) DEFAULT 0.00,
    assigned_sales_rep_id UUID REFERENCES sales_reps(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_phone UNIQUE (company_id, phone_number)
);

-- 5. EMBUDO DE VENTAS (Stages & Deals)
CREATE TABLE IF NOT EXISTS funnel_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    order_index INT NOT NULL,
    color VARCHAR(10) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS funnel_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES funnel_stages(id),
    assigned_sales_rep_id UUID REFERENCES sales_reps(id),
    title VARCHAR(150) NOT NULL,
    expected_value NUMERIC(12,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, WON, LOST
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CONVERSACIONES Y MENSAJES EN TIEMPO REAL
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    assigned_sales_rep_id UUID REFERENCES sales_reps(id),
    wa_conversation_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'UNASSIGNED', -- UNASSIGNED, IN_PROGRESS, AI_BOT, CLOSED
    priority VARCHAR(10) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    tags TEXT[], -- Ej: ['VIP', 'Cotizacion', 'Soporte']
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    wa_message_id VARCHAR(100) UNIQUE,
    sender_type VARCHAR(10) NOT NULL, -- CUSTOMER, AGENT, SYSTEM, AI
    sender_name VARCHAR(100),
    message_type VARCHAR(20) NOT NULL, -- TEXT, IMAGE, AUDIO, VIDEO, DOCUMENT, LOCATION, STICKER, TEMPLATE
    content TEXT,
    media_url TEXT,
    media_mime_type VARCHAR(100),
    location_latitude NUMERIC(10,8),
    location_longitude NUMERIC(11,8),
    delivery_status VARCHAR(20) DEFAULT 'SENT', -- SENT, DELIVERED, READ, FAILED
    internal_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MOTOR DE AUTOMATIZACIÓN NO-CODE (Reglas Configurables)
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    trigger_keyword VARCHAR(100) NOT NULL,
    match_type VARCHAR(20) DEFAULT 'EXACT', -- EXACT, CONTAINS, REGEX
    action_type VARCHAR(30) NOT NULL, -- QUERY_INVENTORY, SEND_INVOICE_PDF, QUERY_LOGISTICS, AI_REPLY, TRANSFER_QUEUE
    action_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CATALOGO ERP: PRODUCTOS, KARDEX Y DOCUMENTOS (Cotizaciones, Pedidos, Facturas)
CREATE TABLE IF NOT EXISTS erp_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'General',
    price NUMERIC(12,2) NOT NULL,
    stock_qty INT DEFAULT 0,
    unit_of_measure VARCHAR(20) DEFAULT 'UNIDAD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_sku UNIQUE (company_id, sku)
);

CREATE TABLE IF NOT EXISTS erp_kardex (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- IN, OUT, ADJUSTMENT
    quantity INT NOT NULL,
    balance_after INT NOT NULL,
    reference_doc VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS erp_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    doc_type VARCHAR(20) NOT NULL, -- QUOTE, ORDER, INVOICE
    doc_number VARCHAR(50) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    tax NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, INVOICED, DISPATCHED, CANCELLED
    pdf_url TEXT,
    items JSONB NOT NULL, -- [{sku, name, price, qty, line_total}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDITORÍA Y REGISTRO DE CAMBIOS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    user_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES OPTIMIZADOS PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(company_id, phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_cust ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_wa_id ON messages(wa_message_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON funnel_deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_rules_keyword ON automation_rules(company_id, trigger_keyword);
CREATE INDEX IF NOT EXISTS idx_erp_products_sku ON erp_products(company_id, sku);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at DESC);
