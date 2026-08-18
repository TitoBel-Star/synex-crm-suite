import { memoryDb } from '../db/database';

export class AuditService {
  public logAction(companyId: string, userName: string, action: string, resource: string, details?: any): void {
    const log = {
      id: 'audit-' + Date.now(),
      company_id: companyId,
      user_name: userName,
      action,
      resource,
      details,
      created_at: new Date().toISOString()
    };
    memoryDb.auditLogs.unshift(log);
    console.log(`[Audit Log] ${userName} -> ${action} on ${resource}`);
  }

  public getLogs(companyId: string): any[] {
    return memoryDb.auditLogs.filter(l => !l.company_id || l.company_id === companyId);
  }
}

export const auditService = new AuditService();
