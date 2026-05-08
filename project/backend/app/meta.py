"""Meta-awareness: hero meta features."""
import sqlite3
import pathlib
import pandas as pd
from typing import Dict, Any, List

DB_PATH = pathlib.Path("/data/meta.db")

def ensure_db() -> None:
    """Create database and tables if they don't exist."""
    # Ensure directory exists
    if not DB_PATH.parent.exists():
        try:
            DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        except:
            pass # Might be permission issue if not in docker, ignore for now
            
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    # Simple hero_stats table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS hero_stats (
            hero_id INTEGER PRIMARY KEY,
            winrate REAL,
            matches INTEGER
        )
    """)
    conn.commit()
    conn.close()

def train_and_save_meta(matches_df: pd.DataFrame, players_df: pd.DataFrame) -> None:
    """
    Calculate hero win rates from the provided DataFrames and save to DB.
    """
    ensure_db()
    
    print("Training Meta Stats (Hero Win Rates)...")
    merged = players_df.merge(matches_df[['match_id', 'radiant_win']], on='match_id', how='inner')
    merged['is_radiant'] = merged['player_slot'] < 128
    
    # Handle boolean/string differences
    if merged['radiant_win'].dtype == 'object':
         merged['radiant_win'] = merged['radiant_win'].map({'True': 1, 'False': 0, True: 1, False: 0})
    
    merged['won'] = (merged['is_radiant'] == (merged['radiant_win'] == 1))
    
    # Aggregation
    hero_stats = merged.groupby('hero_id').agg(
        matches=('match_id', 'count'),
        wins=('won', 'sum')
    ).reset_index()
    
    # Smoothing
    global_avg = 0.5
    C = 10 
    hero_stats['win_rate'] = (hero_stats['wins'] + C * global_avg) / (hero_stats['matches'] + C)
    
    # Save to DB
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    # Clear old stats
    cursor.execute("DELETE FROM hero_stats")
    
    # Bulk insert
    data_to_insert = [
        (int(row['hero_id']), float(row['win_rate']), int(row['matches']))
        for _, row in hero_stats.iterrows()
    ]
    cursor.executemany("INSERT INTO hero_stats (hero_id, winrate, matches) VALUES (?, ?, ?)", data_to_insert)
    
    conn.commit()
    conn.close()
    print(f"Saved meta stats for {len(data_to_insert)} heroes.")

def get_hero_meta() -> Dict[int, float]:
    """
    Load hero win rates from DB.
    Returns: dict {hero_id: winrate}
    """
    if not DB_PATH.exists():
        return {}
        
    try:
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        cursor.execute("SELECT hero_id, winrate FROM hero_stats")
        rows = cursor.fetchall()
        conn.close()
        return {r[0]: r[1] for r in rows}
    except Exception as e:
        print(f"Error loading meta: {e}")
        return {}

def add_meta_features(match_feats: Dict[str, Any], players_feats: List[Dict[str, Any]], hero_meta: Dict[int, float]) -> Dict[str, Any]:
    """
    Add meta features to a single match feature dict.
    """
    if not players_feats:
        match_feats['radiant_avg_wr'] = 0.5
        match_feats['dire_avg_wr'] = 0.5
        match_feats['wr_diff'] = 0.0
        return match_feats
        
    radiant_wrs = []
    dire_wrs = []
    
    for p in players_feats:
        hid = p.get('hero_id', 0)
        wr = hero_meta.get(hid, 0.5)
        
        if p.get('is_radiant'):
            radiant_wrs.append(wr)
        else:
            dire_wrs.append(wr)
            
    rad_avg = sum(radiant_wrs) / len(radiant_wrs) if radiant_wrs else 0.5
    dire_avg = sum(dire_wrs) / len(dire_wrs) if dire_wrs else 0.5
    
    match_feats['radiant_avg_wr'] = rad_avg
    match_feats['dire_avg_wr'] = dire_avg
    match_feats['wr_diff'] = rad_avg - dire_avg
    
    return match_feats








