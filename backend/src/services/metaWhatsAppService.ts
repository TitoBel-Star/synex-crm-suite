import { ENV } from '../config/env';
import { memoryDb } from '../db/database';
import { crmService } from './crmService';
import { automationEngine } from './automationEngine';
import { aiAssistantService } from './aiAssistantService';

export interface IncomingMetaWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'sticker' | 'interactive';
          text?: { body: string };
          image?: { id: string; mime_type: string; caption?: string; sha256?: string };
          audio?: { id: string; mime_type: string };
          video?: { id: string; mime_type: string; caption?: string };
          document?: { id: string; mime_type: string; filename?: string; caption?: string };
          location?: { latitude: number; longitude: number; name?: string; address?: string };
          sticker?: { id: string; mime_type: string };
        }>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export class MetaWhatsAppService {
  /**
   * Verified Meta Webhook Handshake (hub.verify_token)
   */
  public verifyWebhook(mode: string | undefined, token: string | undefined, challenge: string | undefined): string | null {
    if (mode === 'subscribe' && token === ENV.WEBHOOK_VERIFY_TOKEN) {
      return challenge || 'OK';
    }
    return null;
  }

  /**
   * Process Incoming Webhook Notifications from Meta Cloud API
   */
  public async processWebhook(body: IncomingMetaWebhookPayload): Promise<void> {
    if (body.object !== 'whatsapp_business_account') return;

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;
        const phoneNumberId = value.metadata.phone_number_id;

        // Find company config matching phone number ID
        const config = memoryDb.configs.find(c => c.phone_number_id === phoneNumberId) || memoryDb.configs[0];
        const companyId = config.company_id;

        // Handle Status updates (Sent, Delivered, Read, Failed)
        if (value.statuses && value.statuses.length > 0) {
          for (const statusObj of value.statuses) {
            const msg = memoryDb.messages.find(m => m.wa_message_id === statusObj.id);
            if (msg) {
              msg.delivery_status = statusObj.status.toUpperCase();
            }
          }
        }

        // Handle Incoming Messages
        if (value.messages && value.messages.length > 0) {
          for (const rawMsg of value.messages) {
            const customerPhone = '+' + rawMsg.from;
            const profileName = value.contacts && value.contacts[0] ? value.contacts[0].profile.name : 'Cliente WhatsApp';

            // 1. CRM: Auto-register customer/lead if new
            const customer = await crmService.getOrCreateCustomer(companyId, customerPhone, profileName);

            // 2. Find or Create Conversation
            let conversation = memoryDb.conversations.find(c => c.customer_id === customer.id && c.status !== 'CLOSED');
            if (!conversation) {
              conversation = {
                id: 'conv-' + Date.now(),
                company_id: companyId,
                customer_id: customer.id,
                assigned_sales_rep_id: customer.assigned_sales_rep_id,
                wa_conversation_id: 'waconv_' + rawMsg.from,
                status: 'AI_BOT',
                priority: 'MEDIUM',
                tags: ['Nuevo Lead'],
                last_message_at: new Date().toISOString()
              };
              memoryDb.conversations.unshift(conversation);
            }

            // Extract content and media info
            let contentText = '';
            let mediaUrl = '';
            let mimeType = '';
            let lat: number | undefined;
            let lng: number | undefined;

            switch (rawMsg.type) {
              case 'text':
                contentText = rawMsg.text?.body || '';
                break;
              case 'image':
                contentText = rawMsg.image?.caption || '📷 [Imagen recibida]';
                mediaUrl = `https://graph.facebook.com/v19.0/${rawMsg.image?.id}`;
                mimeType = rawMsg.image?.mime_type || 'image/jpeg';
                break;
              case 'audio':
                contentText = '🎙️ [Nota de voz recibida]';
                mediaUrl = `https://graph.facebook.com/v19.0/${rawMsg.audio?.id}`;
                mimeType = rawMsg.audio?.mime_type || 'audio/ogg';
                break;
              case 'video':
                contentText = rawMsg.video?.caption || '🎥 [Video recibido]';
                mediaUrl = `https://graph.facebook.com/v19.0/${rawMsg.video?.id}`;
                mimeType = rawMsg.video?.mime_type || 'video/mp4';
                break;
              case 'document':
                contentText = rawMsg.document?.caption || `📄 ${rawMsg.document?.filename || 'Documento PDF'}`;
                mediaUrl = `https://graph.facebook.com/v19.0/${rawMsg.document?.id}`;
                mimeType = rawMsg.document?.mime_type || 'application/pdf';
                break;
              case 'location':
                contentText = `📍 Ubicación: ${rawMsg.location?.name || ''} (${rawMsg.location?.latitude}, ${rawMsg.location?.longitude})`;
                lat = rawMsg.location?.latitude;
                lng = rawMsg.location?.longitude;
                break;
              case 'sticker':
                contentText = '🎨 [Sticker recibido]';
                mediaUrl = `https://graph.facebook.com/v19.0/${rawMsg.sticker?.id}`;
                mimeType = rawMsg.sticker?.mime_type || 'image/webp';
                break;
              default:
                contentText = `[Mensaje de tipo ${rawMsg.type}]`;
            }

            // Save Message to DB
            const newMsg = {
              id: 'm-' + Date.now(),
              conversation_id: conversation.id,
              wa_message_id: rawMsg.id,
              sender_type: 'CUSTOMER',
              sender_name: customer.name,
              message_type: rawMsg.type.toUpperCase(),
              content: contentText,
              media_url: mediaUrl,
              media_mime_type: mimeType,
              location_latitude: lat,
              location_longitude: lng,
              delivery_status: 'READ',
              created_at: new Date().toISOString()
            };
            memoryDb.messages.push(newMsg);
            conversation.last_message_at = new Date().toISOString();

            // 3. Automation Engine Trigger Check
            const ruleHandled = await automationEngine.evaluateMessage(companyId, conversation, newMsg);

            // 4. AI Assistant Response if not handled by exact rule and conversation is in AI_BOT mode
            if (!ruleHandled && conversation.status === 'AI_BOT') {
              await aiAssistantService.handleIncomingMessage(companyId, conversation, newMsg, customer);
            }
          }
        }
      }
    }
  }

  /**
   * Send WhatsApp Message via Meta Cloud API
   */
  public async sendMessage(
    conversationId: string,
    senderType: 'AGENT' | 'SYSTEM' | 'AI',
    senderName: string,
    messageType: string,
    content: string,
    mediaUrl?: string
  ): Promise<any> {
    const conv = memoryDb.conversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversación no encontrada');

    const customer = memoryDb.customers.find(c => c.id === conv.customer_id);
    if (!customer) throw new Error('Cliente no encontrado');

    const waMsgId = 'wamid.out_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    const newMsg = {
      id: 'm-' + Date.now(),
      conversation_id: conversationId,
      wa_message_id: waMsgId,
      sender_type: senderType,
      sender_name: senderName,
      message_type: messageType,
      content,
      media_url: mediaUrl,
      delivery_status: 'SENT',
      created_at: new Date().toISOString()
    };

    memoryDb.messages.push(newMsg);
    conv.last_message_at = new Date().toISOString();

    const token = ENV.WHATSAPP_TOKEN;
    const phoneId = ENV.WHATSAPP_PHONE_NUMBER_ID;

    if (token && phoneId && customer.phone_number) {
      try {
        const cleanPhone = customer.phone_number.replace(/[^0-9]/g, '');
        console.log(`[Meta Cloud API Live Request] Sending to ${cleanPhone} via Meta Graph API...`);
        const metaRes = await fetch(`https://graph.facebook.com/${ENV.META_API_VERSION}/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
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
        const metaData: any = await metaRes.json();
        console.log('[Meta Cloud API Response]', metaData);
        if (metaData && metaData.error) {
          throw new Error(`${metaData.error.message}`);
        }

      } catch (err: any) {
        console.error('[Meta Cloud API Error]', err);
        throw err;
      }
    } else {
      console.log(`[Meta Cloud API Outgoing Sandbox] To ${customer.phone_number}: "${content}"`);
    }

    return newMsg;
  }
}

export const metaWhatsAppService = new MetaWhatsAppService();
