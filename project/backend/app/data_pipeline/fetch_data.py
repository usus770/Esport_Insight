import httpx
import json
import time
import os
import pathlib

# Configuration
DATASET_DIR = pathlib.Path(__file__).parent.parent.parent / "dataset"
OUTPUT_FILE = DATASET_DIR / "public_matches.json"
MIN_RANK = 80 # Immortal Rank
TARGET_MATCHES = 2500
BATCH_SIZE = 100

def fetch_matches():
    """Fetch high-MMR public matches from OpenDota."""
    
    if not DATASET_DIR.exists():
        DATASET_DIR.mkdir(parents=True, exist_ok=True)
        
    matches = []
    last_match_id = None
    
    print(f"Fetching {TARGET_MATCHES} matches (Min Rank: {MIN_RANK})...")
    
    with httpx.Client(timeout=30.0) as client:
        while len(matches) < TARGET_MATCHES:
            try:
                params = {"min_rank": MIN_RANK}
                if last_match_id:
                    params["less_than_match_id"] = last_match_id
                    
                response = client.get("https://api.opendota.com/api/publicMatches", params=params)
                response.raise_for_status()
                
                batch = response.json()
                
                if not batch:
                    print("No more matches found.")
                    break
                    
                matches.extend(batch)
                last_match_id = batch[-1]["match_id"]
                
                print(f"Fetched {len(matches)} / {TARGET_MATCHES} matches. Last ID: {last_match_id}")
                
                # Respect rate limits (60/min free tier -> 1s delay is safe)
                time.sleep(1.0) 
                
            except Exception as e:
                print(f"Error fetching matches: {e}")
                time.sleep(5) # Backoff on error
                
    # Save to file
    print(f"Saving {len(matches)} matches to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w") as f:
        json.dump(matches, f)
    print("Done.")

if __name__ == "__main__":
    fetch_matches()
