import React from 'react';
import { motion } from 'framer-motion';
import { SwordIcon, WardIcon, GoldIcon } from '../components/icons/DotaIcons';

const TimelineEvent = ({ time, type, description, side = 'radiant' }) => {
    const isRadiant = side === 'radiant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start mb-6 relative pl-6 border-l-2 ${isRadiant ? 'border-dota-radiant-DEFAULT' : 'border-dota-dire-DEFAULT'}`}
        >
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-dota-black border-2 ${isRadiant ? 'border-dota-radiant-DEFAULT' : 'border-dota-dire-DEFAULT'} z-10`} />

            <div className="ml-2">
                <span className="text-xs font-mono text-gray-500 mb-1 block">{time}</span>
                <div className="bg-dota-charcoal/80 p-3 rounded-r border border-dota-border backdrop-blur-sm shadow-sm hover:bg-dota-card transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        {type === 'kill' && <SwordIcon className="w-4 h-4 text-dota-red" />}
                        {type === 'ward' && <WardIcon className="w-4 h-4 text-dota-gold" />}
                        {type === 'roshan' && <GoldIcon className="w-4 h-4 text-red-500" />}
                        <h5 className={`text-sm font-bold ${isRadiant ? 'text-dota-radiant-DEFAULT' : 'text-dota-dire-DEFAULT'}`}>
                            {type.toUpperCase()}
                        </h5>
                    </div>
                    <p className="text-xs text-gray-300">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const MatchTimeline = ({ events }) => {
    // Mock events if none provided
    const displayEvents = events || [
        { time: '10:00', type: 'roshan', description: 'Dire team claimed Aegis of the Immortal', side: 'dire' },
        { time: '12:30', type: 'kill', description: 'Anti-Mage achieved Triple Kill', side: 'radiant' },
        { time: '15:45', type: 'ward', description: 'Vision restored in Roshan pit', side: 'radiant' },
    ];

    return (
        <div className="h-full bg-dota-black/50 p-4 border-r border-dota-border overflow-y-auto custom-scrollbar">
            <h3 className="text-dota-gold font-radiance tracking-widest text-lg mb-6 border-b border-dota-border pb-2">
                Combat Log
            </h3>
            <div className="relative">
                {displayEvents.map((event, i) => (
                    <TimelineEvent key={i} {...event} />
                ))}
            </div>
        </div>
    );
};

export default MatchTimeline;
