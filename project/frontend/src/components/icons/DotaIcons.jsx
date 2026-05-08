import React from 'react';
import { Sword, Coins, Scroll, Eye } from 'lucide-react';

export const SwordIcon = ({ className = "w-6 h-6", color = "text-dota-radiant-DEFAULT" }) => (
    <div className={`relative ${className} group`}>
        <div className={`absolute inset-0 bg-dota-dire-glow blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
        <Sword className={`relative z-10 ${color} drop-shadow-[0_0_5px_rgba(230,36,18,0.8)]`} />
    </div>
);

export const GoldIcon = ({ className = "w-6 h-6", color = "text-dota-gold" }) => (
    <div className={`relative ${className} group`}>
        <div className={`absolute inset-0 bg-yellow-500/30 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
        <Coins className={`relative z-10 ${color} drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]`} />
    </div>
);

export const XPIcon = ({ className = "w-6 h-6", color = "text-blue-400" }) => (
    <div className={`relative ${className} group`}>
        <div className={`absolute inset-0 bg-blue-500/30 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
        <Scroll className={`relative z-10 ${color} drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]`} />
    </div>
);

export const WardIcon = ({ className = "w-6 h-6", color = "text-dota-radiant-DEFAULT" }) => (
    <div className={`relative ${className} group`}>
        <div className={`absolute inset-0 bg-dota-radiant-glow blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
        <Eye className={`relative z-10 ${color} drop-shadow-[0_0_5px_rgba(30,192,42,0.8)]`} />
    </div>
);
