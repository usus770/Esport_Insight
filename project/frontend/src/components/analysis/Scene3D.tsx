import React, { useState, useEffect } from 'react';
import { MapPin, Target, AlertTriangle, ShieldAlert, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MatchEvent = {
    id: number;
    x: number;
    y: number;
    type: 'hero' | 'combat' | 'objective' | 'ping';
    title: string;
    subtitle?: string;
    team: 'alpha' | 'omega';
    timestamp: number;
};

export default function Scene3D() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [events, setEvents] = useState<MatchEvent[]>([
        // Initial static events to match the "populated" look of the screenshot
        { id: 1, x: 75, y: 75, type: 'hero', title: 'Yatoro (Asset)', subtitle: 'BB', team: 'omega', timestamp: Date.now() },
        { id: 2, x: 45, y: 35, type: 'objective', title: 'CONTESTING', team: 'alpha', timestamp: Date.now() }
    ]);

    // Simulated Event Engine Additions
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.5 && events.length < 5) {
                const teams: ('alpha'|'omega')[] = ['alpha', 'omega'];
                const team = teams[Math.floor(Math.random() * teams.length)];
                
                const newEvent: MatchEvent = {
                    id: Date.now(),
                    x: Math.random() * 60 + 20, // 20% to 80% to keep on map
                    y: Math.random() * 60 + 20,
                    type: Math.random() > 0.6 ? 'combat' : 'ping',
                    title: 'Alert',
                    team: team,
                    timestamp: Date.now()
                };
                
                setEvents(prev => [...prev, newEvent]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [events.length]);

    // Cleanup old events (keep the static ones alive longer for demo, clean up dynamic ones)
    useEffect(() => {
        const cleanup = setInterval(() => {
            const now = Date.now();
            setEvents(prev => prev.filter(e => e.id === 1 || e.id === 2 || now - e.timestamp < 6000));
        }, 1000);
        return () => clearInterval(cleanup);
    }, []);

    // The counter-rotation to make 2D UI elements "stand up" facing the camera (countering the map's rotation)
    const standingTransform = "rotateZ(0deg) rotateX(-45deg)";

    return (
        <>
            {/* Backdrop for expanded view */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-[#050510]/80 backdrop-blur-sm"
                        onClick={() => setIsExpanded(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div 
                layout
                className={`bg-[#0B0E13] overflow-hidden flex flex-col items-center justify-center perspective-[1400px] transition-all duration-500 ease-in-out ${
                    isExpanded 
                        ? 'fixed top-[5%] left-[5%] w-[90%] h-[90%] z-[70] rounded-2xl shadow-[inset_0_0_100px_rgba(79,70,229,0.2),0_40px_100px_rgba(0,0,0,0.8)] border border-indigo-500/30' 
                        : 'relative w-full h-full rounded-lg shadow-[inset_0_0_50px_rgba(79,70,229,0.15)] cursor-pointer group hover:border-indigo-500/50 border border-transparent'
                }`}
                onClick={() => !isExpanded && setIsExpanded(true)}
            >
                {/* Controls */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className="absolute top-4 right-4 z-[80] p-2 bg-black/50 hover:bg-white/10 border border-white/5 rounded-full text-indigo-400 hover:text-white transition-all shadow-lg"
                >
                    {isExpanded ? <X size={20} /> : <Maximize2 size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>

            {/* The 3D CSS Map Container */}
            <div 
                className="w-[95%] h-[95%] md:w-[85%] md:h-[85%] relative transition-transform duration-1000 ease-in-out"
                style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: 'translateY(5%) rotateX(45deg) rotateZ(0deg)' 
                }}
            >
                {/* 3D Map Base Image */}
                <div className="absolute inset-0 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden bg-[#18211E]">
                    <img 
                        src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/map/dota_map_733.png" 
                        alt="Tactical Map" 
                        className="w-full h-full object-cover shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/dota_map.png'; // Fallback to local
                        }}
                    />
                    {/* Light gradient vignette to frame it without obscuring */}
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />
                </div>

                {/* Simulated Path Lines (glowing trails over the map) */}
                <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] border-t-2 border-l-2 border-indigo-400/50 rounded-tl-full blur-[1px] shadow-[0_0_15px_#6366f1]" />
                <div className="absolute bottom-[20%] right-[20%] w-[60%] h-[60%] border-b-2 border-r-2 border-amber-400/50 rounded-br-full blur-[1px] shadow-[0_0_15px_#f59e0b]" />

                {/* Active Match Events / Pins */}
                <AnimatePresence>
                    {events.map(event => (
                        <motion.div 
                            key={event.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                left: `${event.x}%`,
                                top: `${event.y}%`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Standing UI Element */}
                            <div 
                                className="relative flex flex-col items-center drop-shadow-2xl"
                                style={{ transform: standingTransform, transformOrigin: 'bottom center' }}
                            >
                                {/* Tooltip label */}
                                <div className={`mb-1 px-3 py-1 rounded-full border shadow-lg backdrop-blur text-xs font-bold whitespace-nowrap flex items-center gap-2
                                    ${event.team === 'alpha' ? 'bg-indigo-900/80 border-indigo-400 text-indigo-100' : 'bg-amber-900/80 border-amber-400 text-amber-100'}
                                `}>
                                    {event.title}
                                    {event.subtitle && (
                                        <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] ml-1">{event.subtitle}</span>
                                    )}
                                </div>

                                {/* Pin Ground Connection */}
                                <div className="relative">
                                    {event.type === 'objective' && <MapPin className={`w-8 h-8 ${event.team === 'alpha' ? 'text-indigo-400' : 'text-amber-400'} drop-shadow-[0_0_8px_currentColor]`} />}
                                    {event.type === 'hero' && <Target className={`w-8 h-8 ${event.team === 'alpha' ? 'text-indigo-400' : 'text-amber-400'} drop-shadow-[0_0_8px_currentColor]`} />}
                                    {event.type === 'combat' && <ShieldAlert className="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_#ef4444]" />}
                                    {event.type === 'ping' && <div className={`w-3 h-3 rounded-full mt-4 ${event.team === 'alpha' ? 'bg-indigo-400 shadow-[0_0_10px_#6366f1]' : 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'}`} />}
                                </div>

                                {/* Ground pulse effect projected flat on the floor */}
                                <div 
                                    className="absolute bottom-0 translate-y-2/3 pointer-events-none"
                                    style={{ transform: 'rotateX(45deg)' /* flatten onto the isometric plane */ }}
                                >
                                    <div className={`w-16 h-16 rounded-full border-2 animate-ping opacity-50
                                        ${event.type === 'combat' ? 'border-red-500' : (event.team === 'alpha' ? 'border-indigo-400' : 'border-amber-400')}
                                    `} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>

            {/* Ambient Atmosphere (Vignette) overlay independent of rotation */}
            <div className={`absolute inset-0 pointer-events-none border border-indigo-500/20 ${isExpanded ? 'rounded-2xl shadow-[inset_0_0_250px_rgba(11,14,19,1)]' : 'rounded-lg shadow-[inset_0_0_150px_rgba(11,14,19,1)]'}`} />
            </motion.div>
        </>
    );
}
