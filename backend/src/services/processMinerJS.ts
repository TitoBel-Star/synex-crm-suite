// processMinerJS.ts - Pure TypeScript Heuristic Miner (no Python required)

interface MinerEvent { case_id: string; activity: string; timestamp: Date; }
interface MinerNode { id: string; label: string; frequency: number; is_start: boolean; is_end: boolean; }
interface MinerEdge { id: string; source: string; target: string; frequency: number; dependency: number; type: string; }
export interface MinerResult { nodes: MinerNode[]; edges: MinerEdge[]; stats: { total_cases: number; total_events: number; avg_events_per_case: number; activity_count: number; }; }

function parseCSV(csvData: string): Record<string, string>[] {
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  }).filter(r => Object.values(r).some(v => v));
}

export function runHeuristicMiner(csvData: string, caseIdColumn: string, activityColumn: string, timestampColumn: string, dependencyThreshold = 0.5, loopTwoThreshold = 0.5): MinerResult {
  const rows = parseCSV(csvData);
  if (!rows.length) throw new Error('CSV vacio o sin datos validos');

  const events: MinerEvent[] = rows
    .filter(r => r[caseIdColumn] && r[activityColumn] && r[timestampColumn])
    .map(r => ({ case_id: r[caseIdColumn], activity: r[activityColumn], timestamp: new Date(r[timestampColumn]) }))
    .filter(e => !isNaN(e.timestamp.getTime()));

  if (!events.length) throw new Error('No se encontraron eventos validos');

  const cases = new Map<string, MinerEvent[]>();
  events.forEach(ev => { if (!cases.has(ev.case_id)) cases.set(ev.case_id, []); cases.get(ev.case_id)!.push(ev); });
  cases.forEach(evts => evts.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));

  const actFreq = new Map<string, number>();
  const startActs = new Map<string, number>();
  const endActs = new Map<string, number>();
  const dfg = new Map<string, number>();

  cases.forEach(evts => {
    if (!evts.length) return;
    startActs.set(evts[0].activity, (startActs.get(evts[0].activity) || 0) + 1);
    endActs.set(evts[evts.length - 1].activity, (endActs.get(evts[evts.length - 1].activity) || 0) + 1);
    evts.forEach((ev, i) => {
      actFreq.set(ev.activity, (actFreq.get(ev.activity) || 0) + 1);
      if (i < evts.length - 1) { const k = `${ev.activity}->${evts[i+1].activity}`; dfg.set(k, (dfg.get(k) || 0) + 1); }
    });
  });

  const activities = Array.from(actFreq.keys());
  const depMatrix = new Map<string, number>();
  activities.forEach(a => activities.forEach(b => {
    const ab = dfg.get(`${a}->${b}`) || 0, ba = dfg.get(`${b}->${a}`) || 0;
    depMatrix.set(`${a}->${b}`, a === b ? ab / (ab + 1) : (ab - ba) / (ab + ba + 1));
  }));

  const nodes: MinerNode[] = activities.map(act => ({ id: act, label: act, frequency: actFreq.get(act) || 0, is_start: startActs.has(act), is_end: endActs.has(act) }));
  const edges: MinerEdge[] = [];
  const edgeSet = new Set<string>();

  activities.forEach(a => {
    activities.forEach(b => {
      if (a === b) return;
      const dep = depMatrix.get(`${a}->${b}`) || 0;
      const freq = dfg.get(`${a}->${b}`) || 0;
      if (dep >= dependencyThreshold && freq > 0 && !edgeSet.has(`${a}->${b}`)) {
        edges.push({ id: `${a}->${b}`, source: a, target: b, frequency: freq, dependency: Math.round(dep * 10000) / 10000, type: 'normal' });
        edgeSet.add(`${a}->${b}`);
      }
      const ab = dfg.get(`${a}->${b}`) || 0, ba = dfg.get(`${b}->${a}`) || 0;
      if (ab > 0 && ba > 0 && (ab + ba) / (ab + ba + 1) >= loopTwoThreshold && !edgeSet.has(`${b}->${a}`)) {
        const dep2 = depMatrix.get(`${b}->${a}`) || 0;
        edges.push({ id: `${b}->${a}`, source: b, target: a, frequency: ba, dependency: Math.round(dep2 * 10000) / 10000, type: 'loop_length_two' });
        edgeSet.add(`${b}->${a}`);
      }
    });
  });

  return { nodes, edges, stats: { total_cases: cases.size, total_events: events.length, avg_events_per_case: cases.size > 0 ? Math.round(events.length / cases.size * 100) / 100 : 0, activity_count: activities.length } };
}
 
