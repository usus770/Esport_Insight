import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SwordIcon } from '../components/icons/DotaIcons';

const Home = () => {
    const [matchId, setMatchId] = useState('');
    const navigate = useNavigate();

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (matchId) {
            navigate(`/analysis/${matchId}`);
        }
    };

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Hero Effect */}
            <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-dota-black pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center space-y-8 w-full max-w-2xl px-4"
            >
                <div>
                    <h1 className="text-6xl font-radiance text-white tracking-widest glow-text mb-4">
                        Esport<span className="text-indigo-400">Insight</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-sans tracking-wide">
                        Advanced Esport Analytics & Coaching Intelligence
                    </p>
                </div>

                <div className="bg-[#151921]/80 border border-white/10 p-8 rounded shadow-panel backdrop-blur-sm relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4 text-amber-400 font-radiance border border-white/10 border-b-0 text-sm uppercase tracking-widest">
                        Match Analysis
                    </div>

                    <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter Match ID (e.g. 712345678)"
                            value={matchId}
                            onChange={(e) => setMatchId(e.target.value)}
                            className="flex-1 bg-black/50 border border-white/10 text-white px-6 py-4 rounded focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all font-mono text-lg"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(99,102,241,0.8)" }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-gradient-to-r from-indigo-900 to-indigo-600 text-white px-8 py-4 rounded font-bold uppercase tracking-wider shadow-lg border border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-2"
                        >
                            <SwordIcon className="w-5 h-5" />
                            Analyze
                        </motion.button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-[#151921]/40 p-4 border border-white/10 rounded hover:border-amber-400/50 transition-colors group cursor-pointer" onClick={() => navigate('/live')}>
                        <h3 className="text-amber-400 font-bold mb-2 group-hover:text-white transition-colors">Live Operations</h3>
                        <p className="text-sm text-gray-400">Monitor pro matches in real-time.</p>
                    </div>
                    <div className="bg-[#151921]/40 p-4 border border-white/10 rounded hover:border-amber-400/50 transition-colors group cursor-pointer" onClick={() => navigate('/hub')}>
                        <h3 className="text-amber-400 font-bold mb-2 group-hover:text-white transition-colors">Insight Hub</h3>
                        <p className="text-sm text-gray-400">Community coaching & pro guides.</p>
                    </div>
                    <div className="bg-[#151921]/40 p-4 border border-white/10 rounded hover:border-amber-400/50 transition-colors group cursor-pointer" onClick={() => navigate('/meta')}>
                        <h3 className="text-amber-400 font-bold mb-2 group-hover:text-white transition-colors">Meta Trends</h3>
                        <p className="text-sm text-gray-400">Tier lists & win rate statistics.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
