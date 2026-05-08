import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Shield, Sword, Sparkles } from 'lucide-react';
import { dotaTheme } from '../../theme/dotaTheme';
import { getHeroImageUrl } from '../../utils/heroUtils';

const HeroDeepDive = ({ hero, isRadiant }) => {
    const [heroConstants, setHeroConstants] = useState(null);
    const [hoveredHeroData, setHoveredHeroData] = useState(null);

    useEffect(() => {
        fetch('https://api.opendota.com/api/constants/heroes')
            .then(res => res.json())
            .then(data => setHeroConstants(data))
            .catch(err => console.error("Failed to fetch hero data", err));
    }, []);

    if (!hero) return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-white/5 rounded-xl bg-gradient-to-br from-black/40 to-black/10">
            <Crosshair className="w-12 h-12 text-gray-600 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Select a Hero</h3>
            <p className="text-sm text-gray-600 mt-2">Click on a player card to analyze their performance.</p>
        </div>
    );

    const handleMouseEnter = (e) => {
        if (!heroConstants || !hero) return;
        // Find hero ID - match by localized name if needed, or ID if available.
        // Assuming hero.hero_id is available, otherwise try to find by name match
        let data = heroConstants[hero.hero_id];

        if (!data) {
            // Fallback: search values for matching name
            const found = Object.values(heroConstants).find(h => h.localized_name === hero.hero_name);
            if (found) data = found;
        }

        if (data) {
            const rect = e.target.getBoundingClientRect();
            setHoveredHeroData({
                ...data,
                x: rect.left + rect.width / 2,
                y: rect.top
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={hero.id} // Re-animate on hero change
            className="h-full flex flex-col gap-4 bg-[#0F1216] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative"
        >
            {/* Tooltip Overlay */}
            <AnimatePresence>
                {hoveredHeroData && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 pointer-events-none w-72 bg-[#1a1f26]/95 backdrop-blur-md border border-dota-red/30 shadow-2xl rounded-lg overflow-hidden"
                        style={{
                            left: hoveredHeroData.x,
                            top: hoveredHeroData.y,
                            transform: 'translate(-50%, -50%)' // Centered
                        }}
                    >
                        <div className="bg-[#15191f] p-3 border-b border-white/5 flex items-center justify-between">
                            <h4 className="font-bold text-white uppercase tracking-wider">{hoveredHeroData.localized_name}</h4>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">{hoveredHeroData.primary_attr}</span>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <Sword className="w-3 h-3 text-red-400" />
                                <span>Attack Type: <span className="text-white font-bold">{hoveredHeroData.attack_type}</span></span>
                            </div>

                            <div>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Roles</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {hoveredHeroData.roles.map(role => (
                                        <span key={role} className="text-[10px] bg-blue-900/30 text-blue-200 border border-blue-500/20 px-1.5 py-0.5 rounded">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Header / Artwork */}
            <div
                className="relative h-full bg-gray-900 overflow-hidden group border-b border-white/5"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setHoveredHeroData(null)}
            >
                <div className={`absolute inset-0 bg-gradient-to-t ${isRadiant ? 'from-green-900/40' : 'from-red-900/40'} to-transparent z-10 pointer-events-none`} />
                {/* Hero Splash Art */}
                <div className="absolute inset-0 bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700 transform scale-100 group-hover:scale-105 pointer-events-none"
                    style={{ backgroundImage: `url(${getHeroImageUrl(hero.hero_name, true)})` }}>
                </div>

                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                    <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] uppercase tracking-tight font-display">
                        {hero.hero_name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded text-[10px] uppercase text-dota-gold tracking-widest font-bold">
                            Level 25
                        </span>
                        <span className="text-xs text-gray-300 font-mono">
                            Played by <span className="text-white font-bold">{hero.name}</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HeroDeepDive;
