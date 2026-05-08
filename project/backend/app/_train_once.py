"""Training script with meta features integration."""
from .data_pipeline.csv_loader import CsvLoader
from .features import build_match_features, to_dataframe
from .meta import train_and_save_meta
from .model import train_baseline

# 1. Load Data
loader = CsvLoader()
if loader.matches_df.empty:
    print("Database empty, skipping.")
    exit(0)

print(f"Loaded {len(loader.matches_df)} matches.")

# 2. Train Meta (Hero Win Rates)
print("Updating Meta Stats...")
train_and_save_meta(loader.matches_df, loader.players_df)

# 3. Build Features
print("Building Features...")
rows = []

# For training, we can process a subset or all
# Since DB lookups might be slow row-by-row, this loop might be slow.
# Optimizations (batch processing) would be better but keeping it simple for V1 matching existing structure.
# Getting match_json-like dict from DFs is tricky. 
# Better: We iterate matches_df and reconstruct the 'match_json' expected by build_match_features
# OR... we refactor build_match_features to take DF rows. 
# But features.py expects dict.

# Let's construct a minimal dict
match_ids = loader.matches_df['match_id'].values
players_grouped = loader.players_df.groupby('match_id')

count = 0
for match_id in match_ids:
    if match_id not in players_grouped.groups:
        continue
        
    p_df = players_grouped.get_group(match_id)
    
    # Construct minimal match_json
    # We need: radiant_win, players list
    r_win = loader.matches_df[loader.matches_df['match_id'] == match_id].iloc[0]['radiant_win']
    
    # Convert p_df to list of dicts
    p_list = p_df.to_dict('records')
    
    match_json = {
        "match_id": match_id,
        "radiant_win": r_win,
        "players": p_list
    }
    
    feat = build_match_features(match_json)
    if feat:
        rows.append(feat)
        
    count += 1
    if count % 1000 == 0:
        print(f"Processed {count} matches...")

# 4. Train Model
print("Training Model...")
dfX, y = to_dataframe(rows)
if dfX.empty:
    print("No features generated.")
    exit(1)

model = train_baseline(dfX, y)
print("Training Complete.")



