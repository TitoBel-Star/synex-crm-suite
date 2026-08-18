import { Request, Response } from 'express';
import { memoryDb } from '../db/database';
import { inboxService } from '../services/inboxService';
import { metaWhatsAppService } from '../services/metaWhatsAppService';
import { crmService } from '../services/crmService';
import { erpService } from '../services/erpService';
import { auditService } from '../services/auditService';
import { ENV } from '../config/env';
import fs from 'fs';
import path from 'path';

export class ApiControllers {
  // 1. CONVERSATIONS & INBOX
  public getConversations(req: Request, res: Response): void {
    const companyId = (req.query.companyId as string) || '11111111-1111-1111-1111-111111111111';
    const status = req.query.status as string;
    const repId = req.query.repId as string;
    const search = req.query.search as string;

    const list = inboxService.getConversations(companyId, status, repId, search);
    res.json({ success: true, data: list });
  }

  public getMessages(req: Request, res: Response): void {
    const conversationId = req.params.id;
    const messages = inboxService.getMessages(conversationId);
    res.json({ success: true, data: messages });
  }

  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = req.params.id;
      const { senderType, senderName, messageType, content, mediaUrl } = req.body;

      const result = await metaWhatsAppService.sendMessage(
        conversationId,
        senderType || 'AGENT',
        senderName || 'Carlos Mendoza',
        messageType || 'TEXT',
        content,
        mediaUrl
      );
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public transferConversation(req: Request, res: Response): void {
    try {
      const conversationId = req.params.id;
      const { targetRepId, userName } = req.body;

      const result = inboxService.transferConversation(conversationId, targetRepId, userName || 'Operador');
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public addInternalNote(req: Request, res: Response): void {
    try {
      const conversationId = req.params.id;
      const { noteText, userName } = req.body;

      const result = inboxService.addInternalNote(conversationId, noteText, userName || 'Operador');
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 2. CRM & FUNNEL
  public getCustomers(req: Request, res: Response): void {
    const companyId = (req.query.companyId as string) || '11111111-1111-1111-1111-111111111111';
    const customers = memoryDb.customers.filter(c => c.company_id === companyId);
    res.json({ success: true, data: customers });
  }

  public getFunnel(req: Request, res: Response): void {
    const companyId = (req.query.companyId as string) || '11111111-1111-1111-1111-111111111111';
    const stages = memoryDb.stages.filter(s => s.company_id === companyId).sort((a, b) => a.order_index - b.order_index);
    const deals = memoryDb.deals.filter(d => d.company_id === companyId);

    const funnelData = stages.map(stage => {
      const stageDeals = deals.filter(d => d.stage_id === stage.id).map(deal => {
        const customer = memoryDb.customers.find(c => c.id === deal.customer_id);
        const rep = memoryDb.salesReps.find(r => r.id === deal.assigned_sales_rep_id);
        return {
          ...deal,
          customer_name: customer ? customer.name : 'Desconocido',
          customer_phone: customer ? customer.phone_number : '',
          rep_name: rep ? rep.name : 'Sin asignar'
        };
      });

      return {
        ...stage,
        deals: stageDeals,
        total_value: stageDeals.reduce((sum, d) => sum + Number(d.expected_value), 0)
      };
    });

    res.json({ success: true, data: funnelData });
  }

  public async moveDealStage(req: Request, res: Response): Promise<void> {
    try {
      const dealId = req.params.id;
      const { stageId } = req.body;

      const updatedDeal = await crmService.moveDealStage(dealId, stageId);
      res.json({ success: true, data: updatedDeal });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 3. ERP INTEGRATION
  public getInventory(req: Request, res: Response): void {
    const companyId = (req.query.companyId as string) || '11111111-1111-1111-1111-111111111111';
    const query = req.query.q as string;

    const products = erpService.searchInventory(companyId, query);
    res.json({ success: true, data: products });
  }

  public getCredit(req: Request, res: Response): void {
    try {
      const customerId = req.params.customerId;
      const credit = erpService.getCustomerCreditInfo(customerId);
      res.json({ success: true, data: credit });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public createErpDocument(req: Request, res: Response): void {
    try {
      const { companyId, customerId, docType, items, userName } = req.body;
      const doc = erpService.createDocument(
        companyId || '11111111-1111-1111-1111-111111111111',
        customerId,
        docType,
        items,
        userName || 'Operador ERP'
      );
      res.json({ success: true, data: doc });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 4. AUTOMATION RULES
  public getRules(req: Request, res: Response): void {
    const companyId = (req.query.companyId as string) || '11111111-1111-1111-1111-111111111111';
    const rules = memoryDb.rules.filter(r => r.company_id === companyId);
    res.json({ success: true, data: rules });
  }

  public createRule(req: Request, res: Response): void {
    const { name, trigger_keyword, match_type, action_type, action_config } = req.body;

    const newRule = {
      id: 'r-' + Date.now(),
      company_id: '11111111-1111-1111-1111-111111111111',
      name,
      trigger_keyword,
      match_type: match_type || 'EXACT',
      action_type,
      action_config: action_config || {},
      is_active: true,
      created_at: new Date().toISOString()
    };

    memoryDb.rules.push(newRule);
    res.json({ success: true, data: newRule });
  }

  // 5. DASHBOARD & ANALYTICS
  public getAnalytics(req: Request, res: Response): void {
    const totalMessages = memoryDb.messages.length;
    const sentMessages = memoryDb.messages.filter(m => m.sender_type !== 'CUSTOMER').length;
    const receivedMessages = memoryDb.messages.filter(m => m.sender_type === 'CUSTOMER').length;
    const activeConversations = memoryDb.conversations.filter(c => c.status !== 'CLOSED').length;
    const leadsGenerated = memoryDb.customers.filter(c => c.customer_type === 'LEAD' || c.customer_type === 'PROSPECT').length;
    const totalSalesValue = memoryDb.erpDocuments.reduce((sum, d) => sum + d.total_amount, 0);

    const repPerformance = memoryDb.salesReps.map(rep => {
      const repConvs = memoryDb.conversations.filter(c => c.assigned_sales_rep_id === rep.id);
      return {
        id: rep.id,
        name: rep.name,
        active_chats: repConvs.length,
        avg_response_time: '1.4 min',
        status: rep.status
      };
    });

    res.json({
      success: true,
      data: {
        total_messages: totalMessages,
        sent_messages: sentMessages,
        received_messages: receivedMessages,
        active_conversations: activeConversations,
        closed_conversations: 14,
        leads_generated: leadsGenerated,
        conversion_rate: '34.8%',
        avg_response_time_seconds: 84,
        whatsapp_origin_sales: totalSalesValue,
        rep_performance: repPerformance
      }
    });
  }

  // 6. CONFIG & AUDIT
  public getConfig(req: Request, res: Response): void {
    const config = memoryDb.configs[0];
    const reps = memoryDb.salesReps;
    if (config) {
      config.phone_number_id = ENV.WHATSAPP_PHONE_NUMBER_ID;
      config.app_id = ENV.WHATSAPP_TOKEN; // Overwrite app_id with active token
    }
    res.json({ success: true, data: { config, sales_reps: reps } });
  }

  public updateConfig(req: Request, res: Response): void {
    const { phone_number_id, whatsapp_token } = req.body;
    const config = memoryDb.configs[0];
    if (config) {
      if (phone_number_id) config.phone_number_id = phone_number_id;
    }
    if (phone_number_id) ENV.WHATSAPP_PHONE_NUMBER_ID = phone_number_id;
    if (whatsapp_token) ENV.WHATSAPP_TOKEN = whatsapp_token;

    // Persist configuration permanently to backend/.env
    try {
      const envPath = path.join(__dirname, '../../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        if (phone_number_id) {
          envContent = envContent.replace(/WHATSAPP_PHONE_NUMBER_ID=.*/g, `WHATSAPP_PHONE_NUMBER_ID=${phone_number_id}`);
        }
        if (whatsapp_token) {
          envContent = envContent.replace(/WHATSAPP_TOKEN=.*/g, `WHATSAPP_TOKEN=${whatsapp_token}`);
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('[Meta Config Server] Config saved permanently to backend/.env');
      }
    } catch (err) {
      console.error('[Meta Config Server Error] Failed to save backend/.env:', err);
    }

    res.json({ success: true, message: 'Configuración de Meta guardada exitosamente en el servidor.' });
  }

  public getAudit(req: Request, res: Response): void {
    const companyId = (req.query.companyId as string) || '11111111-1111-1111-1111-111111111111';
    const logs = auditService.getLogs(companyId);
    res.json({ success: true, data: logs });
  }
}

export const apiControllers = new ApiControllers();
