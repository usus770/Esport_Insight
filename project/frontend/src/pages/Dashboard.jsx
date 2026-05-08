import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Eye, DollarSign } from 'lucide-react';

const SimplifiedDashboard = () => {
    const { id } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                // Fetch mock match details from backend
                const response = await fetch(`http://localhost:8000/api/v1/matches/${id}`);
                const data = await response.json();
                setMatchData(data);
            } catch (error) {
                console.error("Failed to fetch match:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-dota-charcoal border-t-dota-gold rounded-full animate-spin" />
                <p className="text-dota-gold font-radiance animate-pulse tracking-widest">ANALYZING MATCH DATA...</p>
                <p className="text-gray-500 font-mono text-sm">Processing Replay ID: {id}</p>
            </div>
        );
    }

    if (!matchData) return <div className="text-white text-center mt-20">Match not found.</div>;

    // Derived Metrics for Meta Section
    const mvp = matchData.players.reduce((prev, current) => (prev.kills + prev.assists) > (current.kills + current.assists) ? prev : current);
    const highestGPM = matchData.players.reduce((prev, current) => prev.gpm > current.gpm ? prev : current);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-3xl font-radiance text-white tracking-widest glow-text">Match Analysis</h1>
                <p className="text-gray-400">Simplified Insights for Match #{matchData.match_id}</p>
                <div className="flex justify-center gap-8 mt-4 font-radiance text-2xl">
                    <span className="text-dota-radiant-DEFAULT">{matchData.radiant_team}: {matchData.radiant_score}</span>
                    <span className="text-gray-600">VS</span>
                    <span className="text-dota-dire-DEFAULT">{matchData.dire_team}: {matchData.dire_score}</span>
                </div>
            </header>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-dota-card p-6 border-t-4 border-t-green-500 rounded shadow-panel text-center"
                >
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Win Probability</div>
                    <div className="text-4xl font-bold text-green-400">{(matchData.prediction.win_probability * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-500 mt-1">Radiant Victory</div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dota-card p-6 border-t-4 border-t-dota-gold rounded shadow-panel text-center"
                >
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Meta MVP</div>
                    <div className="text-lg font-bold text-dota-gold flex flex-col items-center">
                        <span>{mvp.name}</span>
                        <span className="text-xs text-white/50">{mvp.hero}</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-dota-card p-6 border-t-4 border-t-red-500 rounded shadow-panel text-center"
                >
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Highest Impact</div>
                    <div className="text-lg font-bold text-red-500 flex flex-col items-center">
                        <span>{highestGPM.name}</span>
                        <span className="text-xs text-white/50">{highestGPM.gpm} GPM</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-dota-card p-6 border-t-4 border-t-blue-500 rounded shadow-panel text-center"
                >
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Match Duration</div>
                    <div className="text-2xl font-bold text-blue-400 flex justify-center items-center gap-2">
                        {matchData.prediction.timeline.length}:00
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Player Performance Table */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-radiance text-white mb-6 border-b border-dota-border pb-2 flex items-center gap-2">
                        <Activity className="text-dota-gold" /> Player Performance
                    </h2>
                    <div className="bg-dota-charcoal/30 rounded border border-dota-border overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-dota-black/50 text-dota-silver uppercase text-xs">
                                <tr>
                                    <th className="p-3">Player</th>
                                    <th className="p-3">Hero</th>
                                    <th className="p-3">K/D/A</th>
                                    <th className="p-3 text-right">Net Worth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchData.players.map((player, idx) => (
                                    <tr key={idx} className="border-b border-dota-border/50 hover:bg-white/5 transition-colors group">
                                        <td
                                            className="p-3 text-white font-bold cursor-pointer group-hover:text-dota-gold transition-colors"
                                            onClick={() => navigate(`/player/${player.account_id}`)}
                                        >
                                            {player.name}
                                        </td>
                                        <td className="p-3 text-gray-300">{player.hero}</td>
                                        <td className="p-3 font-mono text-gray-400">{player.kills}/{player.deaths}/{player.assists}</td>
                                        <td className="p-3 text-right font-mono text-dota-gold">{player.net_worth.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Coach's Notes / Meta Insights */}
                <div>
                    <h2 className="text-2xl font-radiance text-white mb-6 border-b border-dota-border pb-2">Meta Insights</h2>
                    <div className="bg-gradient-to-br from-dota-card to-black p-6 rounded border border-dota-border shadow-inner space-y-6">
                        <div>
                            <h4 className="text-dota-gold font-bold text-sm uppercase mb-2">Key Variable</h4>
                            <p className="text-gray-300 text-sm">
                                "The Radiant safe lane secured <span className="text-white font-bold">15% more farm</span> than average, leading to a significant mid-game power spike."
                            </p>
                        </div>

                        <div>
                            <h4 className="text-red-400 font-bold text-sm uppercase mb-2">Critical Error</h4>
                            <p className="text-gray-300 text-sm">
                                "Dire support rotation at 12:00 was detected by vision, resulting in a wasted smoke gank."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-dota-radiant-DEFAULT font-bold text-sm uppercase mb-2">Coach's Verdict</h4>
                            <p className="text-gray-300 italic text-sm">
                                "A classic example of farm efficiency beating early aggression. Focus on split-pushing when behind."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimplifiedDashboard;
