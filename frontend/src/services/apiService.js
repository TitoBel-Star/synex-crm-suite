const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000/api/v1' : '/api/v1';

export const apiService = {
  // Conversations & Messages
  async getConversations(companyId = '11111111-1111-1111-1111-111111111111', status = 'ALL') {
    const res = await fetch(`${API_BASE}/conversations?companyId=${companyId}&status=${status}`);
    const json = await res.json();
    return json.data;
  },

  async getMessages(conversationId) {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
    const json = await res.json();
    return json.data;
  },

  async sendMessage(conversationId, content, senderType = 'AGENT', senderName = 'Carlos Mendoza', mediaUrl = '') {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderType, senderName, messageType: 'TEXT', content, mediaUrl })
    });
    const json = await res.json();
    return json.data;
  },

  async addInternalNote(conversationId, noteText, userName = 'Carlos Mendoza') {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteText, userName })
    });
    const json = await res.json();
    return json.data;
  },

  // CRM & Sales Funnel
  async getFunnel(companyId = '11111111-1111-1111-1111-111111111111') {
    const res = await fetch(`${API_BASE}/crm/funnel?companyId=${companyId}`);
    const json = await res.json();
    return json.data;
  },

  async moveDealStage(dealId, stageId) {
    const res = await fetch(`${API_BASE}/crm/deals/${dealId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId })
    });
    const json = await res.json();
    return json.data;
  },

  // ERP & Inventory
  async getInventory(companyId = '11111111-1111-1111-1111-111111111111') {
    const res = await fetch(`${API_BASE}/erp/inventory?companyId=${companyId}`);
    const json = await res.json();
    return json.data;
  },

  async createErpDocument(customerId, docType, items, companyId = '11111111-1111-1111-1111-111111111111') {
    const res = await fetch(`${API_BASE}/erp/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId, customerId, docType, items, userName: 'Carlos Mendoza' })
    });
    const json = await res.json();
    return json.data;
  },

  // Automation Rules
  async getRules(companyId = '11111111-1111-1111-1111-111111111111') {
    const res = await fetch(`${API_BASE}/automation/rules?companyId=${companyId}`);
    const json = await res.json();
    return json.data;
  },

  async createRule(ruleData) {
    const res = await fetch(`${API_BASE}/automation/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData)
    });
    const json = await res.json();
    return json.data;
  },

  // Analytics & Audit
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    const json = await res.json();
    return json.data;
  },

  async getAudit() {
    const res = await fetch(`${API_BASE}/audit`);
    const json = await res.json();
    return json.data;
  }
};
