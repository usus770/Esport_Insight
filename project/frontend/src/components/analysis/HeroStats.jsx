import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Crosshair, Zap, Activity } from 'lucide-react';

import { getItemImageUrl, itemMap } from '../../utils/itemUtils';

const HeroStats = ({ hero }) => {
    const [itemConstants, setItemConstants] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        // Fetch item constants for tooltips
        fetch('https://api.opendota.com/api/constants/items')
            .then(res => res.json())
            .then(data => setItemConstants(data))
            .catch(err => console.error("Failed to fetch item data", err));
    }, []);

    if (!hero) return null;

    // Helper to calculate KDA Ratio
    const kdaRatio = ((hero.kills + hero.assists) / (hero.deaths || 1)).toFixed(2);

    // Items array from hero object
    const items = [
        hero.item_0, hero.item_1, hero.item_2,
        hero.item_3, hero.item_4, hero.item_5
    ];

    const handleMouseEnter = (itemId, e) => {
        if (!itemConstants) return;
        const itemName = itemMap[itemId];
        const data = itemConstants[itemName];
        if (data) {
            const rect = e.target.getBoundingClientRect();
            setHoveredItem({
                ...data,
                x: rect.left + rect.width / 2,
                y: rect.top
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={hero.id}
            className="flex flex-col gap-4 bg-[#0F1216] border border-white/10 rounded-xl p-4 shadow-lg w-full relative"
        >
            {/* Tooltip Overlay */}
            <AnimatePresence>
                {hoveredItem && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 pointer-events-none w-64 bg-[#1a1f26] border border-blue-500/30 shadow-2xl rounded-lg overflow-hidden"
                        style={{
                            left: hoveredItem.x,
                            top: hoveredItem.y,
                            transform: 'translate(-50%, -100%) translateY(-10px)'
                        }}
                    >
                        {/* Header */}
                        <div className="bg-[#15191f] p-3 border-b border-white/5 flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white text-sm">{hoveredItem.dname}</h4>
                                <div className="text-yellow-400 text-xs font-mono mt-0.5 flex items-center gap-1">
                                    <span className="text-yellow-600">$</span> {hoveredItem.cost}
                                </div>
                            </div>
                            {hoveredItem.img && (
                                <img src={`https://cdn.cloudflare.steamstatic.com${hoveredItem.img}`} className="w-8 h-6 object-contain opacity-80" />
                            )}
                        </div>

                        {/* Check if attrib exists and is an array before mapping */}
                        {hoveredItem.attrib && Array.isArray(hoveredItem.attrib) && hoveredItem.attrib.length > 0 && (
                            <div className="p-3 bg-[#12151a] border-b border-white/5 space-y-1">
                                {hoveredItem.attrib.map((attr, i) => (
                                    attr.display && (
                                        <div key={i} className="text-[10px] text-gray-400">
                                            {attr.display.replace('{value}', attr.value)}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Cooldown & Mana */}
                        {(hoveredItem.cd || hoveredItem.mc) && (
                            <div className="px-3 py-2 flex gap-3 border-b border-white/5 bg-[#15191f]">
                                {hoveredItem.mc && (
                                    <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        {hoveredItem.mc}
                                    </div>
                                )}
                                {hoveredItem.cd && (
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                        {hoveredItem.cd}s
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Lore/Notes */}
                        {hoveredItem.lore && (
                            <div className="p-3">
                                <p className="text-[10px] text-gray-500 italic leading-snug">
                                    {hoveredItem.lore}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Main Stats Grid */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-white/5">
                <StatGroup title="Combat" stats={[
                    { label: "K/D/A", value: `${hero.kills}/${hero.deaths}/${hero.assists}`, color: "text-white" },
                    { label: "KDA Ratio", value: kdaRatio, color: "text-dota-gold" },
                    { label: "Hero Dmg", value: hero.hero_damage ? (hero.hero_damage / 1000).toFixed(1) + 'k' : '0', color: "text-red-400" },
                ]} />
                <StatGroup title="Farming" stats={[
                    { label: "Net Worth", value: (hero.net_worth / 1000).toFixed(1) + 'k', color: "text-yellow-400" },
                    { label: "GPM / XPM", value: `${hero.gold_per_min || 0} / ${hero.xp_per_min || 0}`, color: "text-gray-300" },
                    { label: "Last Hits", value: `${hero.last_hits || 0} / ${hero.denies || 0}`, color: "text-gray-300" },
                ]} />
                <StatGroup title="Support" stats={[
                    { label: "Tower Dmg", value: hero.tower_damage || 0, color: "text-white" },
                    { label: "Healing", value: hero.hero_healing || 0, color: "text-green-400" },
                    { label: "Wards", value: "2 / 4", color: "text-blue-300" }, // Mock data for now
                ]} />
                <StatGroup title="Misc" stats={[
                    { label: "Level", value: hero.level || 25, color: "text-white" },
                    { label: "Gold", value: hero.gold || 0, color: "text-yellow-600" },
                    { label: "Buyback", value: "Yes", color: "text-green-500" },
                ]} />
            </div>

            {/* 2. Items & Coach Analysis */}
            <div className="grid grid-cols-2 gap-4">
                {/* Inventory (Mock) */}
                <div className="bg-black/20 p-3 rounded border border-white/5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Inventory</h4>
                    <div className="flex gap-2 justify-between">
                        {items.map((itemId, i) => {
                            const imgUrl = getItemImageUrl(itemId);
                            return (
                                <div
                                    key={i}
                                    className="w-10 h-10 bg-gray-800 rounded border border-white/10 relative group cursor-help overflow-visible"
                                    onMouseEnter={(e) => handleMouseEnter(itemId, e)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt={`Item ${itemId}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('bg-red-900/20'); // Visual indicator of failure
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Simplified Coach Analysis */}
                <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-300 uppercase">AI Insight</span>
                    </div>
                    <div className="text-xs text-blue-100 leading-relaxed min-h-[40px] flex items-center">
                        {(() => {
                            if (hero.deaths > 8) return "High death count detected. Recommendation: Play safer and stick to high-ground.";
                            if (hero.gold_per_min > 700) return "Exceptional farming efficiency. You are hitting your item timings early.";
                            if (hero.kills > 10) return "Dominating the map! Your kill participation is creating immense space.";
                            if (hero.xp_per_min < 400 && hero.level < 15) return "XP falling behind. Prioritize lane soaking and wisdom runes.";
                            return "Performance is stable. Focus on objectives and map control.";
                        })()}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatGroup = ({ title, stats }) => (
    <div className="flex flex-col gap-2">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
        <div className="flex flex-col gap-1">
            {stats.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-1 last:border-0">
                    <span className="text-gray-500">{s.label}</span>
                    <span className={`font-mono font-bold ${s.color}`}>{s.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default HeroStats;
