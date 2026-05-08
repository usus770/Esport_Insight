"""Tests for meta-awareness features."""
import pytest
from app.meta import ensure_db, get_hero_meta, add_meta_features


def test_meta_features():
    """Test meta feature addition."""
    # Ensure DB exists
    ensure_db()
    
    # Get hero meta for a patch
    patch = "7.35"
    hero_meta = get_hero_meta(patch)
    
    # Should have some heroes
    assert len(hero_meta) > 0
    
    # Test add_meta_features
    match_feats = {
        "avg_gpm": 500.0,
        "avg_xpm": 600.0,
        "kill_participation_avg": 0.5,
        "first_blood_time": 120.0,
        "tower_status_delta": 2,
        "hero_diversity_delta": 0,
        "duration": 1800.0,
    }
    
    players_feats = [
        {
            "player_slot": 0,
            "is_radiant": True,
            "hero_id": 1,  # Should be in dummy data
        },
        {
            "player_slot": 1,
            "is_radiant": True,
            "hero_id": 2,
        },
        {
            "player_slot": 128,
            "is_radiant": False,
            "hero_id": 3,
        },
        {
            "player_slot": 129,
            "is_radiant": False,
            "hero_id": 4,
        },
    ]
    
    result = add_meta_features(match_feats, players_feats, hero_meta)
    
    # Should have meta features added
    assert "meta_wr_delta" in result
    assert "meta_pk_delta" in result
    
    # Values should be floats
    assert isinstance(result["meta_wr_delta"], float)
    assert isinstance(result["meta_pk_delta"], float)








