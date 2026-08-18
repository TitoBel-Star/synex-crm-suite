import { memoryDb } from '../db/database';
import { erpService } from './erpService';
import { metaWhatsAppService } from './metaWhatsAppService';

export class AIAssistantService {
  /**
   * Process incoming customer messages via AI logic
   */
  public async handleIncomingMessage(companyId: string, conversation: any, message: any, customer: any): Promise<void> {
    const text = message.content.toLowerCase();

    // 1. Escalation check
    if (text.includes('humano') || text.includes('asesor') || text.includes('agente') || text.includes('queja') || text.includes('hablar con alguien')) {
      conversation.status = 'IN_PROGRESS';
      conversation.priority = 'HIGH';
      if (!conversation.tags.includes('Escalado IA')) conversation.tags.push('Escalado IA');

      await metaWhatsAppService.sendMessage(
        conversation.id,
        'AI',
        'Asistente IA Antigravity',
        'TEXT',
        '🤖 -> 👨‍💼 *Escalado Automático*\nHermano/Estimado cliente, he transferido tu chat a nuestro equipo de asesores comerciales. En unos momentos uno de nuestros ejecutivos te atenderá personalmente.'
      );
      return;
    }

    // 2. Intent recognition & Tool execution

    // Intent: Query Credit & Account Balance
    if (text.includes('credito') || text.includes('saldo') || text.includes('cuenta por cobrar') || text.includes('debo') || text.includes('estado de cuenta')) {
      const creditInfo = erpService.getCustomerCreditInfo(customer.id);
      const replyText = `💳 *Consulta de Crédito y Estado de Cuenta*\n\nEstimado cliente *${customer.name}*:\n• Línea de Crédito Autorizada: *$${creditInfo.credit_limit.toFixed(2)}*\n• Saldo Pendiente Actual: *$${creditInfo.current_balance.toFixed(2)}*\n• Crédito Disponible: *$${creditInfo.available_credit.toFixed(2)}*\n\n¿Desea solicitar un plan de pago o recibir su estado de cuenta detallado?`;

      await metaWhatsAppService.sendMessage(conversation.id, 'AI', 'Asistente IA Antigravity', 'TEXT', replyText);
      return;
    }

    // Intent: Query Specific Product / Price / Stock
    if (text.includes('precio') || text.includes('cuanto cuesta') || text.includes('stock') || text.includes('disponible') || text.includes('tienen')) {
      const products = erpService.searchInventory(companyId);
      const matchingProduct = products.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.sku.toLowerCase()) || text.includes(p.category.toLowerCase())) || products[0];

      const replyText = `🤖 *Asistente IA - Consulta de Inventario*\n\nLocalicé el siguiente producto en nuestro ERP:\n📦 *${matchingProduct.name}*\n• SKU: \`${matchingProduct.sku}\`\n• Precio Unitario: *$${matchingProduct.price.toFixed(2)}*\n• Existencia en Bodega: *${matchingProduct.stock_qty} ${matchingProduct.unit_of_measure}s*\n\n¿Te gustaría que cree un borrador de pedido en nuestro sistema?`;

      await metaWhatsAppService.sendMessage(conversation.id, 'AI', 'Asistente IA Antigravity', 'TEXT', replyText);
      return;
    }

    // Intent: Promos & Discounts
    if (text.includes('promocion') || text.includes('descuento') || text.includes('oferta')) {
      const replyText = `🎉 *Promociones Vigentes del Mes*\n\n1. *Pack Bebidas Gaseosas 2.25L*: 15% de descuento por compras superiores a 10 packs.\n2. *Aceite Vegetal 1L*: En la compra de 50 cajas recibe 5 cajas GRATIS.\n\nEscribe *PROMOCIÓN* para aplicar la oferta directamente a tu compra.`;

      await metaWhatsAppService.sendMessage(conversation.id, 'AI', 'Asistente IA Antigravity', 'TEXT', replyText);
      return;
    }

    // Default Smart FAQ Response
    const defaultFaqReply = `🤖 *Asistente Virtual Empresarial*\n\n¡Hola *${customer.name}*! Bienvenido a nuestro canal oficial.\n\nPuedo ayudarte en tiempo real con:\n1. 📦 *Precios e Inventario* (Ej: "¿Tienen Aceite?")\n2. 📄 *Facturas y Cotizaciones*\n3. 💳 *Consulta de Crédito y Saldo*\n4. 🚚 *Estado de Pedidos*\n\nO si prefieres, escribe *"Hablar con asesor"* para conectarte con un ejecutivo comercial.`;

    await metaWhatsAppService.sendMessage(conversation.id, 'AI', 'Asistente IA Antigravity', 'TEXT', defaultFaqReply);
  }
}

export const aiAssistantService = new AIAssistantService();
