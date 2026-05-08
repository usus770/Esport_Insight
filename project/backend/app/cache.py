"""JSON file cache for API responses."""
import json
import pathlib
import time
from typing import Any, Callable, Optional
from app.core.config import settings

CACHE_DIR = pathlib.Path(settings.CACHE_DIR)
CACHE_DIR.mkdir(parents=True, exist_ok=True)


def read_json(name: str) -> Optional[dict]:
    """Read JSON from cache file."""
    fp = CACHE_DIR / name
    if not fp.exists():
        return None
    try:
        return json.loads(fp.read_text())
    except (json.JSONDecodeError, IOError):
        return None


def write_json(name: str, data: Any) -> None:
    """Write JSON to cache file."""
    fp = CACHE_DIR / name
    fp.parent.mkdir(parents=True, exist_ok=True)
    fp.write_text(json.dumps(data, indent=2))


def cached_fetch(key: str, ttl_sec: int, fetch_fn: Callable[[], Any]) -> Any:
    """
    Fetch data with caching.
    
    Args:
        key: Cache file name
        ttl_sec: Time-to-live in seconds
        fetch_fn: Function to fetch data if cache miss/expired
        
    Returns:
        Cached or freshly fetched data
    """
    cache_file = f"{key}.json"
    cached = read_json(cache_file)
    
    if cached is not None:
        # Check TTL
        fp = CACHE_DIR / cache_file
        age = time.time() - fp.stat().st_mtime
        if age < ttl_sec:
            return cached
    
    # Cache miss or expired - fetch fresh
    data = fetch_fn()
    write_json(cache_file, data)
    return data








