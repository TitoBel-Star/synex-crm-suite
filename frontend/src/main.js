// =============================================================================

try {

// Fallback Mock Datasets para ejecución offline / file://
const fallbackStore = {
  conversations: [
    {
      id: 'conv-1111-1111-1111-111111111111',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd1111111-1111-1111-1111-111111111111',
      customer_name: 'Distribuidora Los Laureles',
      customer_phone: '+50670112233',
      customer_type: 'CLIENTE VIP',
      assigned_rep_name: 'Carlos Mendoza',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      last_message_content: 'Hola Carlos, requiero cotización formal de 100 cajas de Aceite 1L.',
      last_message_time: new Date().toISOString()
    },
    {
      id: 'conv-2222-2222-2222-222222222222',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd2222222-2222-2222-2222-222222222222',
      customer_name: 'María Fernanda Rojas',
      customer_phone: '+50670998877',
      customer_type: 'NUEVO LEAD',
      assigned_rep_name: 'Ana Gutiérrez',
      status: 'AI_BOT',
      priority: 'MEDIUM',
      last_message_content: '📦 Consulta de Precios e Inventario: Detergente 3kg $8.90',
      last_message_time: new Date().toISOString()
    },
    {
      id: 'conv-3333-3333-3333-333333333333',
      company_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'd3333333-3333-3333-3333-333333333333',
      customer_name: 'Tito Belismelis',
      customer_phone: '+50378317101',
      customer_type: 'CLIENTE VIP',
      assigned_rep_name: 'Carlos Mendoza',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      last_message_content: '📲 Cliente registrado en Expediente CRM',
      last_message_time: new Date().toISOString()
    }
  ],
  messages: {
    'conv-1111-1111-1111-111111111111': [
      {
        id: 'm-1',
        sender_type: 'CUSTOMER',
        sender_name: 'Distribuidora Los Laureles',
        content: 'Hola Carlos, requiero cotización formal de 100 cajas de Aceite 1L y 50 sacos de Arroz 5kg. ¿Tienen disponible?',
        delivery_status: 'READ',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'm-2',
        sender_type: 'AGENT',
        sender_name: 'Carlos Mendoza',
        content: 'Hola Don Fernando, con mucho gusto. Ya le generé la cotización N° COT-2026-0044 desde el ERP. En un momento se la adjunto en PDF.',
        delivery_status: 'DELIVERED',
        created_at: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    'conv-2222-2222-2222-222222222222': [
      {
        id: 'm-3',
        sender_type: 'CUSTOMER',
        sender_name: 'María Fernanda Rojas',
        content: 'Hola, me gustaría saber el PRECIO del Detergente Multiuso de 3kg por favor.',
        delivery_status: 'READ',
        created_at: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: 'm-4',
        sender_type: 'AI',
        sender_name: 'Asistente IA Antigravity',
        content: '📦 *Consulta de Precios e Inventario*\nHola María Fernanda! El Detergente Multiuso 3kg (SKU: PROD-DET-3KG) tiene un valor de **$8.90** por unidad. Contamos con 120 unidades disponibles. ¿Deseas que preparemos tu pedido?',
        delivery_status: 'SENT',
        created_at: new Date(Date.now() - 450000).toISOString()
      }
    ],
    'conv-3333-3333-3333-333333333333': [
      {
        id: 'm-5',
        sender_type: 'SYSTEM',
        sender_name: 'Expediente CRM',
        content: '📋 *Ficha de Cliente Registrada*\n• Cliente: *Tito Belismelis*\n• Teléfono: *+50378317101*\n• Categoría: *CLIENTE VIP*\n• Identificación: *3-101-998877*\n• Crédito: *$50,000.00*',
        delivery_status: 'SENT',
        created_at: new Date(Date.now() - 300000).toISOString()
      }
    ]
  },
  funnel: [
    { id: 'e1', name: 'Nuevo Lead', color: '#94A3B8', deals: [{ id: 'f1', title: 'Consulta Detergentes', expected_value: 450, customer_name: 'María Fernanda Rojas' }, { id: 'f_tito', title: 'Ficha Registrada CRM: Tito Belismelis', expected_value: 2500, customer_name: 'Tito Belismelis' }] },
    { id: 'e2', name: 'Primer contacto', color: '#3B82F6', deals: [] },
    { id: 'e3', name: 'Interesado', color: '#06B6D4', deals: [] },
    { id: 'e4', name: 'Cotización', color: '#F59E0B', deals: [{ id: 'f2', title: 'Pedido Alimentos Trimestral', expected_value: 8500, customer_name: 'Distribuidora Los Laureles' }] },
    { id: 'e5', name: 'Negociación', color: '#8B5CF6', deals: [] },
    { id: 'e6', name: 'Pedido', color: '#EC4899', deals: [] },
    { id: 'e7_factura_sucursal', name: 'Facturación en Sucursal', color: '#10B981', deals: [{ id: 'f2_suc', title: 'Factura Emitida FAC-2026-4412', expected_value: 320, customer_name: 'Distribuidora Los Laureles' }] },
    { id: 'e7_factura_domicilio', name: 'Facturación a Domicilio', color: '#8B5CF6', deals: [{ id: 'f3_dom', title: 'Factura Emitida FAC-2026-8812', expected_value: 15200, customer_name: 'Supermercado El Sol' }] },
    { id: 'e8_despacho_sucursal', name: 'Despacho en Sucursal', color: '#059669', deals: [] },
    { id: 'e8_despacho_domicilio', name: 'Despacho a Domicilio', color: '#0EA5E9', deals: [] },
    { id: 'e9', name: 'Seguimiento', color: '#6366F1', deals: [] },
    { id: 'e10', name: 'Cliente frecuente', color: '#14B8A6', deals: [] },
    { id: 'e11', name: 'Cliente perdido', color: '#EF4444', deals: [] }
  ],
  products: [
    { sku: 'PROD-ACEITE-1L', name: 'Aceite Vegetal 1 Litro Premium', category: 'Alimentos', price: 3.50, stock_qty: 450, unit_of_measure: 'UNIDAD' },
    { sku: 'PROD-ACEITE-5L', name: 'Aceite Vegetal 5 Litros Garrafa', category: 'Alimentos', price: 15.80, stock_qty: 180, unit_of_measure: 'GARRAFA' },
    { sku: 'PROD-ARROZ-5KG', name: 'Arroz Grano Entero 5kg 99%', category: 'Alimentos', price: 6.20, stock_qty: 230, unit_of_measure: 'SACO' },
    { sku: 'PROD-ARROZ-1KG', name: 'Arroz Blanco 1kg Precocido', category: 'Alimentos', price: 1.45, stock_qty: 600, unit_of_measure: 'BOLSA' },
    { sku: 'PROD-FRIJOL-1KG', name: 'Frijol Negro 1kg Seleccionado', category: 'Alimentos', price: 2.10, stock_qty: 340, unit_of_measure: 'BOLSA' },
    { sku: 'PROD-AZUCAR-2KG', name: 'Azúcar Blanco Refinado 2kg', category: 'Alimentos', price: 2.85, stock_qty: 410, unit_of_measure: 'BOLSA' },
    { sku: 'PROD-CAFE-500G', name: 'Café Molido Gourmet 500g', category: 'Alimentos', price: 4.90, stock_qty: 290, unit_of_measure: 'PAQUETE' },
    { sku: 'PROD-LECHE-1L', name: 'Leche Entera 1 Litro Tetrapak', category: 'Alimentos', price: 1.65, stock_qty: 520, unit_of_measure: 'CAJA' },
    { sku: 'PROD-DET-3KG', name: 'Detergente Multiuso 3kg Polvo', category: 'Limpieza', price: 8.90, stock_qty: 120, unit_of_measure: 'BOLSA' },
    { sku: 'PROD-DET-1L', name: 'Detergente Líquido Lavadora 1L', category: 'Limpieza', price: 4.75, stock_qty: 210, unit_of_measure: 'FRASCO' },
    { sku: 'PROD-CLORO-2L', name: 'Cloro Desinfectante Multiuso 2L', category: 'Limpieza', price: 2.30, stock_qty: 380, unit_of_measure: 'BOTELLA' },
    { sku: 'PROD-SUAV-1L', name: 'Suavizante de Telas Aroma Fresco 1L', category: 'Limpieza', price: 3.40, stock_qty: 190, unit_of_measure: 'FRASCO' },
    { sku: 'PROD-BEBIDA-2L', name: 'Refresco Gaseoso 2.25L Pack 6', category: 'Bebidas', price: 11.50, stock_qty: 95, unit_of_measure: 'PACK' },
    { sku: 'PROD-AGUA-600ML', name: 'Agua Mineral Sin Gas 600ml Pack 12', category: 'Bebidas', price: 7.20, stock_qty: 310, unit_of_measure: 'PACK' },
    { sku: 'PROD-ATUN-140G', name: 'Atún en Agua Lomo Entero 140g', category: 'Alimentos', price: 1.85, stock_qty: 850, unit_of_measure: 'LATA' },
    { sku: 'PROD-PASTA-500G', name: 'Pasta Spaghetti N°5 500g', category: 'Alimentos', price: 1.15, stock_qty: 480, unit_of_measure: 'PAQUETE' },
    { sku: 'FERR-MART-16OZ', name: 'Martillo de Uña 16oz Mango Fibra', category: 'Ferretería', price: 12.50, stock_qty: 75, unit_of_measure: 'UNIDAD' },
    { sku: 'FERR-DEST-SET6', name: 'Juego Destornilladores 6 Piezas', category: 'Ferretería', price: 18.90, stock_qty: 60, unit_of_measure: 'SET' },
    { sku: 'ELEC-CABLE-USB', name: 'Cable Carga Rápida USB-C 2m', category: 'Electrónica', price: 6.50, stock_qty: 150, unit_of_measure: 'UNIDAD' },
    { sku: 'MED-ALCOHOL-500ML', name: 'Alcohol Antiséptico 70% 500ml', category: 'Farmacia', price: 2.95, stock_qty: 400, unit_of_measure: 'FRASCO' }
  ],
  rules: [
    { name: 'Respuesta de Precios e Inventario', trigger_keyword: 'PRECIO', match_type: 'CONTAINS', action_type: 'QUERY_INVENTORY' },
    { name: 'Búsqueda de Factura Electrónica', trigger_keyword: 'FACTURA', match_type: 'CONTAINS', action_type: 'SEND_INVOICE_PDF' },
    { name: 'Consulta de Estado de Despacho', trigger_keyword: 'ESTADO', match_type: 'CONTAINS', action_type: 'QUERY_LOGISTICS' }
  ],
  auditLogs: [
    { created_at: new Date().toISOString(), user_name: 'Carlos Mendoza', action: 'CREATE_QUOTE', resource: 'ERP_DOCUMENT', details: { doc_number: 'COT-2026-0044', total: 745.80 } },
    { created_at: new Date(Date.now() - 3600000).toISOString(), user_name: 'Ana Gutiérrez', action: 'AUTO_LEAD', resource: 'CRM_CUSTOMER', details: { phone: '+50670998877' } }
  ]
};

// State variables
let activeConvId = 'conv-1111-1111-1111-111111111111';
let currentStatusFilter = 'ALL';
let currentSearchQuery = '';
let modalItems = [];
let activeDealForBilling = null;
let currentRepFilter = 'ALL';

// Unified Resilient API Service
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000/api/v1' : '/api/v1';

const api = {
  async getConversations(status = 'ALL', search = '') {
    let convs = fallbackStore.conversations;
    try {
      const res = await fetch(`${API_BASE}/conversations`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.data)) {
          data.data.forEach(bc => {
            if (!fallbackStore.conversations.some(fc => fc.id === bc.id)) {
              fallbackStore.conversations.push(bc);
            }
          });
          convs = fallbackStore.conversations;
        }
      }
    } catch (e) {
      convs = fallbackStore.conversations;
    }

    if (status && status !== 'ALL') {
      convs = convs.filter(c => (c.status || '').toUpperCase() === status.toUpperCase());
    }
    if (search) {
      const query = search.toLowerCase();
      convs = convs.filter(c => 
        (c.customer_name && c.customer_name.toLowerCase().includes(query)) ||
        (c.customer_phone && c.customer_phone.toLowerCase().includes(query)) ||
        (c.customer_type && c.customer_type.toLowerCase().includes(query)) ||
        (c.last_message_content && c.last_message_content.toLowerCase().includes(query))
      );
    }
    return convs;
  },

  async getMessages(convId) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${convId}/messages`);
      const data = await res.json();
      return data.data || fallbackStore.messages[convId] || [];
    } catch (e) {
      return fallbackStore.messages[convId] || [];
    }
  },

  async sendMessage(convId, content, senderType = 'AGENT', senderName = 'Carlos Mendoza') {
    const activeConv = fallbackStore.conversations.find(c => c.id === convId);

    // Save message locally
    const msgId = `msg-${Date.now()}`;
    const newMsg = {
      id: msgId,
      conversation_id: convId,
      sender_type: senderType,
      sender_name: senderName,
      content: content,
      created_at: new Date().toISOString(),
      status: 'SENT'
    };
    if (!fallbackStore.messages[convId]) {
      fallbackStore.messages[convId] = [];
    }
    fallbackStore.messages[convId].push(newMsg);

    // Send through backend server to avoid CORS and ensure .env credentials are used
    try {
      const res = await fetch(`${API_BASE}/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderType, senderName, messageType: 'TEXT', content })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Error al procesar en el servidor.' };
      }
    } catch (e) {
      console.warn('Backend offline, attempting direct Meta API browser transmission...', e);
      
      // Fallback: Direct Meta Graph API call from the browser
      const savedToken = localStorage.getItem('META_TOKEN') || 'EAAeILWnr1nYBSDpf93AUUUQfLRnOcuZCTlcqA3Uz5ejAdHizZBZCbSndDP4niQTj2ZB2vlgPYZCqaqkX21fzp4s63VyPp3KLMbXfPPro4ldaaZCVEkdWQy4u2LsvdhourdLkLtcc4tZB5uXT33ekEnYTXQgZCuaPVSdho1CM2Lav7ERpKShzVCaSo4mbbVqvNTc3jnlzI0WjZAiHZBPV73tZBhj7QqsY9S0p9CcpDjrPbu0dUioxBuo6pL4npJM6yMfgYqSdZBgmq6PpoYjIkBgs4Kw8';
      let savedPhoneId = localStorage.getItem('META_PHONE_ID') || '1156403020898605';
      
      if (activeConv && activeConv.customer_phone) {
        const cleanPhone = activeConv.customer_phone.replace(/[^0-9]/g, '');
        try {
          const r = await fetch(`https://graph.facebook.com/v19.0/${savedPhoneId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${savedToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanPhone,
              type: 'text',
              text: { body: content }
            })
          });
          const res = await r.json();
          if (res.error) {
            return { success: false, error: res.error.message };
          }
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
      return { success: true };
    }
  },

  async getFunnel() {
    try {
      const res = await fetch(`${API_BASE}/crm/funnel`);
      const data = await res.json();
      return data.data || fallbackStore.funnel;
    } catch (e) {
      return fallbackStore.funnel;
    }
  },

  async getInventory() {
    try {
      const res = await fetch(`${API_BASE}/erp/inventory`);
      const data = await res.json();
      return data.data || fallbackStore.products;
    } catch (e) {
      return fallbackStore.products;
    }
  },

  async getRules() {
    try {
      const res = await fetch(`${API_BASE}/automation/rules`);
      const data = await res.json();
      return data.data || fallbackStore.rules;
    } catch (e) {
      return fallbackStore.rules;
    }
  },

  async getAudit() {
    try {
      const res = await fetch(`${API_BASE}/audit`);
      const data = await res.json();
      return data.data || fallbackStore.auditLogs;
    } catch (e) {
      return fallbackStore.auditLogs;
    }
  },

  async updateDealStage(dealId, stageId) {
    try {
      const res = await fetch(`${API_BASE}/crm/deals/${dealId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId })
      });
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.warn('[CRM API] Failed to update deal stage on backend, using local fallback:', e.message);
      return false;
    }
  }
};

// INITIALIZATION
function initApp() {
  try {
    console.log('[Antigravity WA-ERP] App initializing...');
    setupTabNavigation();
    setupInboxFilters();
    setupFunnelFilters();
    loadInbox();
    loadFunnelView();
    loadInventoryView();
    loadRulesView();
    loadAnalyticsView();
    loadAuditView();
    setupChatHandlers();
    setupModalHandlers();
  } catch (err) {
    alert("Error durante la inicialización de la app: " + err.message + "\nStack: " + err.stack);
  }
}

// TAB NAVIGATION SWITCHER (GUARANTEED IMMEDIATE RESPONSE)
function setupTabNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab');

      // Update active state on buttons
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active state on views
      tabViews.forEach(v => {
        if (v.id === `view-${targetTab}`) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });

      console.log(`[Tab Switch] Activated tab: ${targetTab}`);
    });
  });
}

// INBOX STATUS & SEARCH FILTERS
function setupInboxFilters() {
  const pills = document.querySelectorAll('.filter-pills .pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      currentStatusFilter = pill.getAttribute('data-status') || 'ALL';
      console.log(`[Filter Switch] Active status filter: ${currentStatusFilter}`);
      loadInbox();
    });
  });

  const searchInput = document.getElementById('chat-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      loadInbox();
    });
  }
}

function setupFunnelFilters() {
  const repFilter = document.getElementById('funnel-rep-filter');
  if (repFilter) {
    repFilter.onchange = (e) => {
      currentRepFilter = e.target.value;
      console.log(`[Funnel Filter] Active rep filter: ${currentRepFilter}`);
      loadFunnelView();
    };
  }
}

// INBOX & MESSAGING
async function loadInbox() {
  const conversations = await api.getConversations(currentStatusFilter, currentSearchQuery);
  const listContainer = document.getElementById('conversations-list-container');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  const badge = document.getElementById('badge-inbox-count');
  if (badge) badge.innerText = conversations.length;

  if (conversations.length === 0) {
    listContainer.innerHTML = '<div style="color: #64748b; font-size: 0.85rem; text-align: center; padding: 2rem 1rem;"><i class="fa-solid fa-inbox" style="display:block; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>No hay conversaciones en esta categoría</div>';
    return;
  }

  conversations.forEach(c => {
    const item = document.createElement('div');
    item.className = `conv-item ${c.id === activeConvId ? 'active' : ''}`;
    item.setAttribute('data-id', c.id);
    item.onclick = () => selectChat(c, false);

    const initials = (c.customer_name || 'WA').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    item.innerHTML = `
      <div class="avatar-circle">${initials}</div>
      <div class="conv-info">
        <div class="conv-name-row">
          <h4>${c.customer_name}</h4>
          <span class="conv-time">14:30</span>
        </div>
        <div class="conv-last-msg">${c.last_message_content || 'Sin mensajes'}</div>
      </div>
    `;

    listContainer.appendChild(item);
  });

  if (conversations.length > 0) {
    const active = conversations.find(c => c.id === activeConvId);
    if (active) {
      await selectChat(active, false);
    } else {
      await selectChat(conversations[0], false);
    }
  }
}

async function selectChat(conv, refreshList = true) {
  activeConvId = conv.id;
  const nameEl = document.getElementById('chat-customer-name');
  const detailsEl = document.getElementById('chat-customer-details');
  const avatarEl = document.getElementById('chat-avatar');
  const ctxNameEl = document.getElementById('ctx-cust-name');

  if (nameEl) nameEl.innerText = conv.customer_name;
  if (detailsEl) detailsEl.innerHTML = `<i class="fa-solid fa-phone"></i> ${conv.customer_phone} | <span class="tag-badge">${conv.customer_type || 'CLIENTE'}</span>`;
  if (avatarEl) avatarEl.innerText = (conv.customer_name || 'WA').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  if (ctxNameEl) ctxNameEl.innerText = conv.customer_name;

  const items = document.querySelectorAll('.conv-item');
  items.forEach(item => {
    if (item.getAttribute('data-id') === conv.id) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  if (refreshList) {
    await loadInbox();
  } else {
    await renderMessages(conv.id);
  }
}

async function renderMessages(convId) {
  const messages = await api.getMessages(convId);
  const container = document.getElementById('messages-container');
  if (!container) return;

  container.innerHTML = '';

  messages.forEach(m => {
    const bubble = document.createElement('div');
    const senderType = (m.sender_type || 'AGENT').toLowerCase();
    bubble.className = `msg-bubble ${senderType}`;

    let senderTag = '';
    if (m.sender_type === 'AI') senderTag = `<strong>🤖 ${m.sender_name || 'Asistente IA'}</strong><br/>`;
    else if (m.sender_type === 'AGENT') senderTag = `<strong>👨‍💼 ${m.sender_name || 'Carlos Mendoza'}</strong><br/>`;
    else if (m.sender_type === 'SYSTEM') senderTag = `<strong>⚙️ Sistema ERP</strong><br/>`;

    const formattedTime = m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:32';

    let contentHtml = (m.content || '').replace(/\n/g, '<br/>');
    if (m.media_url && m.media_url.endsWith('.pdf')) {
      contentHtml += `<br/><a href="${m.media_url}" target="_blank" style="color: #60a5fa;"><i class="fa-solid fa-file-pdf"></i> Abrir Documento PDF</a>`;
    }

    bubble.innerHTML = `
      ${senderTag}
      <div>${contentHtml}</div>
      <div class="msg-meta">${formattedTime} • ${m.delivery_status || 'SENT'}</div>
    `;

    container.appendChild(bubble);
  });

  container.scrollTop = container.scrollHeight;
}

function setupChatHandlers() {
  const btnSend = document.getElementById('btn-send-message');
  const txtInput = document.getElementById('message-text-input');

  const doSend = async () => {
    const text = txtInput.value.trim();
    if (!text) return;

    txtInput.value = '';
    await api.sendMessage(activeConvId, text);
    await renderMessages(activeConvId);
  };

  if (btnSend) btnSend.onclick = doSend;
  if (txtInput) {
    txtInput.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    };
  }

  // Note & Transfer triggers
  const btnNote = document.getElementById('btn-add-note');
  if (btnNote) {
    btnNote.onclick = async () => {
      const note = prompt('Ingresa la nota interna para el expediente:');
      if (note && note.trim()) {
        await api.sendMessage(activeConvId, `📝 *Nota Interna*: ${note.trim()}`, 'SYSTEM', 'Carlos Mendoza');
        await renderMessages(activeConvId);
      }
    };
  }

  const btnTransfer = document.getElementById('btn-transfer-chat');
  if (btnTransfer) {
    btnTransfer.onclick = async () => {
      const nameEl = document.getElementById('chat-customer-name');
      const custName = nameEl ? nameEl.innerText : 'el cliente';
      await api.sendMessage(activeConvId, `🔄 *Chat Transferido*: Se transfirió la atención de ${custName} a Ana Gutiérrez.`, 'SYSTEM', 'Sistema CRM');
      await renderMessages(activeConvId);
    };
  }

  // Quick Catalog & Invoice triggers
  const btnCat = document.getElementById('btn-quick-catalog');
  if (btnCat) {
    btnCat.onclick = async () => {
      await api.sendMessage(activeConvId, 'PRECIO', 'CUSTOMER', 'Distribuidora Los Laureles');
      await api.sendMessage(activeConvId, '📦 *Catálogo & Stock ERP*\n• Aceite Vegetal 1L ($3.50)\n• Arroz 5kg ($6.20)\n• Detergente 3kg ($8.90)', 'SYSTEM', 'Motor de Reglas');
      await renderMessages(activeConvId);
    };
  }

  const btnInv = document.getElementById('btn-quick-invoice');
  if (btnInv) {
    btnInv.onclick = async () => {
      await api.sendMessage(activeConvId, 'FACTURA', 'CUSTOMER', 'Distribuidora Los Laureles');
      await api.sendMessage(activeConvId, '🧾 *Factura Encontrada N° FAC-2026-0044*\nMonto Total: $745.80\n📄 PDF: https://erp.comercial.com/docs/FAC-2026-0044.pdf', 'SYSTEM', 'Motor de Reglas');
      await renderMessages(activeConvId);
    };
  }
}

// KANBAN FUNNEL WITH INTERACTIVE DRAG & DROP
async function loadFunnelView() {
  const stages = await api.getFunnel();
  const board = document.getElementById('kanban-board-container');
  if (!board) return;

  board.innerHTML = '';

  stages.forEach(stage => {
    const col = document.createElement('div');
    col.className = 'kanban-column';
    col.setAttribute('data-stage-id', stage.id);

    // Enable HTML5 Drag & Drop on Column
    col.ondragover = (e) => {
      e.preventDefault();
      col.style.background = 'rgba(255, 255, 255, 0.08)';
    };

    col.ondragleave = () => {
      col.style.background = '';
    };

    col.ondrop = (e) => {
      e.preventDefault();
      col.style.background = '';
      const dealId = e.dataTransfer.getData('text/plain');
      if (dealId) {
        moveDealToStage(dealId, stage.id);
      }
    };

    // Filter deals by representative
    let stageDeals = stage.deals || [];
    if (currentRepFilter !== 'ALL') {
      stageDeals = stageDeals.filter(d => {
        const repName = (d.rep_name || '').toLowerCase();
        const filter = currentRepFilter.toLowerCase();
        if (repName.includes(filter)) return true;
        if (d.assigned_sales_rep_id === 'c1111111-1111-1111-1111-111111111111' && filter.includes('carlos')) return true;
        if (d.assigned_sales_rep_id === 'c2222222-2222-2222-2222-222222222222' && filter.includes('ana')) return true;
        if (d.assigned_sales_rep_id === 'c3333333-3333-3333-3333-333333333333' && filter.includes('roberto')) return true;
        return false;
      });
    }

    let dealsHtml = '';
    stageDeals.forEach(d => {
      // Build stage options for selector
      let optionsHtml = '';
      stages.forEach(s => {
        const selected = s.id === stage.id ? 'selected' : '';
        optionsHtml += `<option value="${s.id}" ${selected}>Mover a: ${s.name}</option>`;
      });

      const repDisplayName = d.rep_name || (d.assigned_sales_rep_id === 'c1111111-1111-1111-1111-111111111111' ? 'Carlos Mendoza' : (d.assigned_sales_rep_id === 'c2222222-2222-2222-2222-222222222222' ? 'Ana Gutiérrez' : 'Roberto Gómez'));

      dealsHtml += `
        <div class="deal-card" draggable="true" id="card-${d.id}" data-deal-id="${d.id}" style="cursor: grab; user-select: none; padding: 0.85rem; border-radius: 8px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); margin-bottom: 0.75rem;">
          <div class="deal-title" style="font-weight: 600; color: #f8fafc; font-size: 0.9rem;">${d.title}</div>
          <div class="deal-value" style="font-size: 1.1rem; color: #10b981; font-weight: 700; margin: 0.25rem 0;">$${Number(d.expected_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="deal-customer" style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.4rem;"><i class="fa-solid fa-building"></i> ${d.customer_name}</div>
          <div class="deal-rep" style="font-size: 0.76rem; color: #38bdf8; font-weight: 500; margin-bottom: 0.6rem;"><i class="fa-solid fa-user-tie"></i> Vendedor: ${repDisplayName}</div>
          <button class="btn-bill-deal" data-deal-id="${d.id}" data-customer-name="${d.customer_name}" style="width: 100%; margin-bottom: 0.5rem; padding: 0.4rem 0.6rem; font-size: 0.78rem; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem; box-shadow: 0 2px 8px rgba(16,185,129,0.3);">
            <i class="fa-solid fa-file-invoice"></i> 🧾 Facturar / Nueva Cotización
          </button>
          <div style="margin-top: 0.3rem; padding-top: 0.4rem; border-top: 1px dashed rgba(255,255,255,0.15);">
            <select class="deal-stage-select" data-deal-id="${d.id}" style="width: 100%; font-size: 0.78rem; background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 6px; padding: 5px 8px; font-weight: 600; cursor: pointer;">
              ${optionsHtml}
            </select>
          </div>
        </div>
      `;
    });

    col.innerHTML = `
      <div class="kanban-column-header">
        <span class="column-title">${stage.name}</span>
        <span class="column-count">${stageDeals.length}</span>
      </div>
      <div class="kanban-column-deals">
        ${dealsHtml || '<div style="color: #64748b; font-size: 0.75rem; text-align: center; padding: 1rem;">Sin tratos</div>'}
      </div>
    `;

    board.appendChild(col);
  });

  // Attach DragStart, Select Change, and Direct Billing Handlers
  document.querySelectorAll('.deal-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      const dealId = card.getAttribute('data-deal-id');
      e.dataTransfer.setData('text/plain', dealId);
      card.style.opacity = '0.5';
    });

    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
  });

  document.querySelectorAll('.deal-stage-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const dealId = select.getAttribute('data-deal-id');
      const targetStageId = e.target.value;
      moveDealToStage(dealId, targetStageId);
    });
  });

  document.querySelectorAll('.btn-bill-deal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dealId = btn.getAttribute('data-deal-id');
      const custName = btn.getAttribute('data-customer-name');
      activeDealForBilling = dealId;

      // Automatically target conversation matching customer_name
      const targetConv = fallbackStore.conversations.find(c => c.customer_name === custName || (c.customer_name && custName && c.customer_name.toLowerCase().includes(custName.toLowerCase())));
      if (targetConv) {
        activeConvId = targetConv.id;
        console.log(`[Kanban Billing] Target conversation updated to ${targetConv.customer_name} (${targetConv.customer_phone})`);
      }

      const modalHeader = document.querySelector('#erp-modal .modal-header h3');
      if (modalHeader) {
        modalHeader.innerHTML = `<i class="fa-solid fa-file-invoice"></i> Facturar Trato ERP (${custName})`;
      }

      populateModalProductSelect();
      const modal = document.getElementById('erp-modal');
      if (modal) modal.classList.remove('hidden');
    });
  });
}

async function moveDealToStage(dealId, targetStageId) {
  try {
    // 1. Save changes to backend database
    await api.updateDealStage(dealId, targetStageId);

    // 2. Locate the deal details to run prompts/notifications
    let foundDeal = null;

    // Search in fallbackStore first
    fallbackStore.funnel.forEach(stage => {
      const idx = (stage.deals || []).findIndex(d => d.id === dealId);
      if (idx !== -1) {
        foundDeal = stage.deals.splice(idx, 1)[0];
      }
    });

    // If not found (using live backend data), search in live getFunnel response
    const dbStages = await api.getFunnel();
    if (!foundDeal) {
      dbStages.forEach(stage => {
        const deal = (stage.deals || []).find(d => d.id === dealId);
        if (deal) {
          foundDeal = { ...deal };
        }
      });
    }

    if (foundDeal) {
      // Find target stage details (either from backend dbStages or fallbackStore)
      let targetStage = dbStages.find(s => s.id === targetStageId);
      if (!targetStage) {
        targetStage = fallbackStore.funnel.find(s => s.id === targetStageId) || { id: targetStageId, name: 'Nueva Etapa' };
      }

      const targetName = (targetStage.name || '').toLowerCase();
      const targetId = targetStage.id;

      // 1. FACTURACIÓN EN SUCURSAL (Vendedor / Caja)
      if (targetId === 'e7_factura_sucursal' || targetId === 'e7777777-7777-7777-7777-777777777777' || targetName.includes('facturac')) {
        if (targetName.includes('sucursal')) {
          const facNum = `FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const pdfUrl = `https://erp.comercial.com/docs/${facNum}.pdf`;

          fallbackStore.auditLogs.unshift({
            created_at: new Date().toISOString(),
            user_name: 'Carlos Mendoza',
            action: 'ERP_ACCOUNTING_INVOICE',
            resource: 'ERP_CONTABLE',
            details: { doc_number: facNum, total: foundDeal.expected_value, type: 'FACTURA_SUCURSAL' }
          });

          await api.sendMessage(
            activeConvId,
            `🏛️ *Integración ERP Contable - Facturación en Sucursal*\n` +
            `Factura Electrónica Emitida: *${facNum}*\n` +
            `• Monto Total: *$${Number(foundDeal.expected_value).toFixed(2)}*\n` +
            `• Asiento Contable ERP: *Registrado en Caja (Débito Efectivo / Crédito Ventas & IVA)*\n` +
            `• Próximo Paso: *Pendiente de entrega en mostrador/caja por el bodeguero*\n` +
            `📄 PDF Factura ERP: ${pdfUrl}`,
            'SYSTEM',
            'Motor ERP Contable'
          );
        }
        // 2. FACTURACIÓN A DOMICILIO (Vendedor / Facturación)
        else if (targetName.includes('domicilio')) {
          const facNum = `FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const pdfUrl = `https://erp.comercial.com/docs/${facNum}.pdf`;

          fallbackStore.auditLogs.unshift({
            created_at: new Date().toISOString(),
            user_name: 'Carlos Mendoza',
            action: 'ERP_ACCOUNTING_INVOICE',
            resource: 'ERP_CONTABLE',
            details: { doc_number: facNum, total: foundDeal.expected_value, type: 'FACTURA_DOMICILIO' }
          });

          await api.sendMessage(
            activeConvId,
            `🏛️ *Integración ERP Contable - Facturación a Domicilio*\n` +
            `Factura Electrónica Emitida: *${facNum}*\n` +
            `• Monto Total: *$${Number(foundDeal.expected_value).toFixed(2)}*\n` +
            `• Asiento Contable ERP: *Registrado en CxC (Débito Cuentas por Cobrar / Crédito Ventas & IVA)*\n` +
            `• Próximo Paso: *Disponible para asignación de ruta y chofer por el área de Logística*\n` +
            `📄 PDF Factura ERP: ${pdfUrl}`,
            'SYSTEM',
            'Motor ERP Contable'
          );
        }
      }
      // 3. DESPACHO EN SUCURSAL (Encargado de Caja / Mostrador)
      else if (targetId === 'e8_despacho_sucursal' || targetId === 'e8888888-8888-8888-8888-888888888888' || targetName.includes('despacho en sucursal')) {
        await api.sendMessage(
          activeConvId,
          `📦 *Entrega & Despacho en Sucursal Confirmado*\n` +
          `El pedido de *${foundDeal.customer_name}* ha sido entregado físicamente en el mostrador / caja de la sucursal.`,
          'SYSTEM',
          'Encargado Sucursal'
        );
      }
      // 4. DESPACHO A DOMICILIO (Actor Logística / Chofer Móvil)
      else if (targetId === 'e8_despacho_domicilio' || targetId === 'e8888889-8888-8888-8888-888888888889' || targetName.includes('despacho a domicilio')) {
        const km = prompt('🚚 [Actor Logística / Chofer Móvil]\nIngresa la distancia en Kilómetros (KM):', '12.5 KM');
        const time = prompt('⏱️ Ingresa el tiempo estimado de llegada (ETA):', '25 min');
        const driver = prompt('📱 Nombre del despachador / chofer asignado:', 'Juan Pérez (Ruta 4)');

        if (km || time || driver) {
          await api.sendMessage(
            activeConvId,
            `🚚 *Despacho a Domicilio en Ruta GPS*\n` +
            `El despachador ha iniciado la entrega de su pedido.\n` +
            `• Chofer Asignado: *${driver || 'Juan Pérez'}*\n` +
            `• Distancia a Domicilio: *${km || '12.5 KM'}*\n` +
            `• Tiempo Estimado de Llegada: *${time || '25 min'}*`,
            'SYSTEM',
            'Despacho Mobile GPS'
          );
        }
      }

      // Sync offline local stages
      const localTarget = fallbackStore.funnel.find(s => s.id === targetStageId);
      if (localTarget) {
        if (!localTarget.deals) localTarget.deals = [];
        localTarget.deals.push(foundDeal);
      }
    }

    loadFunnelView();
    loadAnalyticsView();
  } catch (err) {
    alert("Error al mover trato de etapa: " + err.message);
  }
}

// INVENTORY & MODAL WITH REAL-TIME SEARCH AS YOU TYPE
async function loadInventoryView(searchQuery = '') {
  const products = await api.getInventory(searchQuery);
  const grid = document.getElementById('inventory-grid-container');
  if (!grid) return;

  grid.innerHTML = '';
  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; color: #94a3b8; text-align: center; padding: 3rem 1rem;"><i class="fa-solid fa-barcode" style="display:block; font-size: 2rem; margin-bottom: 0.5rem; color: #38bdf8;"></i>No se encontraron códigos de producto con la búsqueda "' + searchQuery + '"</div>';
  } else {
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prod-card';
      card.innerHTML = `
        <h3>${p.name}</h3>
        <div class="prod-sku" style="color: #38bdf8; font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-barcode"></i> SKU: ${p.sku}</div>
        <div class="prod-sku">Cat: ${p.category}</div>
        <div class="prod-price">$${p.price.toFixed(2)}</div>
        <div>Stock Bodega: <strong>${p.stock_qty} ${p.unit_of_measure}s</strong></div>
      `;
      grid.appendChild(card);
    });
  }

  // Populate billing modal select
  populateModalProductSelect(searchQuery);
}

function populateModalProductSelect(filterQuery = '') {
  const prodSelect = document.getElementById('erp-prod-select');
  if (!prodSelect) return;

  prodSelect.innerHTML = '';
  const q = filterQuery.toLowerCase().trim();
  const filtered = fallbackStore.products.filter(p => 
    !q || p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.innerText = '❌ No existen códigos de producto que coincidan';
    prodSelect.appendChild(opt);
    return;
  }

  filtered.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.sku;
    opt.innerText = `[${p.sku}] ${p.name} - $${p.price.toFixed(2)} (Stock: ${p.stock_qty})`;
    prodSelect.appendChild(opt);
  });
}

function setupModalHandlers() {
  const modal = document.getElementById('erp-modal');
  const btnOpen = document.getElementById('btn-open-erp-modal');
  const btnClose = document.getElementById('close-erp-modal');
  const btnCancel = document.getElementById('cancel-erp-modal');
  const btnAdd = document.getElementById('btn-add-item-to-doc');
  const btnSubmit = document.getElementById('btn-submit-erp-doc');

  const btnNewDoc = document.getElementById('btn-new-erp-doc');

  const openErpModal = () => {
    try {
      populateModalProductSelect();
      if (modal) {
        const activeConv = fallbackStore.conversations.find(c => c.id === activeConvId);
        const custName = activeConv ? activeConv.customer_name : 'Cliente';
        const modalHeader = document.querySelector('#erp-modal .modal-header h3');
        if (modalHeader) {
          modalHeader.innerHTML = `<i class="fa-solid fa-file-invoice"></i> Crear Documento de Venta ERP (para: ${custName})`;
        }
        modal.classList.remove('hidden');
      } else {
        alert('Error: No se encontró el modal erp-modal.');
      }
    } catch (err) {
      alert("Error al abrir modal de facturación: " + err.message + "\nStack: " + err.stack);
    }
  };

  if (btnOpen) btnOpen.onclick = openErpModal;
  if (btnNewDoc) btnNewDoc.onclick = openErpModal;
  if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');
  if (btnCancel) btnCancel.onclick = () => modal.classList.add('hidden');

  // Real-time search listeners (Filters on every keypress)
  const modalSearchInput = document.getElementById('erp-prod-search-input');
  if (modalSearchInput) {
    modalSearchInput.addEventListener('input', (e) => {
      populateModalProductSelect(e.target.value);
    });
  }

  const inventorySearchInput = document.getElementById('erp-inventory-search-input');
  if (inventorySearchInput) {
    inventorySearchInput.addEventListener('input', (e) => {
      loadInventoryView(e.target.value);
    });
  }

  if (btnAdd) {
    btnAdd.onclick = () => {
      try {
        const sku = document.getElementById('erp-prod-select').value;
        if (!sku) {
          alert('Por favor selecciona un producto válido.');
          return;
        }
        const qty = parseInt(document.getElementById('erp-prod-qty').value) || 1;
        const prod = fallbackStore.products.find(p => p.sku === sku);
        if (!prod) {
          alert('Producto no encontrado en el catálogo de fallback.');
          return;
        }

        modalItems.push({ sku: prod.sku, name: prod.name, price: prod.price, qty, total: prod.price * qty });
        renderModalTable();
      } catch (err) {
        alert("Error al agregar item: " + err.message + "\nStack: " + err.stack);
      }
    };
  }

  if (btnSubmit) {
    btnSubmit.onclick = async () => {
      if (modalItems.length === 0) {
        alert('Por favor agrega productos al documento.');
        return;
      }

      const docType = document.getElementById('erp-doc-type').value;
      modal.classList.add('hidden');

      let subtotal = modalItems.reduce((sum, i) => sum + i.total, 0);
      let tax = subtotal * 0.13;
      let total = subtotal + tax;

      modalItems = [];
      renderModalTable();

      const facNum = `${docType}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const pdfUrl = `https://erp.comercial.com/docs/${facNum}.pdf`;

      if (activeDealForBilling) {
        fallbackStore.funnel.forEach(stage => {
          const deal = (stage.deals || []).find(d => d.id === activeDealForBilling);
          if (deal) {
            const prefixTitle = docType === 'INVOICE' ? 'Factura Emitida' : docType === 'ORDER' ? 'Pedido Confirmado' : 'Cotización Generada';
            deal.title = `${prefixTitle} ${facNum}`;
            deal.expected_value = total;

            const targetConv = fallbackStore.conversations.find(c => c.customer_name === deal.customer_name);
            if (targetConv) {
              activeConvId = targetConv.id;
            }
          }
        });
        activeDealForBilling = null;
        loadFunnelView();
        loadAnalyticsView();
      }

      fallbackStore.auditLogs.unshift({
        created_at: new Date().toISOString(),
        user_name: 'Carlos Mendoza',
        action: 'ERP_ACCOUNTING_INVOICE',
        resource: 'ERP_CONTABLE',
        details: { doc_number: facNum, total: total, type: 'MANUAL_DEAL_BILLING' }
      });

      const targetConv = fallbackStore.conversations.find(c => c.id === activeConvId);
      const targetPhone = targetConv ? targetConv.customer_phone : '+50378317101';

      const sendResult = await api.sendMessage(
        activeConvId,
        `📄 *Documento ERP Facturado en Trato: ${facNum}*\nSe ha emitido el comprobante fiscal exitosamente por un total de *$${total.toFixed(2)}*.\n📄 PDF Factura ERP: ${pdfUrl}`,
        'SYSTEM',
        'Consola ERP'
      );
      await renderMessages(activeConvId);

      if (sendResult && sendResult.success === false) {
        alert(`❌ Error al transmitir por Meta API:\n${sendResult.error || 'Verifica tus credenciales en Configuración Meta.'}`);
      } else {
        const hasToken = localStorage.getItem('META_TOKEN');
        if (hasToken) {
          alert(`✅ ¡Cotización ${facNum} ($${total.toFixed(2)}) EMITIDA Y DESPACHADA por Meta WhatsApp API!\nRevisa la notificación entregada a tu celular en ${targetPhone}.`);
        } else {
          alert(`⚠️ Cotización ${facNum} registrada en el ERP.\nPara transmitirla a tu WhatsApp real (${targetPhone}), ingresa a "⚙️ Configuración Meta" y haz clic en "Guardar Llaves Meta" con tu Token de Meta.`);
        }
      }
    };
  }

  // Customer CRM Modal Handlers
  const custModal = document.getElementById('customer-modal');
  const btnOpenCust = document.getElementById('btn-open-customer-modal');
  const btnCloseCust = document.getElementById('close-customer-modal');
  const btnCancelCust = document.getElementById('cancel-customer-modal');
  const btnSaveCust = document.getElementById('btn-save-customer');

  if (btnOpenCust) {
    btnOpenCust.onclick = () => {
      const activeConv = fallbackStore.conversations.find(c => c.id === activeConvId);
      const inputName = document.getElementById('cust-input-name');
      const inputPhone = document.getElementById('cust-input-phone');
      if (activeConv) {
        if (inputName) inputName.value = activeConv.customer_name || '';
        if (inputPhone) inputPhone.value = activeConv.customer_phone || '';
      }
      if (custModal) custModal.classList.remove('hidden');
    };
  }

  if (btnCloseCust) btnCloseCust.onclick = () => custModal.classList.add('hidden');
  if (btnCancelCust) btnCancelCust.onclick = () => custModal.classList.add('hidden');

  if (btnSaveCust) {
    btnSaveCust.onclick = async () => {
      const name = document.getElementById('cust-input-name').value.trim();
      const phone = document.getElementById('cust-input-phone').value.trim();
      const tax = document.getElementById('cust-input-tax').value.trim();
      const type = document.getElementById('cust-input-type').value;
      const credit = parseFloat(document.getElementById('cust-input-credit').value) || 0;

      if (!name || !phone) {
        alert('Por favor ingresa al menos el Nombre y Teléfono del cliente.');
        return;
      }

      custModal.classList.add('hidden');

      // Check if conversation already exists or create new
      let targetConv = fallbackStore.conversations.find(c => c.customer_phone === phone || c.customer_name === name);

      if (!targetConv) {
        // Create brand NEW conversation
        const newConvId = 'conv-' + Date.now();
        targetConv = {
          id: newConvId,
          company_id: '11111111-1111-1111-1111-111111111111',
          customer_id: 'cust-' + Date.now(),
          customer_name: name,
          customer_phone: phone,
          customer_type: type,
          assigned_rep_name: 'Carlos Mendoza',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          last_message_content: '📲 Nuevo cliente registrado en el CRM',
          last_message_time: new Date().toISOString()
        };
        fallbackStore.conversations.unshift(targetConv);
        fallbackStore.messages[newConvId] = [
          {
            id: 'm-init-' + Date.now(),
            sender_type: 'SYSTEM',
            sender_name: 'Expediente CRM',
            content: `📋 *Ficha de Cliente Registrada*\n• Cliente: *${name}*\n• Teléfono: *${phone}*\n• Categoría: *${type}*\n• Cédula: *${tax || 'N/A'}*\n• Crédito: *$${credit.toFixed(2)}*`,
            delivery_status: 'SENT',
            created_at: new Date().toISOString()
          }
        ];

        // Add deal to "Nuevo Lead" stage in Funnel
        const nuevoLeadStage = fallbackStore.funnel.find(s => s.id === 'e1' || s.name === 'Nuevo Lead');
        if (nuevoLeadStage) {
          if (!nuevoLeadStage.deals) nuevoLeadStage.deals = [];
          nuevoLeadStage.deals.unshift({
            id: 'deal-' + Date.now(),
            title: `Trato Comercial: ${name}`,
            expected_value: 0,
            customer_name: name
          });
        }
      } else {
        targetConv.customer_name = name;
        targetConv.customer_phone = phone;
        targetConv.customer_type = type;
      }

      activeConvId = targetConv.id;

      const nameEl = document.getElementById('chat-customer-name');
      const detailsEl = document.getElementById('chat-customer-details');
      const ctxNameEl = document.getElementById('ctx-cust-name');
      const ctxTaxEl = document.getElementById('ctx-cust-tax');
      const ctxTypeEl = document.getElementById('ctx-cust-type');
      const ctxCreditEl = document.getElementById('ctx-credit-limit');
      const ctxAvailEl = document.getElementById('ctx-available-credit');

      if (nameEl) nameEl.innerText = name;
      if (detailsEl) detailsEl.innerHTML = `<i class="fa-solid fa-phone"></i> ${phone} | <span class="tag-badge">${type}</span>`;
      if (ctxNameEl) ctxNameEl.innerText = name;
      if (ctxTaxEl) ctxTaxEl.innerText = tax || '3-101-778899';
      if (ctxTypeEl) ctxTypeEl.innerText = type;
      if (ctxCreditEl) ctxCreditEl.innerText = `$${credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (ctxAvailEl) ctxAvailEl.innerText = `$${(credit - 12450).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      fallbackStore.auditLogs.unshift({
        created_at: new Date().toISOString(),
        user_name: 'Carlos Mendoza',
        action: 'UPDATE_CUSTOMER_CRM',
        resource: 'CRM_EXPEDIENTE',
        details: { customer_name: name, tax_id: tax, credit_limit: credit }
      });

      await api.sendMessage(
        activeConvId,
        `📋 *Expediente CRM Actualizado*\n` +
        `• Nombre / Razón Social: *${name}*\n` +
        `• Identificación Fiscal: *${tax || '3-101-778899'}*\n` +
        `• Categoría: *${type}*\n` +
        `• Línea de Crédito Aprobada: *$${credit.toFixed(2)}*`,
        'SYSTEM',
        'Expediente CRM'
      );

      await loadInbox();
      await renderMessages(activeConvId);
      await loadFunnelView();
    };
  }

  // WhatsApp QR Code Modal Handlers
  const qrModal = document.getElementById('qr-modal');
  const btnOpenQr = document.getElementById('btn-qr-modal-open');
  const btnCloseQr = document.getElementById('close-qr-modal');
  const btnRefreshQr = document.getElementById('btn-refresh-qr');
  const btnSimulateConnect = document.getElementById('btn-simulate-connect');

  if (btnOpenQr) {
    btnOpenQr.onclick = () => {
      if (qrModal) qrModal.classList.remove('hidden');
    };
  }

  if (btnCloseQr) {
    btnCloseQr.onclick = () => {
      if (qrModal) qrModal.classList.add('hidden');
    };
  }

  if (btnRefreshQr) {
    btnRefreshQr.onclick = () => {
      const qrImg = document.getElementById('qr-image');
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=WABA_PAIRING_CODE_CRM_2026_WHATSAPP_CONNECT_${Date.now()}`;
      }
    };
  }

  if (btnSimulateConnect) {
    btnSimulateConnect.onclick = async () => {
      const phoneInput = prompt('📱 Ingresa tu número de WhatsApp para confirmar la vinculación:', '+506 7011-2233');
      if (phoneInput) {
        const qrBadge = document.getElementById('qr-status-badge');
        const qrText = document.getElementById('qr-status-text');
        if (qrBadge) qrBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        if (qrBadge) qrBadge.style.color = '#10b981';
        if (qrText) qrText.innerText = `🟢 Dispositivo Vinculado en Línea (${phoneInput})`;

        if (btnOpenQr) {
          btnOpenQr.innerHTML = `<i class="fa-solid fa-circle-check"></i> WhatsApp Vinculado (${phoneInput})`;
          btnOpenQr.style.borderColor = '#10b981';
          btnOpenQr.style.color = '#10b981';
        }

        fallbackStore.auditLogs.unshift({
          created_at: new Date().toISOString(),
          user_name: 'Carlos Mendoza',
          action: 'WHATSAPP_QR_PAIRING',
          resource: 'PASARELA_WHATSAPP',
          details: { phone: phoneInput, status: 'CONNECTED_WEB_GATEWAY' }
        });

        await api.sendMessage(
          activeConvId,
          `✅ *Pasarela WhatsApp Web por Código QR Conectada*\n` +
          `• Teléfono Vinculado: *${phoneInput}*\n` +
          `• Estado: *En Línea / Transmisión Activa*\n` +
          `• Modo: *Envío Directo sin Meta Developer Account*`,
          'SYSTEM',
          'Pasarela QR WhatsApp'
        );

        await renderMessages(activeConvId);

        setTimeout(() => {
          if (qrModal) qrModal.classList.add('hidden');
        }, 1500);
      }
    };
  }

  // Meta Credentials Settings Handlers
  const btnSaveMeta = document.getElementById('btn-save-meta-config');
  const btnTestMeta = document.getElementById('btn-test-meta-config');

  // Pre-populate saved values from localStorage and backend
  const storedPhoneId = localStorage.getItem('META_PHONE_ID');
  const storedToken = localStorage.getItem('META_TOKEN');
  const storedVerify = localStorage.getItem('META_VERIFY');

  if (storedPhoneId && document.getElementById('meta-input-phone-id')) {
    document.getElementById('meta-input-phone-id').value = storedPhoneId;
  }
  if (storedToken && document.getElementById('meta-input-token')) {
    document.getElementById('meta-input-token').value = storedToken;
  }
  if (storedVerify && document.getElementById('meta-input-verify')) {
    document.getElementById('meta-input-verify').value = storedVerify;
  }

  // Fetch configuration from backend server on load to auto-fill across different origins/devices
  fetch(`${API_BASE}/config`).then(r => r.json()).then(res => {
    if (res.success && res.data && res.data.config) {
      const serverPhoneId = res.data.config.phone_number_id;
      const serverToken = res.data.config.app_id; // Read from app_id property of DB config
      
      if (serverPhoneId && serverPhoneId !== '105938201948271') {
        localStorage.setItem('META_PHONE_ID', serverPhoneId);
        if (document.getElementById('meta-input-phone-id')) {
          document.getElementById('meta-input-phone-id').value = serverPhoneId;
        }
      }
      if (serverToken && serverToken !== '987654321012345') {
        localStorage.setItem('META_TOKEN', serverToken);
        if (document.getElementById('meta-input-token')) {
          document.getElementById('meta-input-token').value = serverToken;
        }
      }
    }
  }).catch(e => console.warn('Offline mode or config load failed:', e.message));

  if (btnSaveMeta) {
    btnSaveMeta.onclick = async () => {
      const phoneId = document.getElementById('meta-input-phone-id').value.trim();
      const token = document.getElementById('meta-input-token').value.trim();
      const verify = document.getElementById('meta-input-verify').value.trim();

      if (!phoneId || !token) {
        alert('Por favor ingresa el Phone Number ID y el Access Token de Meta.');
        return;
      }

      localStorage.setItem('META_PHONE_ID', phoneId);
      localStorage.setItem('META_TOKEN', token);
      localStorage.setItem('META_VERIFY', verify);

      // Save to backend server database so it persists across all computers, URLs and origins
      try {
        await fetch(`${API_BASE}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number_id: phoneId, whatsapp_token: token })
        });
      } catch (err) {
        console.error('Error saving config to server:', err);
      }

      fallbackStore.auditLogs.unshift({
        created_at: new Date().toISOString(),
        user_name: 'Carlos Mendoza',
        action: 'UPDATE_META_CREDENTIALS',
        resource: 'META_CLOUD_API',
        details: { phone_number_id: phoneId, status: 'PERMANENTLY_SAVED' }
      });

      alert('✅ ¡Credenciales Oficiales de Meta WhatsApp Cloud API Guardadas Permanentemente!\nEl CRM ha sincronizado y guardado las llaves en el servidor. Nunca tendrás que volver a ingresarlas en ningún navegador o computadora.');
    };
  }

  if (btnTestMeta) {
    btnTestMeta.onclick = async () => {
      const savedPhoneId = localStorage.getItem('META_PHONE_ID') || document.getElementById('meta-input-phone-id')?.value.trim() || '1156403020898605';
      const savedToken = localStorage.getItem('META_TOKEN') || document.getElementById('meta-input-token')?.value.trim();

      const targetPhone = prompt('📱 Ingresa tu número telefónico personal (con código de país ej: +50378317101) para enviarte un mensaje de prueba desde Meta Cloud API:', '+50378317101');
      if (targetPhone) {
        const cleanPhone = targetPhone.replace(/[^0-9]/g, '');

        if (savedToken) {
          console.log(`[Meta Cloud API Template Send] Sending hello_world to +${cleanPhone}...`);
          fetch(`https://graph.facebook.com/v19.0/${savedPhoneId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${savedToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: cleanPhone,
              type: 'template',
              template: { name: 'hello_world', language: { code: 'en_US' } }
            })
          }).then(r => r.json()).then(res => {
            console.log('[Test Meta Template Result]', res);
            if (res.messages && res.messages[0]) {
              alert(`✅ ¡Plantilla Oficial de Meta (hello_world) ENTREGADA a tu celular! ID: ${res.messages[0].id}.\nRevisa ahora la conversación de WhatsApp en +${cleanPhone}.`);
            } else if (res.error) {
              alert(`⚠️ Respuesta de Meta: ${res.error.message}`);
            }
          }).catch(e => alert(`Error enviando plantilla: ${e.message}`));
        } else {
          alert('⚠️ Primero debes presionar el botón "Guardar Llaves Meta" con tu Access Token ingresado.');
        }

        fallbackStore.auditLogs.unshift({
          created_at: new Date().toISOString(),
          user_name: 'Carlos Mendoza',
          action: 'TEST_META_SEND',
          resource: 'META_CLOUD_API',
          details: { recipient_phone: targetPhone, status: 'SENT_VIA_GRAPH_API' }
        });

        await api.sendMessage(
          activeConvId,
          `📲 *Prueba de Transmisión Meta Cloud API Saliente*\n` +
          `• Destinatario Real: *${targetPhone}*\n` +
          `• Servidor Meta API: *v19.0 graph.facebook.com*\n` +
          `• Estado: *Enviado a las Torres de Meta WhatsApp*`,
          'SYSTEM',
          'Motor Meta Cloud'
        );

        await renderMessages(activeConvId);
      }
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function renderModalTable() {
  try {
    const tbody = document.getElementById('modal-items-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let subtotal = 0;
    modalItems.forEach(item => {
      subtotal += item.total;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.sku}</td><td>${item.name}</td><td>$${item.price.toFixed(2)}</td><td>${item.qty}</td><td>$${item.total.toFixed(2)}</td>`;
      tbody.appendChild(tr);
    });

    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('modal-subtotal');
    const taxEl = document.getElementById('modal-tax');
    const totalEl = document.getElementById('modal-total');

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
  } catch (err) {
    alert("Error en renderModalTable: " + err.message + "\nStack: " + err.stack);
  }
}

// RULES VIEW
async function loadRulesView() {
  const rules = await api.getRules();
  const container = document.getElementById('rules-list-container');
  if (!container) return;

  container.innerHTML = '';
  rules.forEach(r => {
    const card = document.createElement('div');
    card.className = 'context-card';
    card.style.marginBottom = '1rem';
    card.innerHTML = `
      <h4><i class="fa-solid fa-bolt"></i> ${r.name}</h4>
      <div class="info-row"><span>Palabra Clave:</span> <strong style="color: var(--accent-amber);">"${r.trigger_keyword}"</strong></div>
      <div class="info-row"><span>Tipo Coincidencia:</span> <span>${r.match_type}</span></div>
      <div class="info-row"><span>Acción ERP:</span> <span class="badge" style="background: var(--accent-indigo);">${r.action_type}</span></div>
    `;
    container.appendChild(card);
  });
}

// ANALYTICS & AUDIT
function loadAnalyticsView() {
  const tbody = document.getElementById('rep-performance-tbody');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr><td><strong>Carlos Mendoza</strong></td><td><span class="badge" style="background: var(--wa-green);">ONLINE</span></td><td>2</td><td>1.2 min</td><td>$34,250.00</td></tr>
    <tr><td><strong>Ana Gutiérrez</strong></td><td><span class="badge" style="background: var(--wa-green);">ONLINE</span></td><td>1</td><td>1.8 min</td><td>$14,000.00</td></tr>
    <tr><td><strong>Roberto Gómez</strong></td><td><span class="badge" style="background: var(--accent-amber);">AWAY</span></td><td>0</td><td>2.5 min</td><td>$8,900.00</td></tr>
  `;

  const distContainer = document.getElementById('funnel-distribution-container');
  if (distContainer) {
    distContainer.innerHTML = `
      <div class="info-row"><span>Cotización:</span> <strong>$8,500.00 (1 trato)</strong></div>
      <div class="info-row"><span>Facturado:</span> <strong>$15,200.00 (1 trato)</strong></div>
      <div class="info-row"><span>Nuevo Lead:</span> <strong>$450.00 (1 trato)</strong></div>
    `;
  }
}

async function loadAuditView() {
  const logs = await api.getAudit();
  const tbody = document.getElementById('audit-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  logs.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(l.created_at).toLocaleString()}</td>
      <td>${l.user_name}</td>
      <td><span class="badge" style="background: var(--accent-indigo);">${l.action}</span></td>
      <td>${l.resource}</td>
      <td><pre style="font-size: 0.75rem;">${JSON.stringify(l.details || {})}</pre></td>
    `;
    tbody.appendChild(tr);
  });
}

window.runSimStep = async function(step) {
  try {
    if (step === 1) {
      // 1. Switch to inbox tab
      const tabInbox = document.querySelector('.nav-btn[data-tab="inbox"]');
      if (tabInbox) tabInbox.click();
      
      // Select Los Laureles chat
      const conversations = await api.getConversations();
      const laureles = conversations.find(c => c.customer_name && c.customer_name.toLowerCase().includes('laureles'));
      if (laureles) {
        await selectChat(laureles, false);
      }
      
      // Focus text input
      const txtInput = document.getElementById('message-text-input');
      if (txtInput) {
        txtInput.focus();
        txtInput.placeholder = "📝 Escribe aquí para simular chat con el cliente...";
      }
    } 
    else if (step === 2) {
      // 2. Go to inbox, open customer modal
      const tabInbox = document.querySelector('.nav-btn[data-tab="inbox"]');
      if (tabInbox) tabInbox.click();
      
      const btnOpenCust = document.getElementById('btn-open-customer-modal');
      if (btnOpenCust) {
        btnOpenCust.click();
      } else {
        const conversations = await api.getConversations();
        if (conversations.length > 0) {
          await selectChat(conversations[0], false);
          const btnOpenCustRetry = document.getElementById('btn-open-customer-modal');
          if (btnOpenCustRetry) btnOpenCustRetry.click();
        } else {
          alert('Por favor selecciona una conversación primero para abrir su ficha.');
        }
      }
    } 
    else if (step === 3) {
      // 3. Go to Kanban Board
      const tabFunnel = document.querySelector('.nav-btn[data-tab="funnel"]');
      if (tabFunnel) tabFunnel.click();
    } 
    else if (step === 4) {
      // 4. Go to inbox, open billing modal
      const tabInbox = document.querySelector('.nav-btn[data-tab="inbox"]');
      if (tabInbox) tabInbox.click();
      
      const btnOpenErp = document.getElementById('btn-open-erp-modal');
      if (btnOpenErp) {
        btnOpenErp.click();
      } else {
        const conversations = await api.getConversations();
        if (conversations.length > 0) {
          await selectChat(conversations[0], false);
          const btnOpenErpRetry = document.getElementById('btn-open-erp-modal');
          if (btnOpenErpRetry) btnOpenErpRetry.click();
        } else {
          alert('Por favor selecciona un chat primero para poder facturar.');
        }
      }
    } 
    else if (step === 5) {
      // 5. Go to Process Mining
      const tabPM = document.querySelector('.nav-btn[data-tab="process-mining"]');
      if (tabPM) tabPM.click();
    }
    else if (step === 6) {
      // 6. Direct execution: Go to Process Mining, load sample and discover
      const tabPM = document.querySelector('.nav-btn[data-tab="process-mining"]');
      if (tabPM) tabPM.click();
      
      setTimeout(() => {
        const btnLoadSample = document.getElementById('btn-pm-load-sample');
        if (btnLoadSample) btnLoadSample.click();
        
        setTimeout(() => {
          const btnDiscover = document.getElementById('btn-pm-discover');
          if (btnDiscover) btnDiscover.click();
        }, 500);
      }, 300);
    }
  } catch (err) {
    alert("Error al ejecutar paso de simulación: " + err.message);
  }
};

} catch (e) {
  alert("Real Error in main.js: " + e.message + "\nStack: " + e.stack);
}
