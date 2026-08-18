import csv
import random
from datetime import datetime, timedelta

def generate_crm_log(output_path="crm_event_log.csv", num_cases=150):
    activities = [
        "Crear Lead",
        "Contactar Cliente",
        "Calificar Lead",
        "Agendar Demo",
        "Realizar Demo",
        "Enviar Propuesta",
        "Negociación",
        "Aprobación Legal",
        "Cerrar Ganado",
        "Cerrar Perdido"
    ]
    
    # Resources (users)
    sales_reps = ["Ana Gomez", "Luis Perez", "Maria Rodriguez", "Juan Martinez"]
    managers = ["Carlos Mendoza", "Elena Silva"]
    legal_team = ["Abog. Ruiz", "Abog. Castro"]
    
    lost_reasons = [
        "Precio muy alto",
        "La calidad no le gusta al cliente",
        "Sin presupuesto / Proyecto cancelado",
        "No tiene credito con la empresa",
        "No tenemos el producto (sin existencias)",
        "Percibe mal servicio de parte de empresa"
    ]
    
    # We will generate a list of events. Each event is a dict.
    events = []
    
    # Start time
    base_time = datetime(2026, 7, 1, 9, 0, 0)
    
    for case_idx in range(1, num_cases + 1):
        case_id = f"OPP-{1000 + case_idx}"
        
        # Determine path type for this case
        path_rand = random.random()
        
        case_events = []
        current_time = base_time + timedelta(
            days=random.randint(0, 15), 
            hours=random.randint(0, 23), 
            minutes=random.randint(0, 59)
        )
        
        # 1. Crear Lead (Always first)
        case_events.append({
            "case_id": case_id,
            "activity": "Crear Lead",
            "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "resource": random.choice(sales_reps),
            "amount": random.randint(1000, 50000),
            "lost_reason": ""
        })
        
        # Time gap before next activity
        current_time += timedelta(hours=random.randint(1, 24), minutes=random.randint(10, 50))
        
        # 2. Contactar Cliente
        case_events.append({
            "case_id": case_id,
            "activity": "Contactar Cliente",
            "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "resource": case_events[-1]["resource"],
            "amount": case_events[-1]["amount"],
            "lost_reason": ""
        })
        
        current_time += timedelta(hours=random.randint(2, 48))
        
        if path_rand < 0.15:
            # Path A: Fast reject
            case_events.append({
                "case_id": case_id,
                "activity": "Cerrar Perdido",
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "resource": case_events[-1]["resource"],
                "amount": case_events[-1]["amount"],
                "lost_reason": random.choice(lost_reasons)
            })
        else:
            # 3. Calificar Lead
            case_events.append({
                "case_id": case_id,
                "activity": "Calificar Lead",
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "resource": case_events[-1]["resource"],
                "amount": case_events[-1]["amount"],
                "lost_reason": ""
            })
            
            current_time += timedelta(days=random.randint(1, 3))
            
            # Decide if Demo is needed
            has_demo = random.random() < 0.70
            if has_demo:
                case_events.append({
                    "case_id": case_id,
                    "activity": "Agendar Demo",
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "resource": case_events[-1]["resource"],
                    "amount": case_events[-1]["amount"],
                    "lost_reason": ""
                })
                
                current_time += timedelta(days=random.randint(1, 4))
                case_events.append({
                    "case_id": case_id,
                    "activity": "Realizar Demo",
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "resource": case_events[-1]["resource"],
                    "amount": case_events[-1]["amount"],
                    "lost_reason": ""
                })
                current_time += timedelta(days=random.randint(1, 2))
            
            # 4. Enviar Propuesta
            case_events.append({
                "case_id": case_id,
                "activity": "Enviar Propuesta",
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "resource": case_events[-1]["resource"],
                "amount": case_events[-1]["amount"],
                "lost_reason": ""
            })
            
            current_time += timedelta(days=random.randint(1, 5))
            
            # Negociación loop or Legal
            # Some cases will loop back to proposal (Negociación -> Enviar Propuesta -> Negociación)
            loop_proposal = random.random() < 0.25
            if loop_proposal:
                case_events.append({
                    "case_id": case_id,
                    "activity": "Negociación",
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "resource": random.choice(managers),
                    "amount": case_events[-1]["amount"],
                    "lost_reason": ""
                })
                current_time += timedelta(days=random.randint(2, 5))
                # Modify amount in negotiation
                new_amount = int(case_events[-1]["amount"] * random.uniform(0.85, 0.95))
                case_events.append({
                    "case_id": case_id,
                    "activity": "Enviar Propuesta",
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "resource": case_events[-2]["resource"],
                    "amount": new_amount,
                    "lost_reason": ""
                })
                current_time += timedelta(days=random.randint(1, 3))
            
            # Negotiation
            case_events.append({
                "case_id": case_id,
                "activity": "Negociación",
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "resource": random.choice(managers),
                "amount": case_events[-1]["amount"],
                "lost_reason": ""
            })
            current_time += timedelta(days=random.randint(1, 4))
            
            # Legal check for large deals
            is_large_deal = case_events[-1]["amount"] > 15000
            if is_large_deal and random.random() < 0.85:
                case_events.append({
                    "case_id": case_id,
                    "activity": "Aprobación Legal",
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "resource": random.choice(legal_team),
                    "amount": case_events[-1]["amount"],
                    "lost_reason": ""
                })
                current_time += timedelta(days=random.randint(1, 3))
            
            # Outcome
            is_won = random.random() < 0.65
            outcome = "Cerrar Ganado" if is_won else "Cerrar Perdido"
            
            case_events.append({
                "case_id": case_id,
                "activity": outcome,
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "resource": case_events[-1]["resource"] if outcome == "Cerrar Perdido" else random.choice(managers),
                "amount": case_events[-1]["amount"],
                "lost_reason": random.choice(lost_reasons) if outcome == "Cerrar Perdido" else ""
            })
            
        events.extend(case_events)
        
    # Write to CSV
    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["case_id", "activity", "timestamp", "resource", "amount", "lost_reason"])
        for ev in events:
            writer.writerow([ev["case_id"], ev["activity"], ev["timestamp"], ev["resource"], ev["amount"], ev["lost_reason"]])
            
    print(f"Generated CRM log with {len(events)} events across {num_cases} cases at: {output_path}")

if __name__ == "__main__":
    generate_crm_log()
