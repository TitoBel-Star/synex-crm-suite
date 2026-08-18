import { erpService } from '../services/erpService';

describe('Pruebas de Capa de Integración ERP', () => {
  test('Búsqueda de inventario devuelve productos filtrados por SKU', () => {
    const products = erpService.searchInventory('11111111-1111-1111-1111-111111111111', 'PROD-ACEITE-1L');
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].sku).toBe('PROD-ACEITE-1L');
  });

  test('Consulta de crédito de cliente calcula saldo disponible', () => {
    const credit = erpService.getCustomerCreditInfo('d1111111-1111-1111-1111-111111111111');
    expect(credit.credit_limit).toBe(50000);
    expect(credit.available_credit).toBe(50000 - 12450);
  });
});
