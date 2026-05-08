import requests
import json
import time

def test_recommendation():
    url = "http://127.0.0.1:8000/api/recommend"
    
    # Test Case 1: Empty draft, Recommend Carry for Radiant
    payload = {
        "radiant_picks": [],
        "dire_picks": [],
        "role": "Carry",
        "side": "radiant"
    }
    
    print(f"Testing {url} with payload: {payload}")
    
    max_retries = 5
    for i in range(max_retries):
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print("Success!")
                print("Recommendations:", json.dumps(response.json(), indent=2))
                return
            else:
                print(f"Failed with status {response.status_code}: {response.text}")
                break
        except requests.exceptions.ConnectionError:
            print(f"Connection refused, retrying ({i+1}/{max_retries})...")
            time.sleep(2)
            
    print("Test failed after retries.")

if __name__ == "__main__":
    test_recommendation()
