from datetime import datetime

def send_medication_reminder(medication_name: str, schedule_time: str):
    """
    Send medication reminder notification.
    Currently logs to console. Can be upgraded to email/SMS later.
    
    Args:
        medication_name: Name of the medication
        schedule_time: Scheduled time(s) for the medication
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n{'='*60}")
    print(f"MEDICATION REMINDER")
    print(f"{'='*60}")
    print(f"Timestamp: {timestamp}")
    print(f"Medication: {medication_name}")
    print(f"Scheduled Time(s): {schedule_time}")
    print(f"{'='*60}\n")

def send_interaction_warning(medication1: str, medication2: str, description: str):
    """
    Send drug interaction warning notification.
    Currently logs to console. Can be upgraded to email/SMS later.
    
    Args:
        medication1: First medication name
        medication2: Second medication name
        description: Interaction description
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n{'='*60}")
    print(f"⚠️  DRUG INTERACTION WARNING ⚠️")
    print(f"{'='*60}")
    print(f"Timestamp: {timestamp}")
    print(f"Medications: {medication1} + {medication2}")
    print(f"Warning: {description}")
    print(f"Please consult your healthcare provider!")
    print(f"{'='*60}\n")
