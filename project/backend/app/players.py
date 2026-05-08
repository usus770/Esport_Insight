"""Player-centric performance analysis."""
from typing import Dict, List, Any, Optional
from .benchmarks import role_benchmarks


def infer_role(player: Dict[str, Any], all_players: List[Dict[str, Any]]) -> int:
    """
    Infer player role (1-5).
    
    Uses lane_role if present, else derives from gpm/networth ranking.
    """
    # Try lane_role first
    lane_role = player.get("lane_role")
    if lane_role is not None and lane_role in [1, 2, 3, 4, 5]:
        return int(lane_role)
    
    # Fallback: rank by GPM within team
    is_radiant = player.get("is_radiant", False)
    team_players = [p for p in all_players if p.get("is_radiant") == is_radiant]
    
    if len(team_players) < 5:
        # Not enough players, default to support
        return 4
    
    # Sort by GPM descending
    sorted_team = sorted(team_players, key=lambda p: p.get("gpm", 0), reverse=True)
    
    try:
        rank = sorted_team.index(player)
        # Map rank to role: 0=Carry, 1=Mid, 2=Offlane, 3=Support, 4=Hard Support
        return rank + 1
    except ValueError:
        return 4  # Default to support


def player_summary(player: Dict[str, Any], benchmarks: Dict[int, Dict[str, float]], all_players: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Generate player summary with role, metrics, and deltas vs benchmarks.
    
    Returns:
        {
            player_slot, is_radiant, hero_id, role,
            gpm, xpm, kda,
            deltas: {gpm_delta, xpm_delta, kda_delta}
        }
    """
    # Use role from player dict if set, else infer
    role = player.get("role")
    if role is None or role not in [1, 2, 3, 4, 5]:
        role = infer_role(player, all_players or [])
    
    gpm = float(player.get("gpm", 0))
    xpm = float(player.get("xpm", 0))
    kills = int(player.get("kills", 0))
    deaths = int(player.get("deaths", 1))  # Avoid div by zero
    assists = int(player.get("assists", 0))
    kda = (kills + assists) / deaths if deaths > 0 else (kills + assists)
    
    # Get benchmarks for role
    role_bench = benchmarks.get(role, benchmarks[4])  # Default to support
    
    deltas = {
        "gpm_delta": gpm - role_bench["gpm"],
        "xpm_delta": xpm - role_bench["xpm"],
        "kda_delta": kda - role_bench["kda_ratio"],
    }
    
    return {
        "player_slot": int(player.get("player_slot", 0)),
        "is_radiant": bool(player.get("is_radiant", False)),
        "hero_id": int(player.get("hero_id", 0)),
        "role": role,
        "gpm": gpm,
        "xpm": xpm,
        "kda": float(kda),
        "deltas": deltas,
    }


def team_player_summaries(match_json: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generate player summaries for all players in match.
    
    Returns:
        List of player summaries
    """
    from .features import build_match_features
    
    feat_result = build_match_features(match_json)
    if not feat_result or "players" not in feat_result:
        return []
    
    players_feats = feat_result["players"]
    benchmarks = role_benchmarks()
    
    # Re-infer roles with full context
    for player in players_feats:
        player["role"] = infer_role(player, players_feats)
    
    summaries = []
    for player in players_feats:
        summary = player_summary(player, benchmarks, players_feats)
        summaries.append(summary)
    
    return summaries

