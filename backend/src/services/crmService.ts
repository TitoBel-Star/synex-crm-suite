import { memoryDb } from '../db/database';

export class CRMService {
  /**
   * Get or automatically create a customer when a new WhatsApp message arrives
   */
  public async getOrCreateCustomer(companyId: string, phoneNumber: string, name: string): Promise<any> {
    let customer = memoryDb.customers.find(c => c.company_id === companyId && c.phone_number === phoneNumber);

    if (!customer) {
      // Auto-assign Sales Rep using Round-Robin (find available rep with lowest active chats)
      const reps = memoryDb.salesReps.filter(r => r.company_id === companyId && r.status === 'ONLINE');
      let assignedRepId = reps.length > 0 ? reps[0].id : memoryDb.salesReps[0].id;
      
      if (reps.length > 1) {
        reps.sort((a, b) => a.active_chats_count - b.active_chats_count);
        assignedRepId = reps[0].id;
      }

      const assignedRep = memoryDb.salesReps.find(r => r.id === assignedRepId);
      if (assignedRep) {
        assignedRep.active_chats_count += 1;
      }

      customer = {
        id: 'd-' + Date.now(),
        company_id: companyId,
        phone_number: phoneNumber,
        name: name || 'Nuevo Contacto WA',
        tax_id: '',
        email: '',
        address: '',
        customer_type: 'LEAD',
        credit_limit: 0.00,
        current_balance: 0.00,
        assigned_sales_rep_id: assignedRepId
      };

      memoryDb.customers.unshift(customer);

      // Auto-create initial Deal in Funnel Stage 1 ("Nuevo Lead")
      const newLeadStage = memoryDb.stages.find(s => s.company_id === companyId && s.order_index === 1) || memoryDb.stages[0];
      const newDeal = {
        id: 'f-' + Date.now(),
        company_id: companyId,
        customer_id: customer.id,
        stage_id: newLeadStage.id,
        assigned_sales_rep_id: assignedRepId,
        title: `Prospecto: ${customer.name}`,
        expected_value: 0.00,
        status: 'OPEN'
      };
      memoryDb.deals.unshift(newDeal);
    }

    return customer;
  }

  /**
   * Move Deal to new Funnel Stage
   */
  public async moveDealStage(dealId: string, stageId: string): Promise<any> {
    const deal: any = memoryDb.deals.find(d => d.id === dealId);
    if (!deal) throw new Error('Trato no encontrado');

    const stage = memoryDb.stages.find(s => s.id === stageId);
    if (!stage) throw new Error('Etapa del embudo no encontrada');

    deal.stage_id = stageId;
    deal.updated_at = new Date().toISOString();

    // Auto-update customer type if moved to Facturado / Cliente Frecuente
    if (stage.name === 'Facturado' || stage.name === 'Cliente frecuente') {
      const customer = memoryDb.customers.find(c => c.id === deal.customer_id);
      if (customer) customer.customer_type = 'CLIENT';
    }

    return deal;
  }
}

export const crmService = new CRMService();

