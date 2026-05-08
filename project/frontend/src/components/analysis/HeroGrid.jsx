import React from 'react';
import { motion } from 'framer-motion';
import { getHeroImageUrl } from '../../utils/heroUtils';

const HeroGrid = ({ players, onSelectHero, selectedHeroId }) => {
    // Sort players by team (Radiant < 128, Dire >= 128)
    // Assuming 'player_slot' is available, otherwise just split array
    const radiant = players.filter(p => p.player_slot < 128).slice(0, 5);
    const dire = players.filter(p => p.player_slot >= 128).slice(0, 5);

    return (
        <div className="flex flex-col gap-4 h-full">
            <TeamColumn team="Radiant" players={radiant} color="text-green-400" onSelect={onSelectHero} selectedId={selectedHeroId} />
            <div className="h-px bg-white/10 w-full my-2"></div>
            <TeamColumn team="Dire" players={dire} color="text-red-400" onSelect={onSelectHero} selectedId={selectedHeroId} />
        </div>
    );
};

const TeamColumn = ({ team, players, color, onSelect, selectedId }) => (
    <div className="flex-1 flex flex-col gap-2">
        <h3 className={`text-xs font-bold uppercase tracking-widest pl-2 border-l-2 ${team === 'Radiant' ? 'border-green-500' : 'border-red-500'} ${color}`}>
            {team} Team
        </h3>
        <div className="flex flex-col gap-2">
            {players.map((p) => {
                const isSelected = selectedId === p.account_id;
                return (
                    <motion.div
                        key={p.account_id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        onClick={() => onSelect(p)}
                        className={`relative flex items-center gap-3 p-2 rounded cursor-pointer transition-all border
                ${isSelected
                                ? 'bg-white/10 border-dota-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                                : 'bg-black/30 border-white/5 hover:bg-white/5'
                            }`}
                    >
                        {/* Hero Portrait (Mini) */}
                        <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden shrink-0 border border-white/10">
                            {/* Fallback Image */}
                            <img
                                src={getHeroImageUrl(p.hero_name)}
                                alt={p.hero_name}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-dota-gold' : 'text-gray-200'}`}>
                                    {p.name || `Player ${p.account_id}`}
                                </p>
                                {isSelected && <span className="text-[10px] text-dota-gold uppercase font-mono">Selected</span>}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 font-mono mt-0.5">
                                <span>{p.hero_name}</span>
                                <span>{p.kda}</span>
                            </div>
                        </div>

                        {/* Impact Bar (Visual) */}
                        <div className="w-1 h-8 rounded-full bg-gray-800 overflow-hidden">
                            <div
                                className={`w-full ${team === 'Radiant' ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ height: `${Math.random() * 80 + 20}%` }} // Mock impact score
                            />
                        </div>

                    </motion.div>
                );
            })}
        </div>
    </div>
);

export default HeroGrid;
