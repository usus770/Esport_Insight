from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional


class PredictIn(BaseModel):
    avg_gpm: float
    avg_xpm: float
    kill_participation_avg: float
    first_blood_time: float
    tower_status_delta: float
    hero_diversity_delta: float
    meta_wr_delta: float
    meta_pk_delta: float
    duration: float


class PredictOut(BaseModel):
    win_prob_radiant: float


class PlayerSummary(BaseModel):
    player_slot: int
    is_radiant: bool
    hero_id: int
    role: int
    gpm: float
    xpm: float
    kda: float
    deltas: Dict[str, float]


class MatchFeaturesOut(BaseModel):
    patch: str
    features: Dict[str, Any]
    players: List[PlayerSummary]


# Authentication schemas
class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: Optional[str] = None



