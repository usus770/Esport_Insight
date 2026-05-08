from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class PlayerMetrics(BaseModel):
    role: str
    hero: str
    win_prob_20min: float
    gold_diff: int
    gpm: int
    benchmark_gpm: int
    xpm: int
    kill_participation: float # percentage 0-100
    deaths: int
    hero_winrate: float # current patch winrate
    
    # Model Insights
    top_important_features: List[str]
    performance_drop_detected: bool
    momentum_shift_detected: bool

class CoachingEngine:
    def analyze(self, m: PlayerMetrics) -> Dict[str, Any]:
        return {
            "diagnosis": self._diagnose(m),
            "weaknesses": self._identify_weaknesses(m),
            "tactics": self._prescribe_tactics(m),
            "drills": self._prescribe_drills(m),
            "mechanical_focus": self._mechanical_advice(m),
            "strategic_advice": self._strategic_advice(m),
            "meta_advice": self._meta_advice(m),
            "summary": self._generate_summary(m)
        }

    def _prescribe_drills(self, m: PlayerMetrics) -> List[Dict[str, str]]:
        drills = []
        
        # Last Hitting Drill
        if m.gpm < m.benchmark_gpm:
            drills.append({
                "name": "Last Hit Trainer (Polygon)",
                "desc": "Complete 10 mins of Last Hit Trainer. Aim for 3600+ score (Gold Tier).",
                "difficulty": "Medium"
            })
            
        # Positioning / Survival
        if m.deaths > 5:
            drills.append({
                "name": "Fog of War Shimmy",
                "desc": "Watch replay: Identify 3 instances where you showed on lane without vision of enemy initiation.",
                "difficulty": "Hard"
            })
            
        # Spell Casting / Mechanics
        if m.role == "Core" or m.hero_winrate < 48:
             drills.append({
                "name": "Combo Breaker (Demo Mode)",
                "desc": f"Practice {m.hero}'s full combo on dummy targets with items. Execute 10 times perfectly.",
                "difficulty": "Easy"
            })
            
        if not drills:
            drills.append({
                "name": "Map Awareness Check",
                "desc": "Play a game and force yourself to check the minimap after every single last hit.",
                "difficulty": "Medium"
            })
            
        return drills

    def _diagnose(self, m: PlayerMetrics) -> str:
        diagnosis = []
        
        # Win Prob context
        if m.win_prob_20min < 40:
            diagnosis.append(f"At 20 min, the game state was critical ({m.win_prob_20min}% win prob).")
        elif m.win_prob_20min > 60:
            diagnosis.append(f"You had a solid mid-game advantage ({m.win_prob_20min}% win prob).")
        else:
            diagnosis.append("The game remained even heading into the mid-game.")
            
        # Performance vs Benchmark
        gpm_perf = m.gpm / m.benchmark_gpm if m.benchmark_gpm > 0 else 1.0
        if gpm_perf < 0.85:
            diagnosis.append(f"Your economy was significantly behind the average for {m.role} ({m.gpm} GPM vs {m.benchmark_gpm} benchmark).")
        elif gpm_perf > 1.15:
            diagnosis.append(f"You exceeded the economic expectations for your role ({m.gpm} GPM).")
            
        if m.deaths > 8:
            diagnosis.append("Frequent deaths likely disrupted your momentum and fed the enemy team.")
            
        if not diagnosis:
            diagnosis.append("Your performance indicators show a standard game with no extreme statistical outliers.")
            
        return " ".join(diagnosis)

    def _identify_weaknesses(self, m: PlayerMetrics) -> List[str]:
        weaknesses = []
        
        # GPM
        if m.gpm < m.benchmark_gpm * 0.9:
            weaknesses.append("Sub-optimal Farming Efficiency")
            
        # Deaths
        if m.deaths > 6:
            weaknesses.append("High Mortality Rate / Positioning Errors")
        elif m.deaths > 10:
            weaknesses.append("Feeding / Critical Positioning Failures")
            
        # KP
        if m.kill_participation < 40 and m.role.lower() not in ["carry", "hard carry"]:
             weaknesses.append("Low Kill Participation (Passive Play)")
        elif m.kill_participation < 30:
             weaknesses.append("Isolated from Team Fights")
             
        # Drop
        if m.performance_drop_detected:
            weaknesses.append("Inconsistent Performance (Drop Detected)")
            
        if not weaknesses:
            weaknesses.append("No major statistical weaknesses detected.")
            
        return weaknesses

    def _prescribe_tactics(self, m: PlayerMetrics) -> List[str]:
        tactics = []
        
        # Farm
        if m.gpm < m.benchmark_gpm * 0.9:
            tactics.append("Prioritize safe farm patterns when the map is dark.")
            tactics.append("Stack camps while rotating between lanes to maximize efficiency.")
            
        # Deaths
        if m.deaths > 6:
            tactics.append("Wait for your initiator before showing in lanes during the mid-game.")
            tactics.append("Review vision before crossing the river; avoid blind aggressive moves.")
            
        # Role specifics
        role = m.role.lower()
        if "support" in role:
            if m.kill_participation < 50:
                tactics.append("Smoke gank mid or safe lane to break the laning phase stagnation.")
        elif "offlane" in role:
            if m.gold_diff < -2000:
                tactics.append("Build aura items (Pipe, Mekansm) to sustain high-ground defense.")
                
        # Drop
        if m.performance_drop_detected:
            tactics.append("Focus on resetting mentally after a death; buyback only for key objectives.")
            
        if not tactics:
            tactics.append("Continue maintaining map pressure and secure Rosh control.")
            
        return tactics

    def _mechanical_advice(self, m: PlayerMetrics) -> str:
        advice = []
        if m.gpm < m.benchmark_gpm:
             advice.append("Practice last-hitting under tower and jungle camp stacking timings.")
             
        if m.deaths > 5:
            advice.append("Drill defensive item usage (BKB, Glimmer, Eul's) reaction times.")
            
        if not advice:
            advice.append("Refine spell casting efficiency and tread switching for mana conservation.")
            
        return " ".join(advice)

    def _strategic_advice(self, m: PlayerMetrics) -> str:
        if m.gold_diff < -5000:
             return "When behind, avoid fair fights. Look for pickoffs with smoke or split push to delay the game."
        elif m.gold_diff > 5000:
             return "When ahead, control their jungle and Rosh. Don't force high ground without Aegis or a pickoff."
        else:
             return "The game is close. Vision control around objectives (Rosh/Tormentors) will decide the outcome."

    def _meta_advice(self, m: PlayerMetrics) -> str:
        if m.hero_winrate < 48:
             return f"{m.hero} is currently weak in the meta ({m.hero_winrate}% WR). Consider picking high-tier alternatives for your role."
        elif m.hero_winrate > 53:
             return f"{m.hero} is strong right now ({m.hero_winrate}% WR). abuse this power spike by playing aggressively."
        else:
             return f"{m.hero} is balanced. Your performance matters more than the hero strength."

    def _generate_summary(self, m: PlayerMetrics) -> str:
        gpm_status = "efficient" if m.gpm >= m.benchmark_gpm else "lagging"
        return f"A {gpm_status} performance on {m.hero}, heavily influenced by {m.deaths} deaths."

# Global instance
coach = CoachingEngine()
