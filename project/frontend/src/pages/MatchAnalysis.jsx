import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMatchDetails, getPlayerProfile } from '../services/api';
import DotaNavbar from '../components/DotaNavbar';
import Scene3D from '../components/analysis/Scene3D';
import HeroGrid from '../components/analysis/HeroGrid';
import HeroDeepDive from '../components/analysis/HeroDeepDive';
import HeroStats from '../components/analysis/HeroStats';
import InsightFeed from '../components/analysis/InsightFeed';
import CoachingAnalysis from '../components/CoachingAnalysis';
import { Clock, Trophy, BarChart2, Brain } from 'lucide-react';

const MatchAnalysis = () => {
    const { matchId } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('coach'); // 'overview' | 'coach'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch match data (which includes player summaries)
                const data = await getMatchDetails(matchId);
                setMatchData(data);

                // Select MVP or first player by default
                if (data.players && data.players.length > 0) {
                    setSelectedPlayer(data.players[0]);
                }
            } catch (err) {
                console.error("Failed to load match", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [matchId]);

    // ... (Live Simulation Logic omitted for brevity, keeping existing implementation if possible, 
    // but for replacement I need to include it or keep it. 
    // The previous tool usage showed the full file, so I will assume I need to replace the component body logic 
    // or just the relevant parts. To be safe and clean, I will replace the main render logic primarily).

    // --- LIVE SIMULATION LOGIC START ---
    useEffect(() => {
        if (!matchData) return;
        const interval = setInterval(() => {
            setMatchData(prev => {
                if (!prev) return prev;
                const newDuration = prev.duration + 1;
                let newRadiantScore = prev.radiant_score || 0;
                let newDireScore = prev.dire_score || 0;
                if (Math.random() > 0.9) {
                    if (Math.random() > 0.5) newRadiantScore += 1;
                    else newDireScore += 1;
                }
                let newWinProb = (prev.win_probability || 0.5) + (Math.random() - 0.5) * 0.05;
                newWinProb = Math.max(0.1, Math.min(0.9, newWinProb));

                // Simplified event log for brevity in this updated component
                let newEvents = [...(prev.timeline_events || [])];
                if (Math.random() > 0.95) {
                    const eventTypes = ['kill', 'tower', 'roshan', 'rune'];
                    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                    const newEvent = {
                        id: Date.now(),
                        time: `${Math.floor(newDuration / 60)}:${(newDuration % 60).toString().padStart(2, '0')}`,
                        type: type === 'kill' ? 'combat' : type === 'tower' ? 'objective' : 'info',
                        message: type === 'kill' ? 'Hero Slain' : type === 'tower' ? 'Tower Destroyed' : 'Roshan contesting...',
                        icon: null
                    };
                    newEvents.unshift(newEvent);
                }

                return {
                    ...prev,
                    duration: newDuration,
                    radiant_score: newRadiantScore,
                    dire_score: newDireScore,
                    win_probability: newWinProb,
                    timeline_events: newEvents,
                    players: prev.players // Keep players static for now to avoid jitter in coaching
                };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [matchData?.match_id]);
    // --- LIVE SIMULATION LOGIC END ---

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0E13] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-indigo-400 font-mono uppercase tracking-widest animate-pulse">Initializing Analysis Engine...</p>
                </div>
            </div>
        );
    }

    if (!matchData) return <div className="text-white text-center p-20">Match Not Found</div>;

    const {
        radiant_score = 0,
        dire_score = 0,
        duration = 0,
        win_probability = 0.5,
        match_id = matchId
    } = matchData || {};

    // Helper to construct metrics for Coaching
    const getPlayerMetrics = (p) => {
        if (!p) return null;
        const role = (p.gold_per_min || 0) > 550 ? "Core" : "Support";
        const isRadiant = p.player_slot < 128;
        const radiantNw = (matchData.players || []).filter(x => x.player_slot < 128).reduce((a, b) => a + (b.net_worth || 0), 0);
        const direNw = (matchData.players || []).filter(x => x.player_slot >= 128).reduce((a, b) => a + (b.net_worth || 0), 0);
        const goldDiff = isRadiant ? (radiantNw - direNw) : (direNw - radiantNw);

        return {
            // New enriched fields for the coaching dashboard
            hero: p.hero_name || p.hero || "Unit",
            role: role,
            gpm: p.gold_per_min || 0,
            gpmBenchmark: role === "Core" ? 600 : 350,
            xpm: p.xp_per_min || 0,
            xpmBenchmark: role === "Core" ? 580 : 400,
            kills: p.kills || 0,
            deaths: p.deaths || 0,
            assists: p.assists || 0,
            killParticipation: 50.0,
            netWorth: p.net_worth || 0,
            lastHits: p.last_hits || 0,
            winProbability: win_probability * 100,
            matchMinute: Math.floor(duration / 60),
            heroDamage: p.hero_damage || 0,
            towerDamage: p.tower_damage || 0,
            // Legacy fields for backend compat
            win_prob_20min: win_probability * 100,
            gold_diff: goldDiff,
            benchmark_gpm: role === "Core" ? 600 : 350,
            hero_winrate: 51.5,
            top_important_features: ["gold_per_min", "deaths", "tower_damage"],
            performance_drop_detected: (p.deaths || 0) > 8,
            momentum_shift_detected: false,
        };
    };

    return (
        <div className="min-h-screen bg-[#0B0E13] text-white font-sans overflow-hidden flex flex-col">

            {/* HEADER */}
            <header className="bg-[#151921] border-b border-white/5 p-4 flex justify-between items-center shadow-lg relative z-10">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Match ID</span>
                        <span className="font-mono text-xl font-bold text-gray-200">{match_id}</span>
                    </div>

                    {/* TABS */}
                    <div className="flex bg-black/40 rounded p-1 border border-white/10">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1 rounded text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('coach')}
                            className={`px-4 py-1 rounded text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'coach' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Brain size={14} /> Recommend
                        </button>
                    </div>

                    <div className="h-8 w-px bg-white/10"></div>

                    <div className="flex items-center gap-4">
                        <div className={`text-2xl font-black uppercase ${win_probability > 0.5 ? 'text-indigo-400' : 'text-gray-600'}`}>Team Alpha</div>
                        <div className="px-3 py-1 bg-black/40 rounded border border-white/10 font-mono text-xl">
                            <span className="text-indigo-400">{radiant_score}</span>
                            <span className="mx-2 text-gray-600">:</span>
                            <span className="text-rose-400">{dire_score}</span>
                        </div>
                        <div className={`text-2xl font-black uppercase ${win_probability <= 0.5 ? 'text-rose-400' : 'text-gray-600'}`}>Team Omega</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-indigo-300 bg-indigo-900/20 px-3 py-1 rounded border border-indigo-500/20">
                        <Trophy className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wide text-sm">
                            {win_probability > 0.5 ? 'Alpha Leading' : 'Omega Leading'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-lg text-white">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden h-full">

                {/* Left Col: Hero Lists (Always visible) */}
                <div className="col-span-2 bg-[#151921]/50 rounded-xl p-2 overflow-y-auto custom-scrollbar border border-white/5">
                    <HeroGrid
                        players={matchData.players || []}
                        onSelectHero={(p) => setSelectedPlayer(p)}
                        selectedHeroId={selectedPlayer?.account_id}
                    />
                </div>

                {/* DYNAMIC CONTENT AREA */}
                {activeTab === 'overview' ? (
                    <>
                        {/* Center: Map + Deep Dive */}
                        <div className="col-span-7 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                            <div className="grid grid-cols-2 gap-4 h-64">
                                <div className="w-full h-full relative shadow-lg rounded-lg overflow-hidden border border-white/10">
                                    <Scene3D />
                                </div>
                                <div className="w-full h-full shadow-lg rounded-xl overflow-hidden border border-white/10 relative">
                                    <HeroDeepDive hero={selectedPlayer} isRadiant={selectedPlayer?.player_slot < 128} />
                                </div>
                            </div>
                            <HeroStats hero={selectedPlayer} />

                            {/* AI Verdict */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="h-32 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-4 rounded-xl shadow-lg flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-2 mb-2 text-indigo-300">
                                    <BarChart2 className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">AI Match Verdict</span>
                                </div>
                                <p className="text-lg text-gray-200 font-medium leading-relaxed tracking-wide">
                                    "Team Alpha is securing a victory through superior <span className="text-indigo-400 font-bold">Resource efficiency</span>. The turning point was the recent objective control."
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Col: Feed */}
                        <div className="col-span-3 h-full flex flex-col gap-4">
                            <div className="h-40 bg-[#151921] rounded-xl border border-white/5 p-4 flex flex-col justify-center relative overflow-hidden group shadow-lg">
                                <span className="absolute top-3 left-3 text-[10px] text-gray-500 uppercase tracking-widest z-10">Win Probability</span>
                                <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-green-900 via-gray-900 to-red-900"></div>
                                <div className="relative z-10 text-center mt-4">
                                    <span className="text-4xl font-black text-white drop-shadow-lg">{Math.round(win_probability * 100)}%</span>
                                    <p className={`text-xs uppercase tracking-widest font-bold ${win_probability > 0.5 ? 'text-indigo-400' : 'text-rose-400'}`}>
                                        {win_probability > 0.5 ? 'Team Alpha' : 'Team Omega'} Favored
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0">
                                <InsightFeed events={matchData.timeline_events} />
                            </div>
                        </div>
                    </>
                ) : (
                    // COACHING VIEW
                    <div className="col-span-10 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-4 bg-[#151921]/30 rounded-xl border border-white/5">
                        {selectedPlayer ? (
                            <CoachingAnalysis playerMetrics={getPlayerMetrics(selectedPlayer)} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Select a player from the left list to start coaching analysis.</div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
};

export default MatchAnalysis;
