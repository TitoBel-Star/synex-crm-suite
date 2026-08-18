import express from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import { router } from './routes/api';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir estáticos de la API REST
app.use('/api/v1', router);

// Servir frontend integrado en producción o dev fallback
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'WhatsApp Cloud API Enterprise Integration ERP/CRM', timestamp: new Date().toISOString() });
});

app.listen(Number(ENV.PORT), '0.0.0.0', () => {
  console.log(`=============================================================`);
  console.log(`🚀 SERVIDOR ENTERPRISE WHATSAPP ERP/CRM INICIADO EN PUERTO ${ENV.PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${ENV.PORT}/api/v1/webhooks/whatsapp`);
  console.log(`📄 Swagger OpenAPI Docs: http://localhost:${ENV.PORT}/api/v1/docs`);
  console.log(`=============================================================`);
});
