-- SEED DATA DEMO PARA SISTEMA MULTI-EMPRESA REUTILIZABLE

-- 1. EMPRESAS DEMO
INSERT INTO companies (id, name, tax_id, industry) VALUES
('11111111-1111-1111-1111-111111111111', 'Comercial Global S.A.', 'J-30492811-0', 'Distribuidora & Supermercado'),
('22222222-2222-2222-2222-222222222222', 'Ferretería Industrial del Norte', 'J-40192833-1', 'Ferretería & Construcción')
ON CONFLICT (tax_id) DO NOTHING;

-- 2. SUCURSALES
INSERT INTO branches (id, company_id, name, code, address, phone) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Sucursal Central', 'SUC-001', 'Av. Principal #100', '+50622334455'),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Sucursal Norte', 'SUC-002', 'Plaza Comercial Norte', '+50622334456')
ON CONFLICT DO NOTHING;

-- 3. CONFIGURACIÓN META WHATSAPP CLOUD API (DEMO ENCRYPTED CREDENTIALS)
INSERT INTO whatsapp_configs (id, company_id, branch_id, app_id, app_secret_encrypted, business_account_id, phone_number_id, phone_number, access_token_encrypted, webhook_verify_token, webhook_url) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '987654321012345', 'enc_app_secret_123', '102938475610293', '105938201948271', '+50688990011', 'enc_access_token_xyz_meta', 'antigravity_webhook_secret_2026', 'https://api.comercialglobal.com/api/v1/webhooks/whatsapp')
ON CONFLICT (phone_number_id) DO NOTHING;

-- 4. VENDEDORES / OPERADORES
INSERT INTO sales_reps (id, company_id, branch_id, name, email, role, status, active_chats_count, max_concurrent_chats) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Carlos Mendoza', 'carlos.mendoza@comercial.com', 'ADMIN', 'ONLINE', 2, 10),
('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Ana Gutiérrez', 'ana.gutierrez@comercial.com', 'AGENT', 'ONLINE', 1, 8),
('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'Roberto Gómez', 'roberto.gomez@comercial.com', 'AGENT', 'AWAY', 0, 8)
ON CONFLICT (email) DO NOTHING;

-- 5. CLIENTES PROSPECTOS / LEADS
INSERT INTO customers (id, company_id, phone_number, name, tax_id, email, address, customer_type, credit_limit, current_balance, assigned_sales_rep_id) VALUES
('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '+50670112233', 'Distribuidora Los Laureles', '3-101-778899', 'compras@laureles.com', 'San José, Barrio Amón 100m Este', 'CLIENT', 50000.00, 12450.00, 'c1111111-1111-1111-1111-111111111111'),
('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '+50670998877', 'María Fernanda Rojas', '1-1554-0982', 'maria.rojas@gmail.com', 'Escazú, Condominio Vista Real', 'LEAD', 0.00, 0.00, 'c2222222-2222-2222-2222-222222222222'),
('d3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '+50661223344', 'Supermercado El Sol', '3-102-445566', 'proveedores@elsol.cr', 'Heredia Centro', 'CLIENT', 100000.00, 45200.00, 'c1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- 6. ETAPAS DEL EMBUDO DE VENTAS
INSERT INTO funnel_stages (id, company_id, name, order_index, color) VALUES
('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Nuevo Lead', 1, '#94A3B8'),
('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Primer contacto', 2, '#3B82F6'),
('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Interesado', 3, '#06B6D4'),
('e4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Cotización', 4, '#F59E0B'),
('e5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Negociación', 5, '#8B5CF6'),
('e6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Pedido', 6, '#EC4899'),
('e7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Facturado', 7, '#10B981'),
('e8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Despachado', 8, '#059669'),
('e9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Seguimiento', 9, '#6366F1'),
('e1010101-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', 'Cliente frecuente', 10, '#14B8A6'),
('e1110111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cliente perdido', 11, '#EF4444')
ON CONFLICT DO NOTHING;

-- 7. TRATOS EN EL EMBUDO DE VENTAS
INSERT INTO funnel_deals (id, company_id, customer_id, stage_id, assigned_sales_rep_id, title, expected_value, status) VALUES
('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'e4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'Pedido Alimentos Trimestral', 8500.00, 'OPEN'),
('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Consulta Precio Detergentes', 450.00, 'OPEN'),
('f3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'e7777777-7777-7777-7777-777777777777', 'c1111111-1111-1111-1111-111111111111', 'Lote Bebidas Enero', 15200.00, 'WON')
ON CONFLICT DO NOTHING;

-- 8. PRODUCTOS ERP
INSERT INTO erp_products (id, company_id, sku, name, description, category, price, stock_qty, unit_of_measure) VALUES
('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'PROD-ACEITE-1L', 'Aceite Vegetal 1 Litro Premium', 'Aceite de soya refinado para cocina', 'Alimentos', 3.50, 450, 'UNIDAD'),
('p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'PROD-ARROZ-5KG', 'Arroz Grano Entero 5kg 99%', 'Arroz blanco de primera calidad', 'Alimentos', 6.20, 230, 'SACO'),
('p3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'PROD-DET-3KG', 'Detergente Multiuso 3kg', 'Detergente en polvo ultra blanqueador', 'Limpieza', 8.90, 120, 'BOLSA'),
('p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'PROD-BEBIDA-2L', 'Refresco Gaseoso 2.25L Pack 6', 'Pack de 6 unidades sabor Cola', 'Bebidas', 11.50, 95, 'PACK')
ON CONFLICT DO NOTHING;

-- 9. REGLAS DE AUTOMATIZACIÓN NO-CODE
INSERT INTO automation_rules (id, company_id, name, trigger_keyword, match_type, action_type, action_config) VALUES
('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Respuesta de Precios e Inventario', 'PRECIO', 'CONTAINS', 'QUERY_INVENTORY', '{"reply_template": "📦 *Consulta de Precios e Inventario*\nEstimado cliente, adjuntamos la disponibilidad actual de nuestro catálogo de productos en tiempo real."}'),
('r2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Búsqueda de Factura Electrónica', 'FACTURA', 'CONTAINS', 'SEND_INVOICE_PDF', '{"reply_template": "🧾 *Búsqueda de Factura*\nHemos localizado su última factura procesada en el ERP. Descárguela en formato PDF adjunto."}'),
('r3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Consulta de Estado de Despacho', 'ESTADO', 'CONTAINS', 'QUERY_LOGISTICS', '{"reply_template": "🚚 *Estado del Pedido*\nSu orden se encuentra actualmente en estado: *EN RUTA DE ENTREGA* por nuestro operador logístico."}')
ON CONFLICT DO NOTHING;

-- 10. CONVERSACIONES Y MENSAJES DE EJEMPLO (WHATSAPP AUDITABLE)
INSERT INTO conversations (id, company_id, branch_id, customer_id, assigned_sales_rep_id, wa_conversation_id, status, priority, tags) VALUES
('conv-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'waconv_889911', 'IN_PROGRESS', 'HIGH', ARRAY['Cotización', 'Frecuente']),
('conv-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'waconv_778899', 'AI_BOT', 'MEDIUM', ARRAY['Nuevo Lead', 'Bot'])
ON CONFLICT DO NOTHING;

INSERT INTO messages (conversation_id, wa_message_id, sender_type, sender_name, message_type, content, delivery_status) VALUES
('conv-1111-1111-1111-111111111111', 'wamid.HBgLMTUwNjc3MDExMjIzMxUCAB4A', 'CUSTOMER', 'Distribuidora Los Laureles', 'TEXT', 'Hola Carlos, requiero cotización formal de 100 cajas de Aceite 1L y 50 sacos de Arroz 5kg. ¿Tienen disponible?', 'READ'),
('conv-1111-1111-1111-111111111111', 'wamid.HBgLMTUwNjc3MDExMjIzMxUCAB4B', 'AGENT', 'Carlos Mendoza', 'TEXT', 'Hola Don Fernando, con mucho gusto. Ya le generé la cotización N° COT-2026-0044 desde el ERP. En un momento se la adjunto en PDF.', 'DELIVERED'),
('conv-2222-2222-2222-222222222222', 'wamid.HBgLMTUwNjc3MDk5ODg3NxUCAB4C', 'CUSTOMER', 'María Fernanda Rojas', 'TEXT', 'Hola, me gustaría saber el PRECIO del Detergente Multiuso de 3kg por favor.', 'READ'),
('conv-2222-2222-2222-2222-222222222222', 'wamid.HBgLMTUwNjc3MDk5ODg3NxUCAB4D', 'AI', 'Asistente IA Antigravity', 'TEXT', '📦 *Consulta de Precios e Inventario*\nHola María Fernanda! El Detergente Multiuso 3kg (SKU: PROD-DET-3KG) tiene un valor de **$8.90** por unidad. Contamos con 120 unidades disponibles. ¿Deseas que preparemos tu pedido?', 'SENT')
ON CONFLICT DO NOTHING;
