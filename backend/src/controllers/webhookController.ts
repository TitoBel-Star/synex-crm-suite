import { Request, Response } from 'express';
import { metaWhatsAppService } from '../services/metaWhatsAppService';

export class WebhookController {
  /**
   * GET /api/v1/webhooks/whatsapp
   * Meta Webhook Verification Handshake
   */
  public verify(req: Request, res: Response): void {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    const result = metaWhatsAppService.verifyWebhook(mode, token, challenge);
    if (result) {
      console.log('[Meta Webhook] Verification successful!');
      res.status(200).send(result);
    } else {
      console.error('[Meta Webhook] Verification failed! Token mismatch.');
      res.status(403).send('Verification failed');
    }
  }

  /**
   * POST /api/v1/webhooks/whatsapp
   * Receives incoming messages, media, and status events from Meta Cloud API
   */
  public async handleIncoming(req: Request, res: Response): Promise<void> {
    try {
      await metaWhatsAppService.processWebhook(req.body);
      res.status(200).send('EVENT_RECEIVED');
    } catch (error: any) {
      console.error('[Meta Webhook Error]', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const webhookController = new WebhookController();
