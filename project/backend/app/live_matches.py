"""Match tier classification and priority engine for live matches."""
from enum import IntEnum
from typing import Optional, List, Dict, Any


class MatchTier(IntEnum):
    INTERNATIONAL = 1
    SCRIM = 2
    PRO_ESPORT = 3
    RANKED = 4


INTERNATIONAL_LEAGUE_IDS = {
    14417, 13256, 15728, 15438, 15626, 16435,
}

SCRIM_KEYWORDS = [
    'scrim', 'practice', 'scrimmage', 'training',
    'bootcamp', 'boot camp', 'warmup', 'warm-up',
]


def classify_match(match: dict) -> MatchTier:
    league_id = match.get('leagueid') or match.get('league_id', 0)
    lobby_type = match.get('lobby_type', -1)
    game_mode = match.get('game_mode', -1)
    series_type = match.get('series_type', -1)
    league_obj = match.get('league') or {}
    league_name = (league_obj.get('name') or match.get('league_name') or '').lower()
    league_tier = (league_obj.get('tier') or match.get('league_tier') or '').lower()

    # Priority 1: International / Major
    if league_id in INTERNATIONAL_LEAGUE_IDS:
        return MatchTier.INTERNATIONAL
    if 'international' in league_name or 'the international' in league_name:
        return MatchTier.INTERNATIONAL
    if league_tier in ('premium', 'professional') and league_id > 0:
        return MatchTier.INTERNATIONAL

    # Priority 2: Scrims
    if lobby_type == 1:
        return MatchTier.SCRIM
    if any(kw in league_name for kw in SCRIM_KEYWORDS):
        return MatchTier.SCRIM

    # Priority 3: Pro Esport
    if league_id > 0:
        return MatchTier.PRO_ESPORT
    if lobby_type == 2:
        return MatchTier.PRO_ESPORT
    if game_mode == 2:
        return MatchTier.PRO_ESPORT
    if series_type in (1, 2):
        return MatchTier.PRO_ESPORT

    # Priority 4: Ranked
    return MatchTier.RANKED


def get_tier_label(tier: MatchTier) -> str:
    return {
        MatchTier.INTERNATIONAL: 'Tournament',
        MatchTier.SCRIM: 'Scrim',
        MatchTier.PRO_ESPORT: 'Pro Match',
        MatchTier.RANKED: 'Ranked',
    }[tier]


def get_tier_color(tier: MatchTier) -> str:
    return {
        MatchTier.INTERNATIONAL: '#FFD700',
        MatchTier.SCRIM: '#9B72F8',
        MatchTier.PRO_ESPORT: '#5B9CF6',
        MatchTier.RANKED: '#4A4F68',
    }[tier]


def sort_matches_by_priority(matches: list) -> list:
    def sort_key(m):
        tier = classify_match(m)
        spectators = m.get('spectators', 0) or m.get('spectator_count', 0) or 0
        return (int(tier), -spectators)
    return sorted(matches, key=sort_key)


LEAGUE_NAMES = {
    14417: "The International 2023",
    13256: "ESL One Berlin Major",
    15728: "Riyadh Masters",
    15438: "Bali Major",
    15626: "DreamLeague Season 21",
    16435: "BetBoom Dacha",
}


def filter_to_priority(matches: list, show_all: bool = False) -> dict:
    sorted_matches = sort_matches_by_priority(matches)
    by_tier: Dict[int, list] = {}

    for match in sorted_matches:
        tier = int(classify_match(match))
        
        # Inject known premium tournament names if they are missing
        lid = match.get('leagueid') or match.get('league_id') or 0
        if lid in LEAGUE_NAMES and not match.get('league_name'):
            match['league_name'] = LEAGUE_NAMES[lid]

        match['_tier'] = tier
        match['_tier_label'] = get_tier_label(MatchTier(tier))
        match['_tier_color'] = get_tier_color(MatchTier(tier))
        by_tier.setdefault(tier, []).append(match)

    tiers_available = sorted(by_tier.keys())
    active_tier = tiers_available[0] if tiers_available else 4

    if show_all:
        filtered = sorted_matches
    else:
        filtered = by_tier.get(active_tier, [])

    return {
        'active_tier': active_tier,
        'active_tier_label': get_tier_label(MatchTier(active_tier)),
        'tiers_available': tiers_available,
        'matches': filtered,
        'by_tier': {str(k): v for k, v in by_tier.items()},
        'total_live': len(sorted_matches),
    }
