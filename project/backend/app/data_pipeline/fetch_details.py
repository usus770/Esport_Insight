import requests
import json
import time
import pandas as pd
import os
import sys

# Rate limit handling
RATE_LIMIT_DELAY = 1.1 # 60 req/min -> 1 req/sec

def fetch_details():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "..", "..", "dataset")
    public_matches_path = os.path.join(dataset_dir, "public_matches.json")
    
    match_csv_path = os.path.join(dataset_dir, "match.csv")
    players_csv_path = os.path.join(dataset_dir, "players.csv")
    
    if not os.path.exists(public_matches_path):
        print("public_matches.json not found. Run fetch_data.py first.")
        return

    print(f"Loading matches from {public_matches_path}...")
    with open(public_matches_path, "r") as f:
        matches = json.load(f)
        
    print(f"Found {len(matches)} matches. Fetching details for top 100 to enable calibration...")
    # Calibration only needs a small sample locally, 100 is enough to demonstrate.
    
    detailed_matches = []
    all_players = []
    
    count = 0
    max_count = 100 
    
    for m in matches:
        if count >= max_count:
            break
            
        mid = m['match_id']
        url = f"https://api.opendota.com/api/matches/{mid}"
        
        try:
            print(f"Fetching match {mid} ({count+1}/{max_count})...")
            resp = requests.get(url)
            
            if resp.status_code == 200:
                data = resp.json()
                
                # Extract Match Data
                detailed_matches.append({
                    "match_id": data.get("match_id"),
                    "radiant_win": data.get("radiant_win"),
                    "duration": data.get("duration"),
                    "start_time": data.get("start_time"),
                    "game_mode": data.get("game_mode"),
                    "lobby_type": data.get("lobby_type")
                })
                
                # Extract Player Data
                if "players" in data:
                    for p in data["players"]:
                        all_players.append({
                            "match_id": data.get("match_id"),
                            "account_id": p.get("account_id"),
                            "player_slot": p.get("player_slot"),
                            "hero_id": p.get("hero_id"),
                            "gold_per_min": p.get("gold_per_min"),
                            "xp_per_min": p.get("xp_per_min"),
                            "kills": p.get("kills"),
                            "deaths": p.get("deaths"),
                            "assists": p.get("assists")
                        })
                
                count += 1
            elif resp.status_code == 429:
                print("Rate limited. Sleeping 5s...")
                time.sleep(5)
                continue
            else:
                print(f"Failed to fetch {mid}: {resp.status_code}")
                
            time.sleep(RATE_LIMIT_DELAY)
            
        except Exception as e:
            print(f"Error fetching {mid}: {e}")
            
    # Save to CSV
    print(f"Saving {len(detailed_matches)} matches to CSV...")
    df_matches = pd.DataFrame(detailed_matches)
    df_matches.to_csv(match_csv_path, index=False)
    
    print(f"Saving {len(all_players)} players to CSV...")
    df_players = pd.DataFrame(all_players)
    df_players.to_csv(players_csv_path, index=False)
    
    print("Done. Datasets created for calibration.")

if __name__ == "__main__":
    fetch_details()
