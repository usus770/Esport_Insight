import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MetaCenter = () => {
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/meta/heroes');
                const data = await response.json();
                setMeta(data);
            } catch (error) {
                console.error("Failed to fetch meta:", error);
            }
        };
        fetchMeta();
    }, []);

    if (!meta) return <div className="text-center text-dota-gold animate-pulse mt-20 font-radiance tracking-widest text-2xl">Analyzing Current Meta...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl text-center font-radiance tracking-widest text-white drop-shadow-lg mb-8"
            >
                Meta <span className="text-purple-400">Analysis</span> <span className="text-sm align-middle text-gray-400 font-sans tracking-normal ml-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full shadow-inner">Patch {meta.patch}</span>
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Trends Column (Left, 1 column) */}
                <div className="flex flex-col gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-dota-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                        <h2 className="text-xl font-bold font-radiance text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            Trending Shifts
                        </h2>
                        <div className="space-y-4 relative z-10">
                            {meta.trends.map((trend, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all hover:scale-[1.02] cursor-default shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full shadow-inner ${trend.direction === 'up' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                            {trend.direction === 'up' ? '▲' : '▼'}
                                        </div>
                                        <span className="font-semibold text-white/90 text-sm tracking-wide">{trend.name}</span>
                                    </div>
                                    <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${trend.direction === 'up' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{trend.stat}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Tier List Column (Right, 3 columns) */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-dota-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold font-radiance text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 bg-dota-gold rounded-full shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                            Tier List Matrix
                        </h2>
                        <div className="flex flex-col gap-3">
                            {meta.tier_list.map((tierData, idx) => (
                                <div key={idx} className="flex bg-black/40 rounded-xl overflow-visible border border-white/5 shadow-inner">
                                    <div className={`w-20 ${tierData.bg} p-2 flex flex-col items-center justify-center border-r border-white/10 rounded-l-xl`}>
                                        <span className={`text-4xl font-black font-radiance ${tierData.color.split(' ')[0]} drop-shadow-lg`}>{tierData.tier}</span>
                                    </div>
                                    <div className="flex-1 p-3 flex flex-wrap gap-3 items-center">
                                        {tierData.heroes.map((hero, hidx) => (
                                            <div key={hidx} className="relative group cursor-pointer hover:-translate-y-1 transition-transform">
                                                <img src={hero.image} alt={hero.name} className={`w-[72px] h-[40px] object-cover rounded shadow-lg border-2 ${tierData.color.split(' ')[1]} transition-all duration-300 group-hover:shadow-[0_0_15px_currentColor]`} />
                                                
                                                {/* Enhanced Hover Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 transform scale-95 group-hover:scale-100">
                                                    <div className="font-radiance font-bold text-sm text-white mb-2 pb-1 border-b border-white/10 text-center">{hero.name}</div>
                                                    <div className="flex flex-col gap-1.5 font-sans text-[10px]">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-400 uppercase tracking-wider">Win</span>
                                                            <span className={`font-bold font-mono ${parseFloat(hero.win_rate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>{hero.win_rate}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-400 uppercase tracking-wider">Pick</span>
                                                            <span className="font-mono text-gray-200">{hero.pick_rate}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-400 uppercase tracking-wider">Ban</span>
                                                            <span className="font-mono text-gray-200">{hero.ban_rate}</span>
                                                        </div>
                                                    </div>
                                                    {/* Triangle pointer */}
                                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/95 border-b border-r border-white/20 transform rotate-45" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Detailed Stats Panel */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-1 lg:col-span-4 bg-dota-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden mt-2"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />
                    <h2 className="text-2xl font-bold font-radiance text-white mb-6 flex items-center gap-3 relative z-10">
                        <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                        Detailed Hero Analytics
                    </h2>

                    <div className="overflow-x-auto relative z-10 rounded-xl border border-white/10 bg-black/40 shadow-inner">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="text-gray-400 font-sans uppercase tracking-widest text-[10px] border-b border-white/10 bg-white/5">
                                    <th className="p-4 font-semibold rounded-tl-lg">Hero</th>
                                    <th className="p-4 font-semibold text-center">Tier</th>
                                    <th className="p-4 font-semibold text-right">Win Rate</th>
                                    <th className="p-4 font-semibold text-right">Pick Rate</th>
                                    <th className="p-4 font-semibold text-right rounded-tr-lg">Ban Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meta.hero_stats && meta.hero_stats.map((hero, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group/row">
                                        <td className="p-4 flex items-center gap-4">
                                            <img src={hero.image} alt={hero.name} className="w-[54px] h-[30px] object-cover rounded border border-white/20 shadow-md group-hover/row:border-dota-gold transition-colors" />
                                            <span className="font-bold text-white font-radiance text-lg tracking-wide group-hover/row:text-dota-gold transition-colors">{hero.name}</span>
                                        </td>
                                        <td className="p-4 text-center align-middle">
                                            <span className="px-3 py-1 bg-black/60 border border-white/10 rounded font-black font-radiance text-dota-gold shadow-inner text-sm inline-block">
                                                {hero.tier}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end justify-center h-full">
                                                <span className={`font-mono text-base font-bold drop-shadow-md ${parseFloat(hero.win_rate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>{hero.win_rate}</span>
                                                <div className="w-16 h-1 mt-1 bg-black/60 rounded-full overflow-hidden shadow-inner border border-white/5">
                                                    <div className={`h-full ${parseFloat(hero.win_rate) >= 50 ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`} style={{ width: hero.win_rate }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right text-gray-300 font-mono align-middle">{hero.pick_rate}</td>
                                        <td className="p-4 text-right text-gray-300 font-mono align-middle">{hero.ban_rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MetaCenter;
