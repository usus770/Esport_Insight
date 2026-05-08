import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PlayerView = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                // Default to ID 1 if not present for demo
                const response = await fetch(`http://localhost:8000/api/v1/players/${id || 1}`);
                const data = await response.json();
                setPlayer(data);
            } catch (error) {
                console.error("Failed to fetch player:", error);
            }
        };
        fetchPlayer();
    }, [id]);

    if (!player) return <div className="text-center text-dota-gold animate-pulse mt-20 font-radiance tracking-widest text-2xl">Summoning Hero...</div>;

    return (
        <div className="flex flex-col items-center p-8 max-w-7xl mx-auto">
            <div className="w-full bg-dota-card/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 md:p-12 relative overflow-hidden group">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-dota-gold/5 via-transparent to-purple-500/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-dota-gold/10 rounded-full blur-[100px] pointer-events-none" />
                
                {/* Header Profile Section */}
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 pb-8 border-b border-white/10">
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 bg-gradient-to-tr from-dota-gold to-purple-500 rounded-full animate-spin-slow opacity-50 blur-md" />
                        <div className="relative w-full h-full bg-black/80 rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,215,0,0.15)] flex items-center justify-center text-7xl font-radiance font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                            {player.name ? player.name[0] : "?"}
                        </div>
                        {/* Win Rate Ring Overlay - Mock pure CSS circular progress */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                            <circle cx="80" cy="80" r="76" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                            <circle cx="80" cy="80" r="76" stroke="url(#goldGradient)" strokeWidth="8" fill="none" strokeDasharray={477} strokeDashoffset={477 - (477 * (player.win_rate || 0)) / 100} className="transition-all duration-1000 ease-out" />
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#C0A050" />
                                    <stop offset="100%" stopColor="#FFD700" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left pt-4">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-dota-gold font-bold tracking-widest uppercase shadow-sm">#{player.rank} GLOBAL</span>
                            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-dota-silver font-sans tracking-widest uppercase shadow-sm">{player.role}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-radiance font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 tracking-wider drop-shadow-lg mb-2">{player.name}</h1>
                        <p className="text-lg text-dota-silver/80 font-sans tracking-widest uppercase">{player.team}</p>
                    </div>
                    
                    {/* Overall Win Rate Stat Box */}
                    <div className="hidden lg:flex flex-col items-end pt-4 pl-8 border-l border-white/10">
                        <span className="text-xs text-dota-silver uppercase tracking-widest font-semibold mb-1">Overall Win Rate</span>
                        <span className="text-5xl font-bold text-white font-radiance">
                            {player.win_rate ? player.win_rate.toFixed(1) : '--'}%
                        </span>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Signatures */}
                    <div>
                        <h3 className="text-lg font-sans font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-dota-gold shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                            Signatures
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {player.signature_heroes && player.signature_heroes.map((hero, idx) => (
                                <div key={idx} className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 flex justify-between items-center hover:bg-white/10 transition-all hover:border-dota-gold/50 group/sig hover:-translate-y-1 shadow-lg">
                                    <div>
                                        <div className="font-bold text-white font-radiance text-xl tracking-wide group-hover/sig:text-dota-gold transition-colors">{hero.name}</div>
                                        <div className="text-xs text-dota-silver uppercase tracking-wider mt-1">{hero.matches} matches played</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl text-green-400 font-bold font-sans">{(hero.win_rate * 100).toFixed(0)}%</div>
                                        <div className="text-[10px] text-dota-silver/70 uppercase tracking-widest">Win Rate</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Matches */}
                    <div>
                        <h3 className="text-lg font-sans font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            Recent Activity
                        </h3>
                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden shadow-inner">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr className="text-dota-silver/70 font-sans uppercase tracking-widest text-[10px]">
                                        <th className="p-4 font-semibold">Hero</th>
                                        <th className="p-4 font-semibold">Result</th>
                                        <th className="p-4 font-semibold">K / D / A</th>
                                        <th className="p-4 text-right font-semibold">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {player.recent_matches && player.recent_matches.map((match, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group/row">
                                            <td className="p-4 text-white font-medium group-hover/row:text-purple-300 transition-colors">{match.hero}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${match.result === 'Won' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                    {match.result}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-300 font-mono text-xs">{match.kda}</td>
                                            <td className="p-4 text-right text-gray-500 font-mono text-xs">{match.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance Trend Graph */}
                <div className="mt-12 relative z-10 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-sans font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        7-Match Trend
                    </h3>
                    <div className="h-56 bg-black/40 rounded-xl border border-white/10 p-6 flex items-end justify-between space-x-4 relative overflow-hidden group/graph">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
                        
                        {/* Connecting Line Mockup SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                            <path d="M 50 150 Q 150 100 250 120 T 450 80 T 650 130 T 850 60 T 1050 90" stroke="rgba(59,130,246,0.2)" strokeWidth="2" fill="none" className="group-hover/graph:stroke-[rgba(59,130,246,0.5)] transition-colors duration-700"/>
                        </svg>

                        {player.trend && player.trend.map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center group/bar h-full justify-end relative z-10">
                                <span className="absolute -top-6 text-white text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity bg-blue-600 px-2 py-1 rounded shadow-lg transform -translate-y-2 group-hover/bar:translate-y-0 duration-300">
                                    {(val * 100).toFixed(0)}%
                                </span>
                                <div
                                    style={{ height: `${val * 100}%` }}
                                    className="w-full max-w-[40px] bg-gradient-to-t from-blue-600/20 to-blue-400/80 rounded-t-sm border-t border-blue-300/50 hover:to-blue-300 hover:from-blue-500/50 transition-all duration-300 relative"
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[10px] text-gray-500 mt-2 font-mono uppercase">M{idx + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerView;
