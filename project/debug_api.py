import requests
import json

try:
    resp = requests.get('http://localhost:8000/api/v1/matches/live')
    data = resp.json()
    if data:
        print("Keys in first item:", list(data[0].keys()))
        print("First item sample:", json.dumps(data[0], indent=2))
    else:
        print("No data received")
except Exception as e:
    print(f"Error: {e}")
