import { Router } from 'express';
import { webhookController } from '../controllers/webhookController';
import { apiControllers } from '../controllers/apiControllers';
import { processMiningController } from '../controllers/processMiningController';

export const router = Router();

// Meta WhatsApp Webhook Handshake & Events
router.get('/webhooks/whatsapp', (req, res) => webhookController.verify(req, res));
router.post('/webhooks/whatsapp', (req, res) => webhookController.handleIncoming(req, res));

// Multi-Agent Inbox & Conversations
router.get('/conversations', (req, res) => apiControllers.getConversations(req, res));
router.get('/conversations/:id/messages', (req, res) => apiControllers.getMessages(req, res));
router.post('/conversations/:id/messages', (req, res) => apiControllers.sendMessage(req, res));
router.post('/conversations/:id/transfer', (req, res) => apiControllers.transferConversation(req, res));
router.post('/conversations/:id/notes', (req, res) => apiControllers.addInternalNote(req, res));

// CRM & Funnel
router.get('/crm/customers', (req, res) => apiControllers.getCustomers(req, res));
router.get('/crm/funnel', (req, res) => apiControllers.getFunnel(req, res));
router.put('/crm/deals/:id/stage', (req, res) => apiControllers.moveDealStage(req, res));

// ERP Integration
router.get('/erp/inventory', (req, res) => apiControllers.getInventory(req, res));
router.get('/erp/credit/:customerId', (req, res) => apiControllers.getCredit(req, res));
router.post('/erp/documents', (req, res) => apiControllers.createErpDocument(req, res));

// Automation Engine Rules
router.get('/automation/rules', (req, res) => apiControllers.getRules(req, res));
router.post('/automation/rules', (req, res) => apiControllers.createRule(req, res));

// Dashboard & Analytics
router.get('/analytics', (req, res) => apiControllers.getAnalytics(req, res));

// Process Mining Engine
router.post('/process-mining/analyze', (req, res) => processMiningController.analyze(req, res));
router.get('/process-mining/sample', (req, res) => processMiningController.getSample(req, res));

// Configuration & Audit Logs
router.get('/config', (req, res) => apiControllers.getConfig(req, res));
router.post('/config', (req, res) => apiControllers.updateConfig(req, res));
router.get('/audit', (req, res) => apiControllers.getAudit(req, res));
