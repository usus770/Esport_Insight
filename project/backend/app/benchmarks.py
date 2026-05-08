"""Pro benchmarks per role."""
from typing import Dict, Any

# Role mapping: 1=Carry, 2=Mid, 3=Offlane, 4=Support, 5=Hard Support


def role_benchmarks() -> Dict[int, Dict[str, float]]:
    """
    Hardcoded minimal pro benchmarks per role.
    
    Returns:
        dict[role] -> {gpm: float, xpm: float, kda_ratio: float}
    """
    return {
        1: {  # Carry
            "gpm": 550.0,
            "xpm": 600.0,
            "kda_ratio": 2.5,
        },
        2: {  # Mid
            "gpm": 500.0,
            "xpm": 650.0,
            "kda_ratio": 2.8,
        },
        3: {  # Offlane
            "gpm": 450.0,
            "xpm": 550.0,
            "kda_ratio": 2.2,
        },
        4: {  # Support
            "gpm": 350.0,
            "xpm": 450.0,
            "kda_ratio": 1.8,
        },
        5: {  # Hard Support
            "gpm": 300.0,
            "xpm": 400.0,
            "kda_ratio": 1.5,
        },
    }








