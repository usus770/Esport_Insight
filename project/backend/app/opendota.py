"""OpenDota API client with caching."""
import os
import httpx
from typing import List, Dict, Any
from .cache import cached_fetch

OPENDOTA_BASE = os.getenv("OPENDOTA_BASE", "https://api.opendota.com/api")


def _fetch_url(path: str) -> Any:
    """Fetch data from OpenDota API."""
    url = f"{OPENDOTA_BASE}{path}"
    with httpx.Client(timeout=30.0, verify=False) as client:
        response = client.get(url)
        response.raise_for_status()
        return response.json()


def get_pro_matches() -> List[Dict[str, Any]]:
    """Get recent pro matches (cached 300s)."""
    return cached_fetch(
        "pro_matches",
        ttl_sec=300,
        fetch_fn=lambda: _fetch_url("/proMatches")
    )


def get_live() -> List[Dict[str, Any]]:
    """Get live matches (cached 30s)."""
    return cached_fetch(
        "live",
        ttl_sec=30,
        fetch_fn=lambda: _fetch_url("/live")
    )


def get_match_details(match_id: int) -> Dict[str, Any]:
    """Get match details (cached 3600s)."""
    return cached_fetch(
        f"match_{match_id}",
        ttl_sec=3600,
        fetch_fn=lambda: _fetch_url(f"/matches/{match_id}")
    )

def get_heroes() -> List[Dict[str, Any]]:
    """Get hero constants (cached 86400s)."""
    return cached_fetch(
        "heroes",
        ttl_sec=86400,
        fetch_fn=lambda: _fetch_url("/heroStats")
    )


def get_live_pro_matches() -> List[Dict[str, Any]]:
    """Get currently live pro matches (cached 30s)."""
    return cached_fetch(
        "live_pro_matches",
        ttl_sec=30,
        fetch_fn=lambda: _fetch_url("/live")
    )


def get_recent_pro_matches(limit: int = 20) -> List[Dict[str, Any]]:
    """Get recently completed pro matches (cached 120s)."""
    return cached_fetch(
        f"recent_pro_matches_{limit}",
        ttl_sec=120,
        fetch_fn=lambda: _fetch_url(f"/proMatches?limit={limit}")
    )


def get_public_matches(limit: int = 20) -> List[Dict[str, Any]]:
    """Get high-MMR public matches as ranked fallback (cached 60s)."""
    return cached_fetch(
        f"public_matches_{limit}",
        ttl_sec=60,
        fetch_fn=lambda: _fetch_url(f"/publicMatches?mmr_ascending=0")
    )


def get_all_live_matches() -> List[Dict[str, Any]]:
    """Aggregate all match sources and deduplicate."""
    pro_live = []
    pro_recent = []
    ranked = []

    try:
        pro_live = get_live_pro_matches()
    except Exception as e:
        print(f"[OpenDota] Live pro fetch failed: {e}")

    try:
        pro_recent = get_recent_pro_matches(limit=10)
    except Exception as e:
        print(f"[OpenDota] Recent pro fetch failed: {e}")

    try:
        ranked = get_public_matches(limit=15)
    except Exception as e:
        print(f"[OpenDota] Public matches fetch failed: {e}")

    combined = []
    seen_ids = set()

    for match in [*pro_live, *pro_recent, *ranked]:
        mid = match.get('match_id') or match.get('match_seq_num')
        if mid and mid not in seen_ids:
            seen_ids.add(mid)
            combined.append(match)

    return combined
