// =============================================================================

try {
let cyInstance = null;
let selectedCsvContent = null;
let latestSubmittedCsv = null;
let parsedCases = {};
let currentCasesInTable = [];
let isSampleSelected = false;

// Conformance Checking Variables
let activeDeviationFilter = null;
let activeDeviationCases = { demo: new Set(), legal: new Set(), qualification: new Set(), rework: new Set() };
let allActiveCasesBeforeDeviationFilter = new Set();

const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000/api/v1' : '/api/v1';

// Fallback CSV Data to load if backend is starting up or offline
const FALLBACK_CRM_CSV = `case_id,activity,timestamp,resource,amount,lost_reason
OPP-1001,Crear Lead,2026-07-01 09:00:00,Ana Gomez,15000,
OPP-1001,Contactar Cliente,2026-07-01 10:30:00,Ana Gomez,15000,
OPP-1001,Calificar Lead,2026-07-02 14:00:00,Ana Gomez,15000,
OPP-1001,Enviar Propuesta,2026-07-03 11:00:00,Ana Gomez,15000,
OPP-1001,Negociación,2026-07-04 16:30:00,Carlos Mendoza,15000,
OPP-1001,Cerrar Ganado,2026-07-06 10:00:00,Carlos Mendoza,15000,
OPP-1002,Crear Lead,2026-07-01 09:15:00,Luis Perez,25000,
OPP-1002,Contactar Cliente,2026-07-01 11:00:00,Luis Perez,25000,
OPP-1002,Cerrar Perdido,2026-07-02 15:30:00,Luis Perez,25000,Precio muy alto
OPP-1003,Crear Lead,2026-07-01 09:30:00,Maria Rodriguez,8000,
OPP-1003,Contactar Cliente,2026-07-01 12:00:00,Maria Rodriguez,8000,
OPP-1003,Calificar Lead,2026-07-02 16:00:00,Maria Rodriguez,8000,
OPP-1003,Agendar Demo,2026-07-03 09:30:00,Maria Rodriguez,8000,
OPP-1003,Realizar Demo,2026-07-04 14:00:00,Maria Rodriguez,8000,
OPP-1003,Enviar Propuesta,2026-07-05 10:30:00,Maria Rodriguez,8000,
OPP-1003,Negociación,2026-07-06 15:00:00,Elena Silva,8000,
OPP-1003,Cerrar Ganado,2026-07-08 11:30:00,Elena Silva,8000,
OPP-1004,Crear Lead,2026-07-01 10:00:00,Juan Martinez,18000,
OPP-1004,Contactar Cliente,2026-07-01 14:30:00,Juan Martinez,18000,
OPP-1004,Calificar Lead,2026-07-02 11:00:00,Juan Martinez,18000,
OPP-1004,Enviar Propuesta,2026-07-03 15:30:00,Juan Martinez,18000,
OPP-1004,Negociación,2026-07-04 10:00:00,Carlos Mendoza,18000,
OPP-1004,Cerrar Ganado,2026-07-06 09:30:00,Carlos Mendoza,18000,
OPP-1005,Crear Lead,2026-07-02 09:00:00,Ana Gomez,12000,
OPP-1005,Contactar Cliente,2026-07-02 11:30:00,Ana Gomez,12000,
OPP-1005,Calificar Lead,2026-07-03 14:00:00,Ana Gomez,12000,
OPP-1005,Enviar Propuesta,2026-07-04 10:30:00,Ana Gomez,12000,
OPP-1005,Cerrar Perdido,2026-07-05 16:00:00,Ana Gomez,12000,La calidad no le gusta al cliente
OPP-1006,Crear Lead,2026-07-02 10:00:00,Luis Perez,35000,
OPP-1006,Contactar Cliente,2026-07-02 15:00:00,Luis Perez,35000,
OPP-1006,Calificar Lead,2026-07-03 11:30:00,Luis Perez,35000,
OPP-1006,Agendar Demo,2026-07-04 09:00:00,Luis Perez,35000,
OPP-1006,Realizar Demo,2026-07-05 14:00:00,Luis Perez,35000,
OPP-1006,Enviar Propuesta,2026-07-06 10:30:00,Luis Perez,35000,
OPP-1006,Negociación,2026-07-07 15:00:00,Carlos Mendoza,35000,
OPP-1006,Aprobación Legal,2026-07-08 11:00:00,Abog. Ruiz,35000,
OPP-1006,Cerrar Ganado,2026-07-10 16:30:00,Carlos Mendoza,35000,
OPP-1007,Crear Lead,2026-07-03 09:00:00,Maria Rodriguez,16000,
OPP-1007,Contactar Cliente,2026-07-03 11:00:00,Maria Rodriguez,16000,
OPP-1007,Calificar Lead,2026-07-04 14:30:00,Maria Rodriguez,16000,
OPP-1007,Enviar Propuesta,2026-07-05 10:00:00,Maria Rodriguez,16000,
OPP-1007,Negociación,2026-07-06 15:30:00,Elena Silva,16000,
OPP-1007,Cerrar Ganado,2026-07-08 09:00:00,Elena Silva,16000,
OPP-1008,Crear Lead,2026-07-03 10:30:00,Juan Martinez,5000,
OPP-1008,Contactar Cliente,2026-07-03 14:00:00,Juan Martinez,5000,
OPP-1008,Cerrar Perdido,2026-07-04 16:00:00,Juan Martinez,5000,Sin presupuesto / Proyecto cancelado
OPP-1009,Crear Lead,2026-07-04 09:00:00,Ana Gomez,22000,
OPP-1009,Contactar Cliente,2026-07-04 11:30:00,Ana Gomez,22000,
OPP-1009,Calificar Lead,2026-07-05 14:00:00,Ana Gomez,22000,
OPP-1009,Enviar Propuesta,2026-07-06 10:30:00,Ana Gomez,22000,
OPP-1009,Cerrar Perdido,2026-07-07 16:00:00,Ana Gomez,22000,No tiene credito con la empresa
OPP-1010,Crear Lead,2026-07-04 10:00:00,Luis Perez,14000,
OPP-1010,Contactar Cliente,2026-07-04 15:00:00,Luis Perez,14000,
OPP-1010,Cerrar Perdido,2026-07-05 16:30:00,Luis Perez,14000,No tenemos el producto (sin existencias)
OPP-1011,Crear Lead,2026-07-05 09:30:00,Maria Rodriguez,9000,
OPP-1011,Contactar Cliente,2026-07-05 12:00:00,Maria Rodriguez,9000,
OPP-1011,Cerrar Perdido,2026-07-06 15:30:00,Maria Rodriguez,9000,Percibe mal servicio de parte de empresa
OPP-1012,Crear Lead,2026-07-05 10:00:00,Juan Martinez,30000,
OPP-1012,Contactar Cliente,2026-07-05 14:30:00,Juan Martinez,30000,
OPP-1012,Calificar Lead,2026-07-06 11:00:00,Juan Martinez,30000,
OPP-1012,Enviar Propuesta,2026-07-07 15:30:00,Juan Martinez,30000,
OPP-1012,Negociación,2026-07-08 10:00:00,Carlos Mendoza,30000,
OPP-1012,Cerrar Ganado,2026-07-10 09:30:00,Carlos Mendoza,30000,
OPP-1013,Crear Lead,2026-07-06 09:00:00,Ana Gomez,19000,
OPP-1013,Contactar Cliente,2026-07-06 11:30:00,Ana Gomez,19000,
OPP-1013,Calificar Lead,2026-07-07 14:00:00,Ana Gomez,19000,
OPP-1013,Enviar Propuesta,2026-07-08 10:30:00,Ana Gomez,19000,
OPP-1013,Negociación,2026-07-09 15:00:00,Elena Silva,19000,
OPP-1013,Aprobación Legal,2026-07-10 11:00:00,Abog. Castro,19000,
OPP-1013,Cerrar Ganado,2026-07-12 16:30:00,Elena Silva,19000,
OPP-1014,Crear Lead,2026-07-06 10:00:00,Luis Perez,15000,
OPP-1014,Contactar Cliente,2026-07-06 15:00:00,Luis Perez,15000,
OPP-1014,Calificar Lead,2026-07-07 11:30:00,Luis Perez,15000,
OPP-1014,Enviar Propuesta,2026-07-08 10:30:00,Luis Perez,15000,
OPP-1014,Negociación,2026-07-09 15:00:00,Carlos Mendoza,15000,
OPP-1014,Cerrar Ganado,2026-07-11 16:30:00,Carlos Mendoza,15000,
OPP-1015,Crear Lead,2026-07-07 09:00:00,Maria Rodriguez,12000,
OPP-1015,Contactar Cliente,2026-07-07 11:00:00,Maria Rodriguez,12000,
OPP-1015,Calificar Lead,2026-07-08 14:30:00,Maria Rodriguez,12000,
OPP-1015,Enviar Propuesta,2026-07-09 10:00:00,Maria Rodriguez,12000,
OPP-1015,Negociación,2026-07-10 15:30:00,Elena Silva,12000,
OPP-1015,Cerrar Ganado,2026-07-12 09:00:00,Elena Silva,12000,`;

function initProcessMining() {
  console.log('[Process Mining] Module loading...');
  
  // Bind UI sliders
  const depRange = document.getElementById('range-pm-dep-threshold');
  const depLbl = document.getElementById('lbl-pm-dep-threshold');
  if (depRange && depLbl) {
    depRange.addEventListener('input', (e) => {
      depLbl.innerText = parseFloat(e.target.value).toFixed(2);
    });
  }

  const loopRange = document.getElementById('range-pm-loop-threshold');
  const loopLbl = document.getElementById('lbl-pm-loop-threshold');
  if (loopRange && loopLbl) {
    loopRange.addEventListener('input', (e) => {
      loopLbl.innerText = parseFloat(e.target.value).toFixed(2);
    });
  }

  // Bind file upload
  const fileInput = document.getElementById('pm-file-input');
  const fileTrigger = document.getElementById('btn-pm-file-trigger');
  const filenameLbl = document.getElementById('pm-filename-lbl');

  if (fileTrigger && fileInput) {
    fileTrigger.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        filenameLbl.innerText = file.name;
        isSampleSelected = false;
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (evt) => {
          selectedCsvContent = evt.target.result;
          console.log(`[Process Mining] CSV file read successfully: ${file.name} (${selectedCsvContent.length} bytes)`);
          detectAndSetDateRange();
          populateResourceFilter();
        };
        reader.onerror = () => {
          alert('Error al leer el archivo CSV.');
          selectedCsvContent = null;
        };
        reader.readAsText(file);
      }
    };
  }

  // Bind sample load button
  const btnLoadSample = document.getElementById('btn-pm-load-sample');
  if (btnLoadSample) {
    btnLoadSample.onclick = async () => {
      try {
        showLoading(true, 'Cargando dataset de ejemplo...');
        
        // Timeout fetch using AbortController to fallback instantly if server is starting/offline
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        
        let res;
        try {
          res = await fetch(`${API_BASE}/process-mining/sample`, {
            signal: controller.signal
          });
        } finally {
          clearTimeout(timeoutId);
        }
        
        if (!res.ok) {
          throw new Error('No se pudo obtener el dataset de ejemplo del servidor.');
        }
        selectedCsvContent = await res.text();
        isSampleSelected = true;
        
        if (filenameLbl) filenameLbl.innerText = 'Dataset de Ejemplo CRM (crm_event_log.csv)';
        
        // Auto-fill typical column names for our sample
        document.getElementById('pm-col-case').value = 'case_id';
        document.getElementById('pm-col-activity').value = 'activity';
        document.getElementById('pm-col-timestamp').value = 'timestamp';
        document.getElementById('pm-col-resource').value = 'resource';
        
        console.log('[Process Mining] Sample CSV loaded successfully');
        detectAndSetDateRange();
        populateResourceFilter();
        alert('✅ Dataset de ejemplo CRM cargado con éxito. Ahora puedes presionar "Descubrir Proceso".');
      } catch (err) {
        console.warn('[Process Mining] Backend sample fetch failed, loading local fallback dataset:', err.message);
        
        // Load fallback dataset
        selectedCsvContent = FALLBACK_CRM_CSV;
        isSampleSelected = true;
        
        if (filenameLbl) filenameLbl.innerText = 'Dataset de Ejemplo Local (Resiliente)';
        
        // Auto-fill typical column names for our sample
        document.getElementById('pm-col-case').value = 'case_id';
        document.getElementById('pm-col-activity').value = 'activity';
        document.getElementById('pm-col-timestamp').value = 'timestamp';
        document.getElementById('pm-col-resource').value = 'resource';
        
        detectAndSetDateRange();
        populateResourceFilter();
        
        alert('ℹ️ El servidor backend se está iniciando. Se ha cargado el dataset de ejemplo de forma local y automática para que puedas continuar. ¡Presiona "Descubrir Proceso"!');
      } finally {
        showLoading(false);
      }
    };
  }

  // Bind Run button
  const btnRun = document.getElementById('btn-pm-run');
  if (btnRun) {
    btnRun.onclick = async () => {
      if (!selectedCsvContent) {
        alert('Por favor selecciona un archivo CSV o haz clic en "Usar Dataset de Ejemplo CRM" antes de continuar.');
        return;
      }

      const caseIdCol = document.getElementById('pm-col-case').value.trim();
      const activityCol = document.getElementById('pm-col-activity').value.trim();
      const timestampCol = document.getElementById('pm-col-timestamp').value.trim();
      const resourceCol = document.getElementById('pm-col-resource').value.trim();
      const selectedResource = document.getElementById('pm-filter-resource').value;
      const startVal = document.getElementById('pm-filter-start-date').value;
      const endVal = document.getElementById('pm-filter-end-date').value;
      const depThresh = parseFloat(depRange.value);
      const loopThresh = parseFloat(loopRange.value);

      if (!caseIdCol || !activityCol || !timestampCol) {
        alert('Por favor especifica los nombres de las columnas para Case ID, Actividad y Timestamp.');
        return;
      }

      let csvDataToSubmit = selectedCsvContent;

      // 1. Filter CSV content by Date range (Event-level filtering)
      if ((startVal || endVal) && timestampCol) {
        const lines = csvDataToSubmit.split('\n');
        if (lines.length > 1) {
          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
          const timeIdx = headers.indexOf(timestampCol);

          if (timeIdx !== -1) {
            const startLimit = startVal ? new Date(startVal + 'T00:00:00') : null;
            const endLimit = endVal ? new Date(endVal + 'T23:59:59') : null;

            const filteredLines = [lines[0]];
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
              if (cols.length > timeIdx && cols[timeIdx]) {
                const eventDate = new Date(cols[timeIdx]);
                if (!isNaN(eventDate.getTime())) {
                  let keep = true;
                  if (startLimit && eventDate < startLimit) keep = false;
                  if (endLimit && eventDate > endLimit) keep = false;

                  if (keep) {
                    filteredLines.push(lines[i]);
                  }
                }
              }
            }
            csvDataToSubmit = filteredLines.join('\n');
            console.log(`[Process Mining] CSV filtered by date [${startVal || 'MIN'} to ${endVal || 'MAX'}]. Events kept: ${filteredLines.length - 1}`);
          }
        }
      }

      // 2. Filter CSV content by Salesperson (Case-level filtering on top of date filter)
      if (selectedResource !== 'ALL' && resourceCol) {
        const lines = csvDataToSubmit.split('\n');
        if (lines.length > 1) {
          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
          const resourceIdx = headers.indexOf(resourceCol);
          const caseIdx = headers.indexOf(caseIdCol);

          if (resourceIdx !== -1 && caseIdx !== -1) {
            // Find all case IDs handled by this resource
            const matchingCases = new Set();
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
              if (cols.length > resourceIdx && cols[resourceIdx] === selectedResource) {
                matchingCases.add(cols[caseIdx]);
              }
            }

            // Keep all lines belonging to these case IDs to maintain complete flows
            const filteredLines = [lines[0]];
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
              if (cols.length > caseIdx && matchingCases.has(cols[caseIdx])) {
                filteredLines.push(lines[i]);
              }
            }
            csvDataToSubmit = filteredLines.join('\n');
            console.log(`[Process Mining] CSV filtered by resource "${selectedResource}". Cases matching: ${matchingCases.size}, Events kept: ${filteredLines.length - 1}`);
          }
        }
      }

      try {
        showLoading(true, 'Ejecutando algoritmo Heuristic Miner con PM4Py...');
        
        const response = await fetch(`${API_BASE}/process-mining/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            csvData: csvDataToSubmit,
            caseIdColumn: caseIdCol,
            activityColumn: activityCol,
            timestampColumn: timestampCol,
            dependencyThreshold: depThresh,
            loopTwoThreshold: loopThresh
          })
        });

        const resData = await response.json();
        if (!response.ok || !resData.success) {
          throw new Error(resData.error || 'Ocurrió un error desconocido al ejecutar el análisis.');
        }

        console.log('[Process Mining] Analysis succeeded:', resData.data);
        
        // Save and parse submitted CSV data for drill-down table
        latestSubmittedCsv = csvDataToSubmit;
        parseCsvData(csvDataToSubmit);

        renderMiningResult(resData.data);
      } catch (err) {
        console.error('[Process Mining] Analysis failed:', err);
        if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
          alert('⏳ El motor de minería de procesos (Python) se está encendiendo en segundo plano. Por favor, espera 5 segundos y vuelve a presionar "Descubrir Proceso".');
        } else {
          alert(`❌ Error al ejecutar el minero de procesos:\n${err.message}`);
        }
      } finally {
        showLoading(false);
      }
    };
  }

  // Bind Zoom / Fit Actions
  const btnZoomIn = document.getElementById('btn-pm-zoom-in');
  const btnZoomOut = document.getElementById('btn-pm-zoom-out');
  const btnFit = document.getElementById('btn-pm-fit');
  const btnExportExcel = document.getElementById('btn-pm-export-excel');

  if (btnZoomIn) btnZoomIn.onclick = () => cyInstance && cyInstance.zoom(cyInstance.zoom() * 1.2);
  if (btnZoomOut) btnZoomOut.onclick = () => cyInstance && cyInstance.zoom(cyInstance.zoom() / 1.2);
  if (btnFit) btnFit.onclick = () => cyInstance && cyInstance.fit() && cyInstance.center();
  if (btnExportExcel) btnExportExcel.onclick = () => exportCasesToExcel();

  // Bind Conformance Panel Alert Clicks
  const devItems = document.querySelectorAll('.conformance-deviation-item');
  const btnClearConformance = document.getElementById('btn-pm-clear-conformance');

  devItems.forEach(item => {
    item.onclick = () => {
      const devType = item.getAttribute('data-deviation');
      if (activeDeviationFilter === devType) {
        clearConformanceFilter();
      } else {
        applyConformanceFilter(devType);
      }
    };
  });

  if (btnClearConformance) {
    btnClearConformance.onclick = () => {
      clearConformanceFilter();
    };
  }

  // Listen for tab switch to resize cytoscape canvas (otherwise layout renders skewed due to display:none)
  const tabButton = document.querySelector('[data-tab="process-mining"]');
  if (tabButton) {
    tabButton.addEventListener('click', () => {
      setTimeout(() => {
        if (cyInstance) {
          cyInstance.resize();
          cyInstance.fit();
          cyInstance.center();
        }
      }, 100);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProcessMining);
} else {
  initProcessMining();
}

function showLoading(show, message = 'Procesando...') {
  const overlay = document.getElementById('pm-loading-overlay');
  if (overlay) {
    if (show) {
      overlay.querySelector('p').innerText = message;
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  }
}

function renderMiningResult(data) {
  // Hide placeholder
  const placeholder = document.getElementById('pm-canvas-placeholder');
  if (placeholder) placeholder.style.display = 'none';

  // Update legacy hidden stats (for backward compat)
  const elEvents = document.getElementById('pm-stat-events');
  const elAvg = document.getElementById('pm-stat-avg-events');
  const elAct = document.getElementById('pm-stat-activities');
  if (elEvents) elEvents.innerText = Number(data.stats.total_events).toLocaleString();
  if (elAvg) elAvg.innerText = data.stats.avg_events_per_case;
  if (elAct) elAct.innerText = data.stats.activity_count;

  // Update Casos Analizados KPI
  const elCases = document.getElementById('pm-stat-cases');
  if (elCases) elCases.innerText = Number(data.stats.total_cases).toLocaleString();

  // Initialize table with all cases
  const allCaseIds = new Set(Object.keys(parsedCases));
  updateCaseDetailTable(allCaseIds, 'Todos los casos');

  // Run conformance checking first to get conformance % and deviation count
  const conformanceResult = computeConformanceSummary(allCaseIds);
  const elConformance = document.getElementById('pm-stat-conformance');
  const elDeviations = document.getElementById('pm-stat-deviations');
  if (elConformance) elConformance.innerText = conformanceResult.conformancePercent + '%';
  if (elDeviations) elDeviations.innerText = conformanceResult.totalDeviations;

  // Compute average time per edge (transition) from parsedCases
  const edgeTimeSums = {};   // "A->B" -> total milliseconds
  const edgeTimeCounts = {}; // "A->B" -> count
  for (const caseId in parsedCases) {
    const events = parsedCases[caseId];
    for (let i = 0; i < events.length - 1; i++) {
      const key = `${events[i].activity}->${events[i+1].activity}`;
      const t1 = new Date(events[i].timestamp).getTime();
      const t2 = new Date(events[i+1].timestamp).getTime();
      if (!isNaN(t1) && !isNaN(t2) && t2 > t1) {
        edgeTimeSums[key] = (edgeTimeSums[key] || 0) + (t2 - t1);
        edgeTimeCounts[key] = (edgeTimeCounts[key] || 0) + 1;
      }
    }
  }

  // Determine happy-path nodes (above median frequency)
  const freqs = data.nodes.map(n => n.frequency);
  const sortedFreqs = [...freqs].sort((a, b) => a - b);
  const medianFreq = sortedFreqs[Math.floor(sortedFreqs.length / 2)] || 1;

  // Format elements for cytoscape
  const elements = [];

  // Add Nodes with light theme colors
  data.nodes.forEach(n => {
    const isHappy = n.frequency >= medianFreq;
    elements.push({
      data: {
        id: n.id,
        label: n.label,
        frequency: n.frequency,
        isStart: n.is_start,
        isEnd: n.is_end,
        isHappy: isHappy
      }
    });
  });

  // Add Edges with event count + avg time labels
  const maxFreqEdge = Math.max(...data.edges.map(e => e.frequency), 1);
  data.edges.forEach(e => {
    const ratio = e.frequency / maxFreqEdge;
    const edgeWidth = 1.5 + (ratio * 3.5);
    const isLoop = e.type === 'loop_length_two';
    const isBottleneck = ratio < 0.15; // low-frequency = bottleneck

    const edgeKey = `${e.source}->${e.target}`;
    let labelParts = [`${e.frequency} Eventos`];
    if (edgeTimeCounts[edgeKey] > 0) {
      const avgMs = edgeTimeSums[edgeKey] / edgeTimeCounts[edgeKey];
      const avgDays = (avgMs / 86400000).toFixed(1);
      if (parseFloat(avgDays) > 0) labelParts.push(`T. Promedio: ${avgDays} días`);
    }
    if (isBottleneck && e.frequency > 0) labelParts.push('Cuello de botella!');
    const label = labelParts.join('\n');

    elements.push({
      data: {
        id: e.id,
        source: e.source,
        target: e.target,
        label: label,
        width: edgeWidth,
        isLoop: isLoop,
        isBottleneck: isBottleneck
      }
    });
  });

  // Create / Re-create Cytoscape Instance
  const container = document.getElementById('pm-canvas-container');
  if (cyInstance) cyInstance.destroy();

  cyInstance = cytoscape({
    container: container,
    elements: elements,
    boxSelectionEnabled: false,
    autounselectify: true,

    style: [
      // Default node: light gray (low-frequency / deviation path)
      {
        selector: 'node',
        style: {
          'content': 'data(label)',
          'text-wrap': 'wrap',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '11px',
          'font-weight': '600',
          'font-family': 'Inter, sans-serif',
          'color': '#dc2626',
          'background-color': '#fee2e2',
          'border-width': '2px',
          'border-color': '#ef4444',
          'width': 140,
          'height': 44,
          'shape': 'roundrectangle',
          'transition-property': 'background-color, border-color',
          'transition-duration': '0.2s'
        }
      },
      // Happy-path nodes: green
      {
        selector: 'node[?isHappy]',
        style: {
          'color': '#15803d',
          'background-color': '#dcfce7',
          'border-color': '#22c55e'
        }
      },
      // Start node: circle, light gray
      {
        selector: 'node[?isStart][!isEnd]',
        style: {
          'shape': 'ellipse',
          'width': 60,
          'height': 60,
          'color': '#475569',
          'background-color': '#f1f5f9',
          'border-color': '#94a3b8',
          'border-width': '1.5px',
          'label': 'Inicio'
        }
      },
      // Edges: dark gray arrows
      {
        selector: 'edge',
        style: {
          'label': 'data(label)',
          'font-size': '9px',
          'font-weight': '500',
          'font-family': 'Inter, sans-serif',
          'color': '#475569',
          'width': 'data(width)',
          'line-color': '#94a3b8',
          'target-arrow-color': '#94a3b8',
          'target-arrow-shape': 'triangle',
          'curve-style': 'taxi',
          'taxi-direction': 'downward',
          'taxi-turn': 40,
          'text-background-opacity': 0.9,
          'text-background-color': '#f8fafc',
          'text-background-padding': '2px',
          'text-background-shape': 'roundrectangle',
          'text-border-width': '0.5px',
          'text-border-color': '#e2e8f0',
          'line-style': 'solid',
          'text-wrap': 'wrap'
        }
      },
      // Bottleneck edges: dashed orange
      {
        selector: 'edge[?isBottleneck]',
        style: {
          'line-color': '#f97316',
          'target-arrow-color': '#f97316',
          'line-style': 'dashed',
          'color': '#ea580c'
        }
      },
      // Loop edges: pink
      {
        selector: 'edge[?isLoop]',
        style: {
          'line-color': '#ec4899',
          'target-arrow-color': '#ec4899',
          'line-style': 'dashed',
          'color': '#db2777'
        }
      },
      // Selected node highlight
      {
        selector: 'node:selected',
        style: {
          'border-color': '#3b82f6',
          'border-width': '3px'
        }
      }
    ],

    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 60,
      spacingFactor: 1.4,
      avoidOverlap: true,
      animate: false,
      roots: data.nodes.filter(n => n.is_start).map(n => n.id)
    }
  });

  // Fit after ready
  cyInstance.ready(() => {
    setTimeout(() => {
      if (cyInstance) {
        cyInstance.resize();
        cyInstance.fit();
        cyInstance.center();
      }
    }, 200);
  });

  // Tap node: highlight neighborhood and update table
  cyInstance.on('tap', 'node', function(evt) {
    const node = evt.target;
    const activityName = node.id();
    cyInstance.elements().style('opacity', 0.2);
    node.style('opacity', 1);
    node.neighborhood().style('opacity', 1);

    const matchingCases = new Set();
    for (const caseId in parsedCases) {
      if (parsedCases[caseId].some(e => e.activity === activityName)) matchingCases.add(caseId);
    }
    updateCaseDetailTable(matchingCases, `Casos que pasaron por: "${activityName}"`);
  });

  // Tap edge: highlight and update table
  cyInstance.on('tap', 'edge', function(evt) {
    const edge = evt.target;
    const sourceAct = edge.data('source');
    const targetAct = edge.data('target');
    cyInstance.elements().style('opacity', 0.1);
    edge.style('opacity', 1);
    edge.source().style('opacity', 1);
    edge.target().style('opacity', 1);

    const matchingCases = new Set();
    for (const caseId in parsedCases) {
      const events = parsedCases[caseId];
      for (let i = 0; i < events.length - 1; i++) {
        if (events[i].activity === sourceAct && events[i + 1].activity === targetAct) { matchingCases.add(caseId); break; }
      }
    }
    updateCaseDetailTable(matchingCases, `Transición: "${sourceAct}" ➔ "${targetAct}"`);
  });

  // Tap background: reset
  cyInstance.on('tap', function(evt) {
    if (evt.target === cyInstance) {
      cyInstance.elements().style('opacity', 1);
      updateCaseDetailTable(new Set(Object.keys(parsedCases)), 'Todos los casos');
      clearConformanceFilter(false);
    }
  });

  // Execute conformance checking
  runConformanceChecking(allCaseIds);
}

// Compute conformance summary: percentage of cases following happy path + total deviations
function computeConformanceSummary(caseIds) {
  let happyCases = 0;
  let totalDeviations = 0;

  for (const caseId of caseIds) {
    const events = parsedCases[caseId] || [];
    const activities = events.map(e => e.activity);

    const hasDemo = activities.includes('Realizar Demo') || activities.includes('Agendar Demo');
    const hasCerrarGanado = activities.includes('Cerrar Ganado');
    const hasEnviarPropuesta = activities.includes('Enviar Propuesta');
    const hasCalificar = activities.includes('Calificar Lead');

    let caseDeviations = 0;
    // Deviation 1: Propuesta sin demo
    if (hasEnviarPropuesta && !hasDemo && hasCerrarGanado) caseDeviations++;
    // Deviation 2: Ganado >15k sin Legal
    const amount = events.length > 0 ? (events[0].amount || 0) : 0;
    if (hasCerrarGanado && amount > 15000 && !activities.includes('Aprobación Legal')) caseDeviations++;
    // Deviation 3: Propuesta sin calificar
    if (hasEnviarPropuesta && !hasCalificar) caseDeviations++;

    if (caseDeviations === 0) happyCases++;
    totalDeviations += caseDeviations;
  }

  const total = caseIds.size || 1;
  const conformancePercent = Math.round((happyCases / total) * 100 * 10) / 10;
  return { conformancePercent, totalDeviations };
}

function parseCsvData(csv) {

  parsedCases = {};
  if (!csv) return;

  const caseIdCol = document.getElementById('pm-col-case').value.trim();
  const activityCol = document.getElementById('pm-col-activity').value.trim();
  const timestampCol = document.getElementById('pm-col-timestamp').value.trim();
  const resourceCol = document.getElementById('pm-col-resource').value.trim();

  const lines = csv.split('\n');
  if (lines.length < 2) return;

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const caseIdx = headers.indexOf(caseIdCol);
  const activityIdx = headers.indexOf(activityCol);
  const timestampIdx = headers.indexOf(timestampCol);
  const resourceIdx = headers.indexOf(resourceCol);
  
  // Optional deal value column
  const amountIdx = headers.indexOf('amount');
  // Optional lost reason column
  const lostReasonIdx = headers.indexOf('lost_reason');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length > Math.max(caseIdx, activityIdx, timestampIdx)) {
      const caseId = cols[caseIdx];
      const activity = cols[activityIdx];
      const timestamp = cols[timestampIdx];
      const resource = resourceIdx !== -1 && cols.length > resourceIdx ? cols[resourceIdx] : 'N/A';
      const amount = amountIdx !== -1 && cols.length > amountIdx ? parseFloat(cols[amountIdx]) : 0;
      const lostReason = lostReasonIdx !== -1 && cols.length > lostReasonIdx ? cols[lostReasonIdx] : '';

      if (!parsedCases[caseId]) {
        parsedCases[caseId] = [];
      }
      parsedCases[caseId].push({
        activity,
        timestamp,
        resource,
        amount,
        lostReason
      });
    }
  }

  // Sort events within each case chronologically
  for (const caseId in parsedCases) {
    parsedCases[caseId].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
}

function updateCaseDetailTable(matchingCaseIds, title = 'Todos los casos') {
  const tbody = document.getElementById('pm-detail-tbody');
  const titleSpan = document.getElementById('pm-detail-title');
  const countSpan = document.getElementById('pm-detail-count');
  const bottomLayout = document.getElementById('pm-bottom-layout');

  if (!tbody || !bottomLayout) return;

  bottomLayout.style.display = 'grid';
  titleSpan.innerText = title;
  
  const caseIdsArr = Array.from(matchingCaseIds);
  countSpan.innerText = `${caseIdsArr.length} casos`;

  tbody.innerHTML = '';

  if (caseIdsArr.length === 0) {
    currentCasesInTable = [];
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #64748b;">No hay casos que coincidan con la selección.</td></tr>`;
    return;
  }

  // Map each case to its summary details
  const casesSummary = caseIdsArr.map(caseId => {
    const events = parsedCases[caseId] || [];
    const latestEvent = events[events.length - 1] || {};
    
    // The salesperson who owns the lead is the resource of the first event (e.g. Crear Lead)
    const caseOwner = events[0] ? events[0].resource : 'N/A';
    
    // Find if there is any lost reason in this case's events
    const lostEvent = events.find(e => e.activity === 'Cerrar Perdido' && e.lostReason);
    const lostReason = lostEvent ? lostEvent.lostReason : '-';
    
    return {
      caseId,
      lastActivity: latestEvent.activity || 'N/A',
      resource: caseOwner,
      amount: latestEvent.amount || 0,
      timestamp: latestEvent.timestamp || 'N/A',
      lostReason: lostReason
    };
  });

  // Sort alphabetically by caseId
  casesSummary.sort((a, b) => a.caseId.localeCompare(b.caseId));
  
  // Save current cases for Excel exporting
  currentCasesInTable = casesSummary;

  casesSummary.forEach(c => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
    tr.style.cursor = 'pointer';
    tr.style.transition = 'background 0.2s ease';
    
    // Hover effects in JS
    tr.onmouseenter = () => { tr.style.background = 'rgba(255, 255, 255, 0.04)'; };
    tr.onmouseleave = () => { tr.style.background = 'transparent'; };

    const formattedAmount = c.amount > 0 ? `$${c.amount.toLocaleString()}` : '-';

    tr.innerHTML = `
      <td style="padding: 0.75rem 0.5rem; color: #38bdf8; font-weight: 600;">${c.caseId}</td>
      <td style="padding: 0.75rem 0.5rem;"><span style="background: rgba(167, 139, 250, 0.15); color: #c084fc; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${c.lastActivity}</span></td>
      <td style="padding: 0.75rem 0.5rem; color: #cbd5e1;">${c.resource}</td>
      <td style="padding: 0.75rem 0.5rem; color: #10b981; font-weight: 600; text-align: right;">${formattedAmount}</td>
      <td style="padding: 0.75rem 0.5rem; color: #ef4444; font-weight: 500; padding-left: 1.5rem;">${c.lostReason}</td>
      <td style="padding: 0.75rem 0.5rem; color: #64748b; font-size: 0.8rem; text-align: right;">${c.timestamp}</td>
    `;
    tbody.appendChild(tr);
  });
}

function detectAndSetDateRange() {
  const startInput = document.getElementById('pm-filter-start-date');
  const endInput = document.getElementById('pm-filter-end-date');
  if (!startInput || !endInput || !selectedCsvContent) return;

  const timestampCol = document.getElementById('pm-col-timestamp').value.trim();
  const lines = selectedCsvContent.split('\n');
  if (lines.length < 2) return;

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const timeIdx = headers.indexOf(timestampCol);

  if (timeIdx === -1) return;

  let minDate = null;
  let maxDate = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length > timeIdx && cols[timeIdx]) {
      const d = new Date(cols[timeIdx]);
      if (!isNaN(d.getTime())) {
        if (!minDate || d < minDate) minDate = d;
        if (!maxDate || d > maxDate) maxDate = d;
      }
    }
  }

  if (minDate && maxDate) {
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    startInput.value = formatDate(minDate);
    endInput.value = formatDate(maxDate);
    
    // Set boundaries
    startInput.min = formatDate(minDate);
    startInput.max = formatDate(maxDate);
    endInput.min = formatDate(minDate);
    endInput.max = formatDate(maxDate);
    
    console.log(`[Process Mining] Auto-detected date range boundaries: ${startInput.value} to ${endInput.value}`);
  }
}

function exportCasesToExcel() {
  if (!currentCasesInTable || currentCasesInTable.length === 0) {
    alert('No hay datos en la tabla para exportar.');
    return;
  }

  // Get a Set of the Case IDs currently matching the filter
  const activeCaseIds = new Set(currentCasesInTable.map(c => c.caseId));

  // UTF-8 BOM so Excel opens with correct encoding and accents
  let csvContent = '\uFEFF'; 
  csvContent += 'ID Oportunidad (Case ID),Actividad,Vendedor / Recurso,Monto Estimado,Causa de Perdida,Fecha y Hora\n';

  // Sort case IDs so they are grouped together in the export
  const sortedCaseIds = Array.from(activeCaseIds).sort((a, b) => a.localeCompare(b.caseId));

  sortedCaseIds.forEach(caseId => {
    const events = parsedCases[caseId] || [];
    events.forEach(ev => {
      const formattedAmount = ev.amount > 0 ? ev.amount : 0;
      const row = [
        `"${caseId}"`,
        `"${ev.activity}"`,
        `"${ev.resource}"`,
        formattedAmount,
        `"${ev.lostReason || ''}"`,
        `"${ev.timestamp}"`
      ];
      csvContent += row.join(',') + '\n';
    });
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const title = document.getElementById('pm-detail-title').innerText.replace(/[\s\W]+/g, '_');
  const filename = `reporte_detallado_procesos_${title.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log(`[Process Mining] Exported complete event history for ${activeCaseIds.size} cases to Excel.`);
}

function populateResourceFilter() {
  const filterSelect = document.getElementById('pm-filter-resource');
  if (!filterSelect || !selectedCsvContent) return;

  // Save current selection
  const currentSelection = filterSelect.value;

  // Clear options except the first "ALL"
  filterSelect.innerHTML = '<option value="ALL">Todos los vendedores</option>';

  const resourceCol = document.getElementById('pm-col-resource').value.trim();
  
  // Simple CSV parser
  const lines = selectedCsvContent.split('\n');
  if (lines.length < 2) return;

  // Parse header to find index
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const resourceIdx = headers.indexOf(resourceCol);

  if (resourceIdx === -1) {
    console.warn(`Resource column "${resourceCol}" not found in CSV headers:`, headers);
    return;
  }

  const resources = new Set();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length > resourceIdx && cols[resourceIdx]) {
      resources.add(cols[resourceIdx]);
    }
  }

  // Populate dropdown
  Array.from(resources).sort().forEach(res => {
    const opt = document.createElement('option');
    opt.value = res;
    opt.innerText = res;
    filterSelect.appendChild(opt);
  });

  // Restore selection if it still exists
  if (resources.has(currentSelection)) {
    filterSelect.value = currentSelection;
  }
}

// =============================================================================
// CONFORMANCE CHECKING AND PROCESS ALERTS ALGORITHMS
// =============================================================================

function runConformanceChecking(filteredCaseIds) {
  // Store all active cases currently matching date/salesperson filters
  allActiveCasesBeforeDeviationFilter = new Set(filteredCaseIds);
  
  // Clear previous deviation mappings
  activeDeviationCases = {
    demo: new Set(),
    legal: new Set(),
    qualification: new Set(),
    rework: new Set()
  };

  const caseIdsArr = Array.from(filteredCaseIds);
  let conformantCount = 0;

  caseIdsArr.forEach(caseId => {
    const events = parsedCases[caseId] || [];
    
    // Check if case has certain activities
    const activities = events.map(e => e.activity);
    const hasProposal = activities.includes('Enviar Propuesta');
    const hasDemo = activities.includes('Realizar Demo');
    const hasLegal = activities.includes('Aprobación Legal');
    const hasQualification = activities.includes('Calificar Lead');
    const isWon = activities.includes('Cerrar Ganado');
    
    // Find max amount in case events
    const maxAmount = Math.max(...events.map(e => e.amount || 0), 0);

    let hasAnyDeviation = false;

    // Rule 1: Omisión de Demo (Proposal sent but no Demo performed)
    if (hasProposal && !hasDemo) {
      activeDeviationCases.demo.add(caseId);
      hasAnyDeviation = true;
    }

    // Rule 2: Contrato Grande sin Legal (Won contract > $15,000 USD but no Legal approval)
    if (isWon && maxAmount > 15000 && !hasLegal) {
      activeDeviationCases.legal.add(caseId);
      hasAnyDeviation = true;
    }

    // Rule 3: Salto de Calificación (Proposal sent but no Qualification performed)
    if (hasProposal && !hasQualification) {
      activeDeviationCases.qualification.add(caseId);
      hasAnyDeviation = true;
    }

    // Rule 4: Bucle de Retrabajo en Negociación (Negotiation activity occurs more than once)
    const negotiationCount = activities.filter(act => act === 'Negociación').length;
    if (negotiationCount > 1) {
      activeDeviationCases.rework.add(caseId);
      hasAnyDeviation = true;
    }

    if (!hasAnyDeviation) {
      conformantCount++;
    }
  });

  // Calculate conformity score
  const totalCases = caseIdsArr.length;
  const conformityScore = totalCases > 0 ? Math.round((conformantCount / totalCases) * 100) : 100;

  // Render UI
  const scoreValue = document.getElementById('conformity-score-value');
  const scoreText = document.getElementById('conformity-score-text');
  
  if (scoreValue && scoreText) {
    scoreValue.innerText = `${conformityScore}%`;
    
    // Remove previous classes
    scoreValue.className = 'conformity-badge';
    if (conformityScore >= 80) {
      scoreValue.classList.add('success');
      scoreText.innerText = 'Cumplimiento Alto';
    } else if (conformityScore >= 50) {
      scoreValue.classList.add('warning');
      scoreText.innerText = 'Cumplimiento Medio';
    } else {
      scoreValue.classList.add('danger');
      scoreText.innerText = 'Cumplimiento Bajo';
    }
  }

  // Update counts
  const countDemo = document.getElementById('deviation-demo-count');
  const countLegal = document.getElementById('deviation-legal-count');
  const countQual = document.getElementById('deviation-qual-count');
  const countRework = document.getElementById('deviation-rework-count');

  if (countDemo) countDemo.innerText = activeDeviationCases.demo.size;
  if (countLegal) countLegal.innerText = activeDeviationCases.legal.size;
  if (countQual) countQual.innerText = activeDeviationCases.qualification.size;
  if (countRework) countRework.innerText = activeDeviationCases.rework.size;

  // Reset active filters
  clearConformanceFilter(false); // Clear visually without re-triggering table update
}

function applyConformanceFilter(devType) {
  activeDeviationFilter = devType;
  
  // Highlight UI item
  const devItems = document.querySelectorAll('.conformance-deviation-item');
  devItems.forEach(item => {
    if (item.getAttribute('data-deviation') === devType) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const btnClear = document.getElementById('btn-pm-clear-conformance');
  if (btnClear) btnClear.style.display = 'block';

  // Filter Table
  const cases = activeDeviationCases[devType] || new Set();
  updateCaseDetailTable(cases, `Casos con desvío: ${getDeviationLabel(devType)}`);
}

function clearConformanceFilter(triggerUpdate = true) {
  activeDeviationFilter = null;
  
  const devItems = document.querySelectorAll('.conformance-deviation-item');
  devItems.forEach(item => {
    item.classList.remove('active');
  });

  const btnClear = document.getElementById('btn-pm-clear-conformance');
  if (btnClear) btnClear.style.display = 'none';

  if (triggerUpdate) {
    updateCaseDetailTable(allActiveCasesBeforeDeviationFilter, 'Todos los casos');
  }
}

function getDeviationLabel(devType) {
  switch (devType) {
    case 'demo': return 'Omisión de Demo';
    case 'legal': return 'Contrato Grande sin Legal';
    case 'qualification': return 'Salto de Calificación';
    case 'rework': return 'Bucle de Negociación';
    default: return devType;
  }
}

} catch (e) {
  alert("Real Error in processMining.js: " + e.message + "\nStack: " + e.stack);
}
