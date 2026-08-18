import { Pool } from 'pg';
import { ENV } from '../config/env';

// In-Memory Data Store Mock for local fallback execution
export const memoryDb = {
  companies: [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Comercial Global S.A.', tax_id: 'J-30492811-0', industry: 'Distribuidora & Supermercado' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Ferretería Industrial del Norte', tax_id: 'J-40192833-1', industry: 'Ferretería & Construcción' }
  ],
  branches: [
    { id: 'a1111111-1111-1111-1111-111111111111', company_id: '11111111-1111-1111-1111-111111111111', name: 'Sucursal Central', code: 'SUC-001' },
    { id: 'a2222222-2222-2222-2222-222222222222', company_id: '11111111-1111-1111-1111-111111111111', name: 'Sucursal Norte', code: 'SUC-002' }
  ],
  configs: [
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      company_id: '11111111-1111-1111-1111-111111111111',
      app_id: '987654321012345',
      phone_number_id: '105938201948271',
      phone_number: '+50688990011',
      webhook_verify_token: 'antigravity_webhook_secret_2026',
      webhook_url: 'https://api.comercialglobal.com/api/v1/webhooks/whatsapp'
    }
  ],
  salesReps: [
    { id: 'c1111111-1111-1111-1111-111111111111', company_id: '11111111-1111-1111-1111-111111111111', name: 'Carlos Mendoza', email: 'carlos.mendoza@comercial.com', role: 'ADMIN', status: 'ONLINE', active_chats_count: 2 },
    { id: 'c2222222-2222-2222-2222-222222222222', company_id: '11111111-1111-1111-1111-111111111111', name: 'Ana Gutiérrez', email: 'ana.gutierrez@comercial.com', role: 'AGENT', status: 'ONLINE', active_chats_count: 1 },
    { id: 'c3333333-3333-3333-3333-333333333333', company_id: '11111111-1111-1111-1111-111111111111', name: 'Roberto Gómez', email: 'roberto.gomez@comercial.com', role: 'AGENT', status: 'AWAY', active_chats_count: 0 }
  ],
  customers: [
    {
      id: 'd1111111-1111-1111-1111-111111111111',
      company_id: '11111111-1111-1111-1111-111111111111',
      phone_number: '+50670112233',
      name: 'Distribuidora Los Laureles',
      tax_id: '3-101-778899',
      email: 'compras@laureles.com',
      address: 'San José, Barrio Amón 100m Este',
      customer_type: 'CLIENT',
      credit_limit: 50000.00,
      current_balance: 12450.00,
      assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111'
    },
    {
      id: 'd2222222-2222-2222-2222-222222222222',
      company_id: '11111111-1111-1111-1111-111111111111',
      phone_number: '+50670998877',
      name: 'María Fernanda Rojas',
      tax_id: '1-1554-0982',
      email: 'maria.rojas@gmail.com',
      address: 'Escazú, Condominio Vista Real',
      customer_type: 'LEAD',
      credit_limit: 0.00,
      current_balance: 0.00,
      assigned_sales_rep_id: 'c2222222-2222-2222-2222-222222222222'
    },
    {
      id: 'd3333333-3333-3333-3333-333333333333',
      company_id: '11111111-1111-1111-1111-111111111111',
      phone_number: '+50661223344',
      name: 'Supermercado El Sol',
      tax_id: '3-102-445566',
      email: 'proveedores@elsol.cr',
      address: 'Heredia Centro',
      customer_type: 'CLIENT',
      credit_limit: 100000.00,
      current_balance: 45200.00,
      assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111'
    },
    {
      id: 'd4444444-4444-4444-4444-444444444444',
      company_id: '11111111-1111-1111-1111-111111111111',
      phone_number: '+50378317101',
      name: 'Tito Belismelis',
      tax_id: '3-101-998877',
      email: 'tito.belismelis@empresa.com',
      address: 'San Salvador, El Salvador',
      customer_type: 'CLIENT',
      credit_limit: 50000.00,
      current_balance: 0.00,
      assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111'
    }
  ],
  stages: [
    { id: 'e1111111-1111-1111-1111-111111111111', company_id: '11111111-1111-1111-1111-111111111111', name: 'Nuevo Lead', order_index: 1, color: '#94A3B8' },
    { id: 'e2222222-2222-2222-2222-222222222222', company_id: '11111111-1111-1111-1111-111111111111', name: 'Primer contacto', order_index: 2, color: '#3B82F6' },
    { id: 'e3333333-3333-3333-3333-333333333333', company_id: '11111111-1111-1111-1111-111111111111', name: 'Interesado', order_index: 3, color: '#06B6D4' },
    { id: 'e4444444-4444-4444-4444-444444444444', company_id: '11111111-1111-1111-1111-111111111111', name: 'Cotización', order_index: 4, color: '#F59E0B' },
    { id: 'e5555555-5555-5555-5555-555555555555', company_id: '11111111-1111-1111-1111-111111111111', name: 'Negociación', order_index: 5, color: '#8B5CF6' },
    { id: 'e6666666-6666-6666-6666-666666666666', company_id: '11111111-1111-1111-1111-111111111111', name: 'Pedido', order_index: 6, color: '#EC4899' },
    { id: 'e7777777-7777-7777-7777-777777777777', company_id: '11111111-1111-1111-1111-111111111111', name: 'Facturación en Sucursal', order_index: 7, color: '#10B981' },
    { id: 'e7777778-7777-7777-7777-777777777778', company_id: '11111111-1111-1111-1111-111111111111', name: 'Facturación a Domicilio', order_index: 8, color: '#8B5CF6' },
    { id: 'e8888888-8888-8888-8888-888888888888', company_id: '11111111-1111-1111-1111-111111111111', name: 'Despacho en Sucursal', order_index: 9, color: '#059669' },
    { id: 'e8888889-8888-8888-8888-888888888889', company_id: '11111111-1111-1111-1111-111111111111', name: 'Despacho a Domicilio', order_index: 10, color: '#0EA5E9' },
    { id: 'e9999999-9999-9999-9999-999999999999', company_id: '11111111-1111-1111-1111-111111111111', name: 'Seguimiento', order_index: 11, color: '#6366F1' },
    { id: 'e1010101-1010-1010-1010-101010101010', company_id: '11111111-1111-1111-1111-111111111111', name: 'Cliente frecuente', order_index: 10, color: '#14B8A6' },
    { id: 'e1110111-1111-1111-1111-111111111111', company_id: '11111111-1111-1111-1111-111111111111', name: 'Cliente perdido', order_index: 11, color: '#EF4444' }
  ],
  deals: [
    { id: 'f1111111-1111-1111-1111-111111111111', company_id: '11111111-1111-1111-1111-111111111111', customer_id: 'd1111111-1111-1111-1111-111111111111', stage_id: 'e4444444-4444-4444-4444-444444444444', assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111', title: 'Pedido Alimentos Trimestral', expected_value: 8500.00, status: 'OPEN' },
    { id: 'f2222222-2222-2222-2222-222222222222', company_id: '11111111-1111-1111-1111-111111111111', customer_id: 'd2222222-2222-2222-2222-222222222222', stage_id: 'e2222222-2222-2222-2222-222222222222', assigned_sales_rep_id: 'c2222222-2222-2222-2222-222222222222', title: 'Consulta Precio Detergentes', expected_value: 450.00, status: 'OPEN' },
    { id: 'f3333333-3333-3333-3333-333333333333', company_id: '11111111-1111-1111-1111-111111111111', customer_id: 'd3333333-3333-3333-3333-333333333333', stage_id: 'e7777777-7777-7777-7777-777777777777', assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111', title: 'Lote Bebidas Enero', expected_value: 15200.00, status: 'WON' }
  ],
  conversations: [
    {
      id: 'conv-1111-1111-1111-111111111111',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd1111111-1111-1111-1111-111111111111',
      assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111',
      wa_conversation_id: 'waconv_889911',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      tags: ['Cotización', 'Frecuente'],
      last_message_at: new Date().toISOString()
    },
    {
      id: 'conv-2222-2222-2222-222222222222',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd2222222-2222-2222-2222-222222222222',
      assigned_sales_rep_id: 'c2222222-2222-2222-2222-222222222222',
      wa_conversation_id: 'waconv_778899',
      status: 'AI_BOT',
      priority: 'MEDIUM',
      tags: ['Nuevo Lead', 'Bot'],
      last_message_at: new Date().toISOString()
    },
    {
      id: 'conv-3333-3333-3333-333333333333',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd4444444-4444-4444-4444-444444444444',
      assigned_sales_rep_id: 'c1111111-1111-1111-1111-111111111111',
      wa_conversation_id: 'waconv_333333',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      tags: ['Cotización', 'Frecuente'],
      last_message_at: new Date().toISOString()
    }
  ],
  messages: [
    {
      id: 'm1111111-1111-1111-1111-111111111111',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      wa_message_id: 'wamid.HBgLMTUwNjc3MDExMjIzMxUCAB4A',
      sender_type: 'CUSTOMER',
      sender_name: 'Distribuidora Los Laureles',
      message_type: 'TEXT',
      content: 'Hola Carlos, requiero cotización formal de 100 cajas de Aceite 1L y 50 sacos de Arroz 5kg. ¿Tienen disponible?',
      delivery_status: 'READ',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'm2222222-2222-2222-2222-222222222222',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      wa_message_id: 'wamid.HBgLMTUwNjc3MDExMjIzMxUCAB4B',
      sender_type: 'AGENT',
      sender_name: 'Carlos Mendoza',
      message_type: 'TEXT',
      content: 'Hola Don Fernando, con mucho gusto. Ya le generé la cotización N° COT-2026-0044 desde el ERP. En un momento se la adjunto en PDF.',
      delivery_status: 'DELIVERED',
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'm3333333-3333-3333-3333-333333333333',
      conversation_id: 'conv-2222-2222-2222-222222222222',
      wa_message_id: 'wamid.HBgLMTUwNjc3MDk5ODg3NxUCAB4C',
      sender_type: 'CUSTOMER',
      sender_name: 'María Fernanda Rojas',
      message_type: 'TEXT',
      content: 'Hola, me gustaría saber el PRECIO del Detergente Multiuso de 3kg por favor.',
      delivery_status: 'READ',
      created_at: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'm4444444-4444-4444-4444-444444444444',
      conversation_id: 'conv-2222-2222-2222-222222222222',
      wa_message_id: 'wamid.HBgLMTUwNjc3MDk5ODg3NxUCAB4D',
      sender_type: 'AI',
      sender_name: 'Asistente IA Antigravity',
      message_type: 'TEXT',
      content: '📦 *Consulta de Precios e Inventario*\nHola María Fernanda! El Detergente Multiuso 3kg (SKU: PROD-DET-3KG) tiene un valor de **$8.90** por unidad. Contamos con 120 unidades disponibles. ¿Deseas que preparemos tu pedido?',
      delivery_status: 'SENT',
      created_at: new Date(Date.now() - 450000).toISOString()
    }
  ],
  products: [
    { id: 'p1111111-1111-1111-1111-111111111111', company_id: '11111111-1111-1111-1111-111111111111', sku: 'PROD-ACEITE-1L', name: 'Aceite Vegetal 1 Litro Premium', description: 'Aceite de soya refinado para cocina', category: 'Alimentos', price: 3.50, stock_qty: 450, unit_of_measure: 'UNIDAD' },
    { id: 'p2222222-2222-2222-2222-222222222222', company_id: '11111111-1111-1111-1111-111111111111', sku: 'PROD-ARROZ-5KG', name: 'Arroz Grano Entero 5kg 99%', description: 'Arroz blanco de primera calidad', category: 'Alimentos', price: 6.20, stock_qty: 230, unit_of_measure: 'SACO' },
    { id: 'p3333333-3333-3333-3333-333333333333', company_id: '11111111-1111-1111-1111-111111111111', sku: 'PROD-DET-3KG', name: 'Detergente Multiuso 3kg', description: 'Detergente en polvo ultra blanqueador', category: 'Limpieza', price: 8.90, stock_qty: 120, unit_of_measure: 'BOLSA' },
    { id: 'p4444444-4444-4444-4444-444444444444', company_id: '11111111-1111-1111-1111-111111111111', sku: 'PROD-BEBIDA-2L', name: 'Refresco Gaseoso 2.25L Pack 6', description: 'Pack de 6 unidades sabor Cola', category: 'Bebidas', price: 11.50, stock_qty: 95, unit_of_measure: 'PACK' }
  ],
  rules: [
    {
      id: 'r1111111-1111-1111-1111-111111111111',
      company_id: '11111111-1111-1111-1111-111111111111',
      name: 'Respuesta de Precios e Inventario',
      trigger_keyword: 'PRECIO',
      match_type: 'CONTAINS',
      action_type: 'QUERY_INVENTORY',
      action_config: { reply_template: '📦 *Consulta de Precios e Inventario*\nEstimado cliente, adjuntamos la disponibilidad actual de nuestro catálogo de productos.' },
      is_active: true
    },
    {
      id: 'r2222222-2222-2222-2222-222222222222',
      company_id: '11111111-1111-1111-1111-111111111111',
      name: 'Búsqueda de Factura Electrónica',
      trigger_keyword: 'FACTURA',
      match_type: 'CONTAINS',
      action_type: 'SEND_INVOICE_PDF',
      action_config: { reply_template: '🧾 *Búsqueda de Factura*\nHemos localizado su última factura procesada en el ERP. Descárguela en formato PDF adjunto.' },
      is_active: true
    },
    {
      id: 'r3333333-3333-3333-3333-333333333333',
      company_id: '11111111-1111-1111-1111-111111111111',
      name: 'Consulta de Estado de Despacho',
      trigger_keyword: 'ESTADO',
      match_type: 'CONTAINS',
      action_type: 'QUERY_LOGISTICS',
      action_config: { reply_template: '🚚 *Estado del Pedido*\nSu orden se encuentra actualmente en estado: *EN RUTA DE ENTREGA*.' },
      is_active: true
    }
  ],
  erpDocuments: [
    {
      id: 'doc-101',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd1111111-1111-1111-1111-111111111111',
      doc_type: 'QUOTE',
      doc_number: 'COT-2026-0044',
      subtotal: 660.00,
      tax: 85.80,
      total_amount: 745.80,
      status: 'APPROVED',
      pdf_url: 'https://erp.comercial.com/docs/COT-2026-0044.pdf',
      items: [
        { sku: 'PROD-ACEITE-1L', name: 'Aceite Vegetal 1L', price: 3.50, qty: 100, line_total: 350.00 },
        { sku: 'PROD-ARROZ-5KG', name: 'Arroz 5kg', price: 6.20, qty: 50, line_total: 310.00 }
      ],
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  auditLogs: [
    {
      id: 'a-101',
      company_id: '11111111-1111-1111-1111-111111111111',
      user_name: 'Carlos Mendoza',
      action: 'CREATE_QUOTE',
      resource: 'ERP_DOCUMENT',
      details: { doc_number: 'COT-2026-0044', total: 745.80 },
      created_at: new Date().toISOString()
    }
  ]
};

// PostgreSQL pool instance
export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
});
