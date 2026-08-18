import { Request, Response } from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ProcessMiningController {
  public getSample(req: Request, res: Response): void {
    try {
      const samplePath = path.join(__dirname, '../services/crm_event_log.csv');
      if (!fs.existsSync(samplePath)) {
        res.status(404).json({ success: false, error: 'Archivo de ejemplo no encontrado. Asegúrate de haber generado el archivo crm_event_log.csv.' });
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

      // Generate a temporary filename
      const tempFilename = `temp_${uuidv4()}.csv`;
      const tempPath = path.join(__dirname, tempFilename);

      // Write CSV raw content to temporary file
      fs.writeFileSync(tempPath, csvData, 'utf8');

      // Resolve paths
      const rootDir = path.resolve(__dirname, '../../..');
      const venvPythonPath = path.join(rootDir, 'backend/venv/Scripts/python.exe');
      const pythonExec = fs.existsSync(venvPythonPath) ? venvPythonPath : 'python';
      
      const scriptPath = path.join(__dirname, '../services/process_miner.py');

      // Arguments
      const args = [
        scriptPath,
        tempPath,
        caseIdColumn || 'case_id',
        activityColumn || 'activity',
        timestampColumn || 'timestamp',
        (dependencyThreshold ?? 0.5).toString(),
        (loopTwoThreshold ?? 0.5).toString()
      ];

      // Spawn process
      const child = spawn(pythonExec, args);

      let stdoutData = '';
      let stderrData = '';

      child.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      child.on('close', (code) => {
        // Clean up temp file
        try {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        } catch (unlinkErr) {
          console.error('Error cleaning up temp file:', unlinkErr);
        }

        if (code !== 0) {
          res.status(500).json({ 
            success: false, 
            error: `El proceso de Python terminó con código de error ${code}`, 
            details: stderrData 
          });
          return;
        }

        try {
          // Parse JSON from stdout (ignoring pm4py welcome banner)
          const jsonStart = stdoutData.indexOf('{"nodes":');
          if (jsonStart === -1) {
            res.status(500).json({ 
              success: false, 
              error: 'No se pudo extraer la salida JSON estructurada del script de Python', 
              stdout: stdoutData,
              stderr: stderrData 
            });
            return;
          }

          const jsonStr = stdoutData.substring(jsonStart);
          const parsedData = JSON.parse(jsonStr);
          
          res.json({ success: true, data: parsedData });
        } catch (jsonErr: any) {
          res.status(500).json({ 
            success: false, 
            error: 'Error al procesar la salida estructurada de la minería', 
            details: jsonErr.message, 
            stdout: stdoutData 
          });
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const processMiningController = new ProcessMiningController();
