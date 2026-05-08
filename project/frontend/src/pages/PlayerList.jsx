import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/players/');
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error("Failed to fetch players:", error);
            }
        };
        fetchPlayers();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <h2 className="text-4xl text-center font-radiance tracking-widest text-dota-gold drop-shadow-md">
                Pro <span className="text-white">Directory</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {players.length === 0 ? (
                    <div className="text-dota-silver text-center col-span-4 animate-pulse">Scanning Global Leaderboards...</div>
                ) : (
                    players.map((player, i) => (
                        <motion.div
                            key={player.account_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02, y: -8 }}
                            onClick={() => navigate(`/player/${player.account_id}`)}
                            className="relative bg-dota-card border border-white/10 p-6 rounded-xl cursor-pointer overflow-hidden group hover:border-dota-gold/50 transition-all duration-500 shadow-2xl backdrop-blur-md"
                        >
                            {/* Glow effect back layer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-dota-gold/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-dota-gold/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Header: Rank & Role */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/20 text-dota-gold font-bold font-radiance shadow-inner group-hover:border-dota-gold/50 transition-colors">
                                        #{player.rank}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-dota-silver font-sans tracking-widest uppercase shadow-sm">
                                        {player.role || 'Flex'}
                                    </div>
                                </div>

                                {/* Main Info */}
                                <div className="pt-2 pb-6">
                                    <h3 className="text-2xl font-bold text-white font-radiance tracking-wide group-hover:text-dota-gold transition-colors drop-shadow-sm">{player.name}</h3>
                                    <p className="text-xs text-dota-silver/60 font-sans tracking-widest uppercase mt-1">{player.team}</p>
                                </div>

                                {/* Stats Separator */}
                                <div className="mt-auto">
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        {/* Win Rate */}
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold drop-shadow-sm">Win Rate</span>
                                            <span className="text-lg font-bold text-white font-sans">{player.win_rate ? player.win_rate.toFixed(1) : '--'}%</span>
                                            <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden mt-1 drop-shadow-inner border border-white/5">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                                                    style={{ width: `${player.win_rate || 50}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Top Hero */}
                                        <div className="flex flex-col space-y-1 items-end text-right">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold drop-shadow-sm">Signature</span>
                                            <span className="text-sm font-semibold text-white/90 truncate w-full group-hover:text-white transition-colors">{player.top_hero || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PlayerList;
