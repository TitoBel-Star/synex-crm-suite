import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { runHeuristicMiner } from '../services/processMinerJS';

export class ProcessMiningController {
  public getSample(req: Request, res: Response): void {
    try {
      const samplePath = path.join(__dirname, '../services/crm_event_log.csv');
      if (!fs.existsSync(samplePath)) {
        res.status(404).json({ success: false, error: 'Archivo de ejemplo no encontrado. Asegurate de haber generado el archivo crm_event_log.csv.' });
        return;
      }
      const data = fs.readFileSync(samplePath, 'utf8');
      res.type('text/csv').send(data);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async analyze(req: Request, res: Response): Promise<void> {
    try {
      const {
        csvData,
        caseIdColumn,
        activityColumn,
        timestampColumn,
        dependencyThreshold,
        loopTwoThreshold
      } = req.body;

      if (!csvData) {
        res.status(400).json({ success: false, error: 'Se requiere el contenido del CSV' });
        return;
      }

      const result = runHeuristicMiner(
        csvData,
        caseIdColumn || 'case_id',
        activityColumn || 'activity',
        timestampColumn || 'timestamp',
        dependencyThreshold ?? 0.5,
        loopTwoThreshold ?? 0.5
      );

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const processMiningController = new ProcessMiningController();
