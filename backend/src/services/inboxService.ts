import { memoryDb } from '../db/database';
import { auditService } from './auditService';

export class InboxService {
  public getConversations(companyId: string, status?: string, repId?: string, search?: string): any[] {
    let convs = memoryDb.conversations.filter(c => c.company_id === companyId);

    if (status && status !== 'ALL') {
      convs = convs.filter(c => c.status === status);
    }
    if (repId && repId !== 'ALL') {
      convs = convs.filter(c => c.assigned_sales_rep_id === repId);
    }

    // Populate customer & rep details
    return convs.map(c => {
      const customer = memoryDb.customers.find(cust => cust.id === c.customer_id);
      const rep = memoryDb.salesReps.find(r => r.id === c.assigned_sales_rep_id);
      const lastMsg = memoryDb.messages.filter(m => m.conversation_id === c.id).pop();

      return {
        ...c,
        customer_name: customer ? customer.name : 'Desconocido',
        customer_phone: customer ? customer.phone_number : '',
        customer_type: customer ? customer.customer_type : 'PROSPECT',
        assigned_rep_name: rep ? rep.name : 'Sin asignar',
        last_message_content: lastMsg ? lastMsg.content : 'Sin mensajes',
        last_message_time: lastMsg ? lastMsg.created_at : c.last_message_at
      };
    });
  }

  public getMessages(conversationId: string): any[] {
    return memoryDb.messages.filter(m => m.conversation_id === conversationId);
  }

  public transferConversation(conversationId: string, targetRepId: string, userName: string): any {
    const conv = memoryDb.conversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversación no encontrada');

    const rep = memoryDb.salesReps.find(r => r.id === targetRepId);
    if (!rep) throw new Error('Agente no encontrado');

    conv.assigned_sales_rep_id = targetRepId;
    conv.status = 'IN_PROGRESS';

    auditService.logAction(conv.company_id, userName, 'TRANSFER_CONVERSATION', 'CONVERSATION', { conversation_id: conversationId, target_rep: rep.name });
    return conv;
  }

  public addInternalNote(conversationId: string, noteText: string, userName: string): any {
    const noteMsg = {
      id: 'm-' + Date.now(),
      conversation_id: conversationId,
      wa_message_id: '',
      sender_type: 'SYSTEM',
      sender_name: userName,
      message_type: 'INTERNAL_NOTE',
      content: `📌 NOTA INTERNA (${userName}): ${noteText}`,
      delivery_status: 'READ',
      created_at: new Date().toISOString()
    };
    memoryDb.messages.push(noteMsg);
    return noteMsg;
  }
}

export const inboxService = new InboxService();
