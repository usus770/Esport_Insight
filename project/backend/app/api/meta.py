from fastapi import APIRouter

router = APIRouter()

def get_hero_img_id(name):
    mapping = {
        "Anti-Mage": "antimage",
        "Treant Protector": "treant",
        "Nature's Prophet": "furion",
        "Vengeful Spirit": "vengefulspirit",
        "Windranger": "windrunner"
    }
    if name in mapping:
        return mapping[name]
    return name.lower().replace(" ", "_").replace("'", "")

@router.get("/heroes")
async def get_meta_heroes():
    # Mock data for patch 7.37
    def make_hero(name, win_rate, pick_rate, ban_rate, tier):
        img_id = get_hero_img_id(name)
        image_url = f"https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{img_id}.png"
        return {
            "name": name,
            "image": image_url,
            "win_rate": win_rate,
            "pick_rate": pick_rate,
            "ban_rate": ban_rate,
            "tier": tier
        }

    hero_stats = [
        make_hero("Muerta", "54.2%", "18.5%", "22.1%", "S"),
        make_hero("Brewmaster", "53.8%", "12.3%", "15.4%", "S"),
        make_hero("Treant Protector", "52.9%", "14.1%", "10.2%", "S"),
        make_hero("Lion", "51.5%", "25.2%", "8.5%", "A"),
        make_hero("Slardar", "51.2%", "11.8%", "9.1%", "A"),
        make_hero("Spectre", "50.8%", "9.5%", "12.6%", "A"),
        make_hero("Windranger", "51.9%", "21.1%", "14.5%", "A"),
        make_hero("Pudge", "48.5%", "30.1%", "25.0%", "B"),
        make_hero("Anti-Mage", "49.1%", "15.0%", "18.0%", "B"),
        make_hero("Invoker", "47.2%", "16.4%", "11.1%", "C"),
    ]

    tier_list = [
        {"tier": "S", "color": "text-dota-gold border-dota-gold", "bg": "bg-yellow-900/40", "heroes": [h for h in hero_stats if h['tier'] == 'S']},
        {"tier": "A", "color": "text-gray-300 border-gray-400", "bg": "bg-gray-800/60", "heroes": [h for h in hero_stats if h['tier'] == 'A']},
        {"tier": "B", "color": "text-orange-400 border-orange-500/50", "bg": "bg-orange-900/30", "heroes": [h for h in hero_stats if h['tier'] == 'B']},
        {"tier": "C", "color": "text-red-500 border-red-500/50", "bg": "bg-red-900/20", "heroes": [h for h in hero_stats if h['tier'] == 'C']},
    ]

    return {
        "patch": "7.37",
        "trends": [
            {"name": "Universal Heroes", "stat": "+5.2% Winrate", "direction": "up"},
            {"name": "Solar Crest", "stat": "-2.1% Pickrate", "direction": "down"},
            {"name": "Glimmer Cape", "stat": "+3.4% Pickrate", "direction": "up"},
            {"name": "Midlane Ganks", "stat": "-1.5% Success", "direction": "down"}
        ],
        "tier_list": tier_list,
        "hero_stats": hero_stats
    }
