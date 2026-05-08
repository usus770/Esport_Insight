import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import MatchTimeline from '../components/MatchTimeline';
import PlayerCard from '../components/PlayerCard';

const MatchView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState(null);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/matches/${id}`);
                const data = await response.json();
                setMatchData(data);
            } catch (error) {
                console.error("Failed to fetch match details", error);
            }
        };
        fetchMatchDetails();
    }, [id]);

    if (!matchData) return (
        <div className="flex h-screen items-center justify-center text-dota-gold animate-pulse text-2xl font-radiance tracking-widest">
            Summoning Match Data...
        </div>
    );

    const radiantPlayers = matchData.players ? matchData.players.filter(p => p.team === 'radiant') : [];
    const direPlayers = matchData.players ? matchData.players.filter(p => p.team === 'dire') : [];
    const allPlayers = [...radiantPlayers, ...direPlayers];

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            {/* Header / Scoreboard */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-24 bg-dota-black/80 border-b border-dota-border backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0"
            >
                <div className="flex items-center space-x-4 w-1/3">
                    <span className="text-dota-radiant-DEFAULT font-radiance text-3xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(30,192,42,0.5)]">
                        {matchData.radiant_team}
                    </span>
                </div>

                <div className="flex items-center space-x-6">
                    <span className="text-4xl text-white font-mono font-bold">{matchData.radiant_score}</span>
                    <span className="text-dota-gold font-fantasy text-xl">VS</span>
                    <span className="text-4xl text-white font-mono font-bold">{matchData.dire_score}</span>
                </div>

                <div className="flex items-center justify-end space-x-4 w-1/3">
                    <span className="text-dota-dire-DEFAULT font-radiance text-3xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(230,36,18,0.5)]">
                        {matchData.dire_team}
                    </span>
                </div>
            </motion.div>

            {/* Main Content - Split Screen */}
            <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative">

                {/* LEFT: Timeline (2 cols) */}
                <div className="col-span-3 h-full border-r border-dota-border bg-dota-charcoal/40 backdrop-blur-sm z-0">
                    <MatchTimeline events={null} /> {/* Passing null defaults to mock events */}
                </div>

                {/* CENTER: Graph & Map (6 cols) */}
                <div className="col-span-6 h-full relative p-4 flex flex-col space-y-4">
                    {/* Win Prob Graph */}
                    <div className="flex-1 bg-dota-card/50 border border-dota-border rounded-lg relative overflow-hidden backdrop-blur-md shadow-panel p-2">
                        <div className="absolute top-2 left-4 text-dota-silver text-xs uppercase tracking-widest z-10">Win Probability</div>
                        {matchData.prediction && (
                            <Plot
                                data={[
                                    {
                                        x: matchData.prediction.timeline,
                                        y: matchData.prediction.win_prob_series,
                                        type: 'scatter',
                                        mode: 'lines',
                                        line: { shape: 'spline', color: '#FFD700', width: 2 },
                                        fill: 'tozeroy',
                                        fillcolor: 'rgba(255, 215, 0, 0.05)',
                                        name: 'Radiant Win Prob',
                                        hoverinfo: 'y',
                                    },
                                ]}
                                layout={{
                                    autosize: true,
                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                    margin: { l: 40, r: 20, t: 30, b: 40 },
                                    xaxis: {
                                        color: '#555',
                                        gridcolor: '#2A2A2A',
                                        tickfont: { family: 'Consolas', color: '#666' }
                                    },
                                    yaxis: {
                                        color: '#555',
                                        gridcolor: '#2A2A2A',
                                        range: [0, 1],
                                        tickfont: { family: 'Consolas', color: '#666' }
                                    },
                                    showlegend: false,
                                }}
                                useResizeHandler={true}
                                style={{ width: "100%", height: "100%" }}
                                config={{ displayModeBar: false }}
                            />
                        )}

                        {/* Center Current Prob Overlay */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Advantage</h3>
                            <div className={`text-4xl font-bold font-mono ${matchData?.prediction?.win_probability > 0.5 ? 'text-dota-radiant-DEFAULT drop-shadow-[0_0_10px_rgba(30,192,42,0.8)]' : 'text-dota-dire-DEFAULT drop-shadow-[0_0_10px_rgba(230,36,18,0.8)]'}`}>
                                {(Math.abs(((matchData?.prediction?.win_probability || 0.5) - 0.5) * 200)).toFixed(0)}%
                            </div>
                            <div className={`text-xs uppercase tracking-[0.2em] ${matchData?.prediction?.win_probability > 0.5 ? 'text-dota-radiant-dim' : 'text-dota-dire-dim'}`}>
                                {matchData?.prediction?.win_probability > 0.5 ? 'Radiant' : 'Dire'} Leading
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Player Cards (3 cols) */}
                <div className="col-span-3 h-full overflow-y-auto custom-scrollbar border-l border-dota-border bg-dota-charcoal/40 backdrop-blur-sm p-4">
                    <h3 className="text-dota-silver font-radiance tracking-widest text-lg mb-4 text-center">Hero Statistics</h3>
                    <div className="space-y-4">
                        {allPlayers.map((player, idx) => (
                            <div key={player.account_id} onClick={() => navigate(`/player/${player.account_id}`)} className="cursor-pointer">
                                <PlayerCard player={{
                                    ...player,
                                    kda: `${player.kills} / ${player.deaths} / ${player.assists}`
                                }} index={idx} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MatchView;
