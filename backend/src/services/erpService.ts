import { memoryDb } from '../db/database';
import { auditService } from './auditService';

export interface DocumentItemInput {
  sku: string;
  qty: number;
}

export class ERPService {
  /**
   * Query product inventory stock and prices
   */
  public searchInventory(companyId: string, query?: string): any[] {
    let products = memoryDb.products.filter(p => p.company_id === companyId);

    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return products;
  }

  /**
   * Check customer credit limit, current balance, and available credit
   */
  public getCustomerCreditInfo(customerId: string): any {
    const customer = memoryDb.customers.find(c => c.id === customerId);
    if (!customer) throw new Error('Cliente no encontrado');

    const availableCredit = Math.max(0, customer.credit_limit - customer.current_balance);

    return {
      customer_id: customer.id,
      customer_name: customer.name,
      credit_limit: customer.credit_limit,
      current_balance: customer.current_balance,
      available_credit: availableCredit,
      has_credit_available: availableCredit > 0 || customer.credit_limit === 0
    };
  }

  /**
   * Create ERP Document (QUOTE, ORDER, INVOICE)
   */
  public createDocument(
    companyId: string,
    customerId: string,
    docType: 'QUOTE' | 'ORDER' | 'INVOICE',
    itemsInput: DocumentItemInput[],
    userName: string = 'Sistema ERP'
  ): any {
    const customer = memoryDb.customers.find(c => c.id === customerId);
    if (!customer) throw new Error('Cliente no encontrado');

    const processedItems: any[] = [];
    let subtotal = 0;

    for (const item of itemsInput) {
      const product = memoryDb.products.find(p => p.company_id === companyId && p.sku === item.sku);
      if (!product) throw new Error(`Producto con SKU ${item.sku} no existe`);

      if (docType === 'INVOICE' || docType === 'ORDER') {
        if (product.stock_qty < item.qty) {
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock_qty}, Solicitado: ${item.qty}`);
        }
        // Deduct inventory
        product.stock_qty -= item.qty;
      }

      const lineTotal = product.price * item.qty;
      subtotal += lineTotal;

      processedItems.push({
        sku: product.sku,
        name: product.name,
        price: product.price,
        qty: item.qty,
        line_total: lineTotal
      });
    }

    const tax = subtotal * 0.13; // 13% Tax
    const totalAmount = subtotal + tax;

    const prefix = docType === 'QUOTE' ? 'COT' : docType === 'ORDER' ? 'PED' : 'FAC';
    const docNumber = `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDoc = {
      id: 'doc-' + Date.now(),
      company_id: companyId,
      customer_id: customerId,
      doc_type: docType,
      doc_number: docNumber,
      subtotal,
      tax,
      total_amount: totalAmount,
      status: docType === 'INVOICE' ? 'INVOICED' : 'PENDING',
      pdf_url: `https://erp.comercial.com/docs/${docNumber}.pdf`,
      items: processedItems,
      created_at: new Date().toISOString()
    };

    memoryDb.erpDocuments.unshift(newDoc);

    // If Invoice created, update customer balance
    if (docType === 'INVOICE') {
      customer.current_balance += totalAmount;
    }

    auditService.logAction(companyId, userName, `CREATE_${docType}`, 'ERP_DOCUMENT', { doc_number: docNumber, total: totalAmount });

    return newDoc;
  }

  /**
   * Find invoices or orders for a customer
   */
  public getCustomerDocuments(customerId: string, docType?: string): any[] {
    let docs = memoryDb.erpDocuments.filter(d => d.customer_id === customerId);
    if (docType) {
      docs = docs.filter(d => d.doc_type === docType);
    }
    return docs;
  }
}

export const erpService = new ERPService();
