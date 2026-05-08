import React from 'react';
import { motion } from 'framer-motion';
import { SwordIcon, GoldIcon, XPIcon } from '../components/icons/DotaIcons';

const PlayerCard = ({ player, index }) => {
    // Mock data fallback if player prop is minimal
    const {
        name,
        role = "Carry",
        hero = "Anti-Mage",
        gpm = player?.gold_per_min || 650,
        xpm = player?.xp_per_min || 700,
        kda = "10 / 2 / 8",
        avatar
    } = player || {};

    const isRadiant = index < 5; // First 5 are Radiant
    const sideColor = isRadiant ? 'dota-radiant' : 'dota-dire';
    const borderColor = isRadiant ? 'border-dota-radiant-dim' : 'border-dota-dire-dim';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, x: -5 }}
            className={`relative w-full mb-3 bg-dota-card border-l-4 ${isRadiant ? 'border-l-dota-radiant-DEFAULT' : 'border-l-dota-dire-DEFAULT'} border-y border-r border-dota-border p-3 shadow-panel group overflow-hidden`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${isRadiant ? 'from-dota-radiant-dim/20' : 'from-dota-dire-dim/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10 flex items-center justify-between">
                {/* Hero Avatar & Name */}
                <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-full border border-dota-border overflow-hidden">
                        {/* Placeholder for hero image */}
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                            {avatar ? <img src={avatar} alt={hero} /> : hero[0]}
                        </div>
                        <div className={`absolute inset-0 ring-2 ${isRadiant ? 'ring-dota-radiant-DEFAULT' : 'ring-dota-dire-DEFAULT'} rounded-full opacity-70`} />
                    </div>
                    <div>
                        <h4 className="text-dota-gold font-radiance text-sm font-bold tracking-wider">{name}</h4>
                        <p className="text-xs text-gray-400 font-sans">{role} • <span className="text-white">{hero}</span></p>
                    </div>
                </div>

                {/* Stat Bars */}
                <div className="flex flex-col space-y-1 min-w-[100px]">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><SwordIcon className="w-3 h-3" /> KDA</span>
                        <span className="font-mono text-white">{kda}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-500/80 flex items-center gap-1"><GoldIcon className="w-3 h-3 text-yellow-500" /> GPM</span>
                        <span className="font-mono text-dota-gold">{gpm}</span>
                    </div>
                </div>
            </div>

            {/* Hover Glow */}
            <motion.div
                className={`absolute -inset-1 rounded-lg blur-lg bg-${isRadiant ? 'dota-radiant' : 'dota-dire'}-glow opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
            />
        </motion.div>
    );
};

export default PlayerCard;
