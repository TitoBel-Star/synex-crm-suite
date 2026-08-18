import { metaWhatsAppService } from '../services/metaWhatsAppService';

describe('Pruebas de Webhook Meta WhatsApp Cloud API', () => {
  test('Verificación correcta de handshake hub.verify_token', () => {
    const mode = 'subscribe';
    const token = 'antigravity_webhook_secret_2026';
    const challenge = '11582019482';

    const result = metaWhatsAppService.verifyWebhook(mode, token, challenge);
    expect(result).toBe('11582019482');
  });

  test('Rechazo de handshake cuando token no coincide', () => {
    const result = metaWhatsAppService.verifyWebhook('subscribe', 'wrong_token', '123');
    expect(result).toBeNull();
  });
});
