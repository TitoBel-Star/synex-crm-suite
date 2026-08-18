import sys
import json
import pandas as pd
import pm4py

def main():
    if len(sys.argv) < 7:
        print(json.dumps({"error": "Insufficient arguments. Usage: python process_miner.py <csv_path> <case_id> <activity> <timestamp> <dep_threshold> <loop_two_threshold>"}))
        return

    csv_path = sys.argv[1]
    case_id_col = sys.argv[2]
    activity_col = sys.argv[3]
    timestamp_col = sys.argv[4]
    dep_thresh = float(sys.argv[5])
    loop_two_thresh = float(sys.argv[6])

    try:
        # Load CSV data
        df = pd.read_csv(csv_path)
        
        # Sort and clean dataframe
        df = df.dropna(subset=[case_id_col, activity_col, timestamp_col])
        
        # Convert timestamp column using pm4py utility
        df = pm4py.format_dataframe(
            df, 
            case_id=case_id_col, 
            activity_key=activity_col, 
            timestamp_key=timestamp_col
        )
        
        # Discover Heuristics Net
        hnet = pm4py.discover_heuristics_net(
            df, 
            dependency_threshold=dep_thresh, 
            loop_two_threshold=loop_two_thresh,
            activity_key='concept:name',
            timestamp_key='time:timestamp',
            case_id_key='case:concept:name'
        )
        
        # Prepare Nodes
        nodes = []
        for act in hnet.activities:
            # Get occurrence count for this activity
            occ = int(hnet.activities_occurrences.get(act, 0)) if hasattr(hnet, 'activities_occurrences') else 0
            is_start = act in hnet.start_activities
            is_end = act in hnet.end_activities
            
            nodes.append({
                "id": act,
                "label": act,
                "frequency": occ,
                "is_start": is_start,
                "is_end": is_end
            })
            
        # Prepare Edges (Active arcs + Loop-2 arcs)
        edges = []
        edge_set = set()
        
        # Extract active edges from node output_connections
        for src_name, nd in hnet.nodes.items():
            for target_nd in nd.output_connections.keys():
                tgt_name = target_nd.node_name
                
                # Retrieve frequency from dfg
                freq = int(hnet.dfg.get((src_name, tgt_name), 0))
                # Retrieve dependency score
                dep = float(hnet.dependency_matrix.get(src_name, {}).get(tgt_name, 0.0))
                
                edge_id = f"{src_name}->{tgt_name}"
                edges.append({
                    "id": edge_id,
                    "source": src_name,
                    "target": tgt_name,
                    "frequency": freq,
                    "dependency": round(dep, 4),
                    "type": "normal"
                })
                edge_set.add((src_name, tgt_name))
                
            # Extract loop length two edges if present and passed threshold
            loop_2 = getattr(nd, 'loop_length_two', {})
            if isinstance(loop_2, dict):
                for tgt_name, freq in loop_2.items():
                    if (src_name, tgt_name) not in edge_set:
                        # Find dependency score if available
                        dep = float(hnet.dependency_matrix.get(src_name, {}).get(tgt_name, 0.0))
                        edge_id = f"{src_name}->{tgt_name}"
                        edges.append({
                            "id": edge_id,
                            "source": src_name,
                            "target": tgt_name,
                            "frequency": int(freq),
                            "dependency": round(dep, 4),
                            "type": "loop_length_two"
                        })
                        edge_set.add((src_name, tgt_name))
                        
        # Basic Stats
        total_cases = df['case:concept:name'].nunique()
        total_events = len(df)
        
        stats = {
            "total_cases": total_cases,
            "total_events": total_events,
            "avg_events_per_case": round(total_events / total_cases, 2) if total_cases > 0 else 0,
            "activity_count": len(hnet.activities)
        }
        
        # Return success payload
        output = {
            "nodes": nodes,
            "edges": edges,
            "stats": stats
        }
        print(json.dumps(output, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": f"Error during mining: {str(e)}"}, ensure_ascii=False))

if __name__ == "__main__":
    main()
