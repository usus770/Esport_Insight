import requests
import json

try:
    resp = requests.get('http://localhost:8000/api/v1/matches/live')
    data = resp.json()
    if data and len(data) > 0:
        keys = list(data[0].keys())
        print(f"Keys found: {keys}")
        print("Radiant Team Name:", data[0].get("team_name_radiant"))
        print("Dire Team Name:", data[0].get("team_name_dire"))
    else:
        print("No data received or empty list")
except Exception as e:
    print(f"Error: {e}")
