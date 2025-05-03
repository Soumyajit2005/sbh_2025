import json

with open("backend/sample_linkedin_profiles.json", "r") as file:
    raw_data = json.load(file)
    profile_db = {k.lower(): v for k, v in raw_data.items()}  # Normalize keys

def get_profile(job_title: str):
    return profile_db.get(job_title.lower(), []) 