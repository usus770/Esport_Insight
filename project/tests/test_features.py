"""Tests for feature engineering."""
import pytest
from app.features import build_match_features


def test_build_match_features():
    """Test that build_match_features returns all required keys."""
    # Create a minimal fake match_json
    match_json = {
        "match_id": 12345,
        "radiant_win": True,
        "duration": 1800,
        "first_blood_time": 120,
        "tower_status_radiant": 5,
        "tower_status_dire": 3,
        "players": [
            {
                "player_slot": 0,
                "isRadiant": True,
                "hero_id": 1,
                "kills": 5,
                "deaths": 2,
                "assists": 8,
                "gold_per_min": 500,
                "xp_per_min": 600,
                "lane_role": 1,
            },
            {
                "player_slot": 1,
                "isRadiant": True,
                "hero_id": 2,
                "kills": 3,
                "deaths": 4,
                "assists": 10,
                "gold_per_min": 450,
                "xp_per_min": 550,
                "lane_role": 2,
            },
            {
                "player_slot": 128,
                "isRadiant": False,
                "hero_id": 3,
                "kills": 4,
                "deaths": 3,
                "assists": 7,
                "gold_per_min": 480,
                "xp_per_min": 580,
                "lane_role": 1,
            },
            {
                "player_slot": 129,
                "isRadiant": False,
                "hero_id": 4,
                "kills": 2,
                "deaths": 5,
                "assists": 9,
                "gold_per_min": 420,
                "xp_per_min": 520,
                "lane_role": 2,
            },
        ]
    }
    
    result = build_match_features(match_json)
    
    # Assert structure
    assert result is not None
    assert "X" in result
    assert "y" in result
    assert "players" in result
    
    # Assert match features
    match_feats = result["X"]
    assert "avg_gpm" in match_feats
    assert "avg_xpm" in match_feats
    assert "kill_participation_avg" in match_feats
    assert "first_blood_time" in match_feats
    assert "tower_status_delta" in match_feats
    assert "hero_diversity_delta" in match_feats
    assert "duration" in match_feats
    
    # Assert players list is non-empty
    assert len(result["players"]) > 0
    
    # Assert player features structure
    player = result["players"][0]
    assert "player_slot" in player
    assert "is_radiant" in player
    assert "hero_id" in player
    assert "kills" in player
    assert "deaths" in player
    assert "assists" in player
    assert "gpm" in player
    assert "xpm" in player
    
    # Assert y is correct
    assert result["y"] == 1  # radiant_win = True





