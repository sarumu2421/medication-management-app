import aiohttp
from typing import List, Dict
from datetime import datetime
from urllib.parse import quote

async def check_drug_interactions(medications: List[str]) -> Dict:
    """
    Check for drug-drug interactions using OpenFDA API
    
    Args:
        medications: List of medication names
    
    Returns:
        Dictionary with interaction results
    """
    if len(medications) < 2:
        return {
            "has_interactions": False,
            "interactions": [],
            "message": "Need at least 2 medications to check for interactions"
        }
    
    interactions_found = []
    
    try:
        # Use OpenFDA drug label API to check for interactions
        async with aiohttp.ClientSession() as session:
            for i, med1 in enumerate(medications):
                for med2 in medications[i+1:]:
                    # Query OpenFDA for drug label information
                    # Properly encode medication names to prevent URL injection
                    encoded_med1 = quote(med1)
                    encoded_med2 = quote(med2)
                    url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:\"{encoded_med1}\"+AND+drug_interactions:\"{encoded_med2}\"&limit=1"
                    
                    try:
                        async with session.get(url) as response:
                            if response.status == 200:
                                data = await response.json()
                                if data.get("results"):
                                    result = data["results"][0]
                                    interaction_info = result.get("drug_interactions", ["No specific interaction details available"])[0]
                                    
                                    interactions_found.append({
                                        "medication1": med1,
                                        "medication2": med2,
                                        "severity": "warning",
                                        "description": interaction_info[:200] + "..." if len(interaction_info) > 200 else interaction_info
                                    })
                    except Exception as e:
                        # If specific API call fails, continue checking other pairs
                        print(f"Error checking interaction between {med1} and {med2}: {str(e)}")
                        continue
        
        if interactions_found:
            return {
                "has_interactions": True,
                "interactions": interactions_found,
                "message": f"Found {len(interactions_found)} potential interaction(s). Please consult your healthcare provider."
            }
        else:
            return {
                "has_interactions": False,
                "interactions": [],
                "message": "No known interactions found in the database. Always consult your healthcare provider."
            }
    
    except Exception as e:
        print(f"Error in drug interaction check: {str(e)}")
        return {
            "has_interactions": False,
            "interactions": [],
            "message": f"Unable to check interactions at this time. Error: {str(e)}"
        }
