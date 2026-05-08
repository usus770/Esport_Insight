
// Mappings from Display Name to Internal Valve Name
// Only needed when the names differ significantly
const HERO_NAME_MAPPINGS = {
    "magnus": "magnataur",
    "anti-mage": "antimage",
    "centaur warrunner": "centaur",
    "clockwerk": "rattletrap",
    "doom": "doom_bringer",
    "lifestealer": "life_stealer",
    "nature's prophet": "furion",
    "necrophos": "necrolyte",
    "outworld destroyer": "obsidian_destroyer",
    "queen of pain": "queenofpain",
    "shadow fiend": "nevermore",
    "timbersaw": "shredder",
    "treant protector": "treant",
    "underlord": "abyssal_underlord",
    "vengeful spirit": "vengefulspirit",
    "windranger": "windrunner",
    "wraith king": "skeleton_king", // Sometimes used, though 'wraith_king' is main now. Keeping flexible.
    "zeus": "zuus",
    "io": "wisp"
};

/**
 * Generates the full CDN URL for a hero image.
 * @param {string} heroName - The display name of the hero (e.g. "Magnus", "Dark Seer").
 * @param {boolean} isFull - If true, returns the full body splash art. If false, returns the small sidebar icon.
 * @returns {string} The full CDN URL.
 */
export const getHeroImageUrl = (heroName, isFull = false) => {
    if (!heroName) return null;

    const lowerName = heroName.toLowerCase();

    // 1. Check direct mapping first
    let internalName = HERO_NAME_MAPPINGS[lowerName];

    // 2. If no mapping, use standard formatting (replace spaces with underscores)
    if (!internalName) {
        internalName = lowerName.replace(/ /g, '_');
    }

    const suffix = isFull ? '_full.png' : '_sb.png';
    return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${internalName}${suffix}`;
};
