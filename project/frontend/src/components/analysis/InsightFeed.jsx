import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Skull, Shield, Target } from 'lucide-react';

const InsightFeed = ({ events }) => {
    // Mock data if no events provided
    const feedItems = events && events.length > 0 ? events : [
        { id: 1, time: '32:15', type: 'critical', message: 'Radiant Victory Probability > 95%', icon: TrendingUp },
        { id: 2, time: '30:40', type: 'combat', message: 'Teamwipe at Roshan Pit (5-0)', icon: Skull },
        { id: 3, time: '28:10', type: 'objective', message: 'Dire lost Bottom Barracks', icon: Shield },
        { id: 4, time: '22:00', type: 'info', message: 'Yatoro completed Battle Fury', icon: Target },
        { id: 5, time: '18:30', type: 'mistake', message: 'Mid Tower undefended for 45s', icon: AlertTriangle },
    ];

    return (
        <div className="h-full flex flex-col bg-[#0F1216] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Analysis Feed</h3>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-green-500 font-mono">REAL-TIME</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {feedItems.map((item, index) => (
                    <FeedItem key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

const FeedItem = ({ item, index }) => {
    const isCritical = item.type === 'critical';
    const Icon = item.icon || Target;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-3 rounded-lg border flex gap-3 ${isCritical
                    ? 'bg-dota-rad-glow/10 border-dota-rad-glow/30'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
        >
            {/* Time Column */}
            <div className="flex flex-col items-center justify-start pt-1 min-w-[40px]">
                <span className={`text-xs font-mono font-bold ${isCritical ? 'text-dota-gold' : 'text-gray-500'}`}>
                    {item.time}
                </span>
                <div className="h-full w-px bg-white/10 mt-1"></div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-1">
                <div className={`flex items-center gap-2 mb-1 ${isCritical ? 'text-dota-gold' : 'text-gray-300'
                    }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase opacity-80">{item.type}</span>
                </div>
                <p className="text-sm text-gray-200 leading-snug">
                    {item.message}
                </p>
            </div>

            {/* Critical Indicator */}
            {isCritical && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-dota-rad-glow/50 rounded-r-lg"></div>
            )}
        </motion.div>
    );
};

export default InsightFeed;
