import { memoryDb } from '../db/database';
import { erpService } from './erpService';
import { metaWhatsAppService } from './metaWhatsAppService';

export class AutomationEngine {
  /**
   * Evaluates an incoming message against active company rules
   */
  public async evaluateMessage(companyId: string, conversation: any, message: any): Promise<boolean> {
    if (!message.content) return false;

    const rules = memoryDb.rules.filter(r => r.company_id === companyId && r.is_active);
    const contentUpper = message.content.toUpperCase();

    for (const rule of rules) {
      let isMatch = false;

      if (rule.match_type === 'EXACT') {
        isMatch = contentUpper === rule.trigger_keyword.toUpperCase();
      } else if (rule.match_type === 'CONTAINS') {
        isMatch = contentUpper.includes(rule.trigger_keyword.toUpperCase());
      } else if (rule.match_type === 'REGEX') {
        try {
          const regex = new RegExp(rule.trigger_keyword, 'i');
          isMatch = regex.test(message.content);
        } catch (e) {
          isMatch = false;
        }
      }

      if (isMatch) {
        console.log(`[Automation Engine] Rule matched: "${rule.name}" for keyword "${rule.trigger_keyword}"`);
        await this.executeAction(companyId, conversation, rule, message);
        return true;
      }
    }

    return false;
  }

  /**
   * Executes the specified action without requiring code
   */
  private async executeAction(companyId: string, conversation: any, rule: any, incomingMessage: any): Promise<void> {
    const actionType = rule.action_type;
    const config = rule.action_config;

    if (actionType === 'QUERY_INVENTORY') {
      const products = erpService.searchInventory(companyId);
      let catalogText = `${config.reply_template || '📦 *Catálogo & Stock Disponibles*'}\n\n`;
      
      products.forEach(p => {
        catalogText += `• *${p.name}* (SKU: \`${p.sku}\`)\n  Precio: *$${p.price.toFixed(2)}* | Stock: *${p.stock_qty} ${p.unit_of_measure}s*\n\n`;
      });
      catalogText += `_Para solicitar un pedido escribe "Quiero comprar [SKU]"_`;

      await metaWhatsAppService.sendMessage(
        conversation.id,
        'SYSTEM',
        'Motor de Reglas Automático',
        'TEXT',
        catalogText
      );
    } else if (actionType === 'SEND_INVOICE_PDF') {
      const docs = erpService.getCustomerDocuments(conversation.customer_id, 'INVOICE');
      let responseText = '';
      let pdfUrl = '';

      if (docs.length > 0) {
        const lastDoc = docs[0];
        pdfUrl = lastDoc.pdf_url;
        responseText = `${config.reply_template || '🧾 *Factura Encontrada*'}\n\nFactura N°: *${lastDoc.doc_number}*\nMonto Total: *$${lastDoc.total_amount.toFixed(2)}*\nEstado: *${lastDoc.status}*\n📄 Link PDF: ${lastDoc.pdf_url}`;
      } else {
        responseText = `🧾 *Consulta de Factura*\nEstimado cliente, no encontramos facturas pendientes registradas bajo su número telefónico. Por favor contacte con un asesor.`;
      }

      await metaWhatsAppService.sendMessage(
        conversation.id,
        'SYSTEM',
        'Motor de Reglas Automático',
        'TEXT',
        responseText,
        pdfUrl
      );
    } else if (actionType === 'QUERY_LOGISTICS') {
      const responseText = `${config.reply_template || '🚚 *Estado de Logística & Despacho*'}\n\nSu último pedido N° *PED-2026-8812* está asignado a la ruta de entrega *R-04 (San José Central)*. Tiempo estimado de llegada: *14:30 hrs*.`;

      await metaWhatsAppService.sendMessage(
        conversation.id,
        'SYSTEM',
        'Motor de Reglas Automático',
        'TEXT',
        responseText
      );
    } else if (actionType === 'TRANSFER_QUEUE') {
      conversation.status = 'IN_PROGRESS';
      conversation.priority = 'HIGH';

      await metaWhatsAppService.sendMessage(
        conversation.id,
        'SYSTEM',
        'Motor de Reglas Automático',
        'TEXT',
        '👨‍💼 *Transferencia a Asesor*\nUn asesor humano ha sido notificado y tomará su conversación en breve.'
      );
    }
  }
}

export const automationEngine = new AutomationEngine();
