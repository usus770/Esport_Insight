import requests
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OpenDotaIngestor:
    def __init__(self):
        self.base_url = settings.OPENDOTA_API_URL

    def get_live_matches(self):
        """
        Fetch live pro matches. OpenDota /live endpoint provides real-time data.
        Returns a mock list if API fails or returns empty, to ensure UI demo works.
        """
        try:
            response = requests.get(f"{self.base_url}/live", timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # Filter for meaningful matches
            matches = [m for m in data if m.get('radiant_score', 0) + m.get('dire_score', 0) > 0][:10]
            if matches:
                return matches
                
            raise Exception("No active high-score matches found")

        except Exception as e:
            logger.warning(f"Live matches fetch failed or empty ({e}). Using mock data for demo.")
            # Return realistic mock data to safeguard the UI experience
            return [
                {
                    "match_id": 123456,
                    "team_name_radiant": "Team Spirit",
                    "team_name_dire": "Gaimin Gladiators",
                    "radiant_score": 24,
                    "dire_score": 18,
                    "game_time": 2450,
                    "league_name": "The International 2025"
                },
                {
                    "match_id": 123457,
                    "team_name_radiant": "Team Liquid",
                    "team_name_dire": "BetBoom Team",
                    "radiant_score": 12,
                    "dire_score": 15,
                    "game_time": 1200,
                    "league_name": "DreamLeague S22"
                },
                {
                    "match_id": 123459,
                    "team_name_radiant": "OG",
                    "team_name_dire": "Tundra Esports",
                    "radiant_score": 5,
                    "dire_score": 2,
                    "game_time": 600,
                    "league_name": "ESL One Birmingham"
                }
            ]

    def get_pro_matches(self):
        """
        Fetch recent pro matches (completed).
        """
        try:
            response = requests.get(f"{self.base_url}/proMatches")
            response.raise_for_status()
            return response.json()[:20]
        except Exception as e:
            logger.error(f"Error fetching pro matches: {e}")
            return []
