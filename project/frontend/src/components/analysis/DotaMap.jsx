import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Skull, Shield, Sword, Gem } from 'lucide-react';
import { dotaTheme } from '../../theme/dotaTheme';

const DotaMap = ({ matchId }) => {
    const [events, setEvents] = useState([]);
    const [hoveredEvent, setHoveredEvent] = useState(null);

    // Simulate live map events since we don't have XY coordinates in CSV
    useEffect(() => {
        // Generate some random events for demo
        const mockEvents = [
            { id: 1, type: 'kill', x: 20, y: 80, time: '12:30', details: 'Radiant Kill', description: 'Anti-Mage claimed a bounty in the Safelane.' },
            { id: 2, type: 'tower', x: 50, y: 50, time: '15:45', details: 'Mid Tower', description: 'Radiant Tier 1 Tower has fallen.' },
            { id: 3, type: 'roshan', x: 85, y: 45, time: '22:10', details: 'Roshan Taken', description: 'Aegis of the Immortal claimed by Dire.' },
        ];
        setEvents(mockEvents);

        // Simulate live new events appearing randomly
        const timer = setInterval(() => {
            const types = ['kill', 'tower', 'roshan', 'rune'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomX = Math.floor(Math.random() * 80) + 10; // Keep away from edges
            const randomY = Math.floor(Math.random() * 80) + 10;

            setEvents(prev => {
                const newEvent = {
                    id: Date.now(),
                    type: randomType,
                    x: randomX,
                    y: randomY,
                    time: 'Live',
                    details: randomType === 'kill' ? 'Hero Slain' :
                        randomType === 'tower' ? 'Tower Destroyed' :
                            randomType === 'rune' ? 'Rune Spawn' : 'Roshan Attempt',
                    description: randomType === 'kill' ? 'A fierce battle has erupted!' :
                        randomType === 'tower' ? 'Defenses are crumbling.' :
                            randomType === 'rune' ? 'Double Damage Rune spawned.' : 'Roshan is under attack!'
                };
                return [...prev.slice(-4), newEvent]; // Keep last 5 events to prevent clutter
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, [matchId]);

    const handleMouseEnter = (event, e) => {
        const rect = e.target.getBoundingClientRect();
        setHoveredEvent({
            ...event,
            x: rect.left + rect.width / 2,
            y: rect.top
        });
    };

    return (
        <div className="relative w-full h-full bg-[#1a202c] rounded-lg overflow-hidden border border-white/10 shadow-lg group">
            {/* Map Background with Official Image */}
            <div className="absolute inset-0">
                <img
                    src="/dota_map.png"
                    alt="Dota 2 Map"
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                        console.error("Map image failed to load:", e.target.src);
                        e.target.style.display = 'none'; // Optional: hide if broken to show bg color
                    }}
                />
            </div>

            {/* Grid Overlay for tech feel */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="absolute top-2 left-2 flex items-center gap-2 text-xs font-mono text-gray-400">
                <Map className="w-3 h-3" />
                <span>LIVE TACTICAL VIEW</span>
                <span className="animate-pulse w-2 h-2 rounded-full bg-red-500 ml-2"></span>
            </div>

            {/* Tooltip Overlay */}
            <AnimatePresence>
                {hoveredEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 pointer-events-none w-48 bg-[#1a1f26]/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-lg overflow-hidden"
                        style={{
                            left: hoveredEvent.x,
                            top: hoveredEvent.y,
                            transform: 'translate(-50%, -100%) translateY(-10px)'
                        }}
                    >
                        <div className={`p-2 border-b border-white/5 flex items-center gap-2 
                            ${hoveredEvent.type === 'kill' ? 'bg-red-900/30' :
                                hoveredEvent.type === 'roshan' ? 'bg-orange-900/30' :
                                    hoveredEvent.type === 'rune' ? 'bg-purple-900/30' : 'bg-blue-900/30'}`}>

                            {hoveredEvent.type === 'kill' && <Skull className="w-3 h-3 text-red-400" />}
                            {hoveredEvent.type === 'roshan' && <Shield className="w-3 h-3 text-orange-400" />}
                            {hoveredEvent.type === 'tower' && <Sword className="w-3 h-3 text-blue-400" />}
                            {hoveredEvent.type === 'rune' && <Gem className="w-3 h-3 text-purple-400" />}

                            <span className="font-bold text-white text-xs uppercase tracking-wider">{hoveredEvent.details}</span>
                        </div>

                        <div className="p-2">
                            <p className="text-[10px] text-gray-300 leading-snug mb-1">{hoveredEvent.description}</p>
                            <div className="text-[10px] text-gray-500 font-mono text-right">{hoveredEvent.time}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Events */}
            <AnimatePresence>
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute cursor-pointer"
                        style={{ left: `${event.x}%`, top: `${event.y}%` }}
                        whileHover={{ scale: 1.2 }}
                        onMouseEnter={(e) => handleMouseEnter(event, e)}
                        onMouseLeave={() => setHoveredEvent(null)}
                    >
                        <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] 
              ${event.type === 'kill' ? 'bg-red-500/80 text-white' :
                                event.type === 'roshan' ? 'bg-orange-500/80 text-white' :
                                    event.type === 'rune' ? 'bg-purple-500/80 text-white' : 'bg-blue-500/80 text-white'}`}
                        >
                            {event.type === 'kill' && <Skull className="w-3 h-3" />}
                            {event.type === 'roshan' && <Shield className="w-3 h-3" />}
                            {event.type === 'tower' && <Sword className="w-3 h-3" />}
                            {event.type === 'rune' && <Gem className="w-3 h-3" />}
                        </div>
                        {/* Ping Wave Effect */}
                        <motion.div
                            className={`absolute inset-0 rounded-full ${event.type === 'kill' ? 'bg-red-500' :
                                event.type === 'roshan' ? 'bg-orange-500' :
                                    event.type === 'rune' ? 'bg-purple-500' : 'bg-blue-500'
                                }`}
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default DotaMap;
