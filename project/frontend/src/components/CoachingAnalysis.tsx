import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Zap, Star, Activity, Target } from 'lucide-react';
import { analyzePerformance } from '../services/api';

import HeroShowcase from './coaching/HeroShowcase';
import WinProbabilityGauge from './coaching/WinProbabilityGauge';
import PerformanceRadar from './coaching/PerformanceRadar';
import WeaknessBreakdown from './coaching/WeaknessBreakdown';
import TimelineReel from './coaching/TimelineReel';
import DrillCard from './coaching/DrillCard';

/* ——— Interfaces ——— */
export interface PlayerMetricsEnriched {
    hero: string;
    role: string;
    gpm: number;
    gpmBenchmark: number;
    xpm: number;
    xpmBenchmark: number;
    kills: number;
    deaths: number;
    assists: number;
    killParticipation: number;
    netWorth: number;
    lastHits: number;
    winProbability: number;
    matchMinute: number;
    heroDamage?: number;
    heroHealing?: number;
    towerDamage?: number;
    // legacy fields for backend compat
    win_prob_20min?: number;
    gold_diff?: number;
    benchmark_gpm?: number;
    hero_winrate?: number;
    top_important_features?: string[];
    performance_drop_detected?: boolean;
    momentum_shift_detected?: boolean;
}

interface CoachingAnalysisProps {
    playerMetrics: PlayerMetricsEnriched;
}

/* ——— Section wrapper ——— */
const Section: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        {children}
    </motion.div>
);

/* ——— Skeleton loader ——— */
const SkeletonLoader = () => (
    <div className="space-y-6 p-4">
        <div className="skeleton-text h-48 w-full rounded-2xl" />
        <div className="coaching-main-grid">
            <div className="skeleton-text h-72 rounded-xl" />
            <div className="skeleton-text h-72 rounded-xl" />
        </div>
        <div className="skeleton-text h-24 rounded-xl" />
        <div className="drills-grid">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-text h-40 rounded-xl" />)}
        </div>
    </div>
);

/* ——— Tactic Card ——— */
const TacticCard: React.FC<{ text: string; index: number }> = ({ text, index }) => {
    const icons = [Shield, Target, Zap, Star];
    const Icon = icons[index % icons.length];
    const executionDifficulty = text.length > 100 ? 3 : text.length > 60 ? 2 : 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.07 }}
            className="flex gap-4 p-4 rounded-xl"
            style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}
        >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--ei-gold-glow)', border: '1px solid var(--ei-gold-border)' }}>
                <Icon size={16} style={{ color: 'var(--ei-gold)' }} />
            </div>
            <div className="flex-1">
                <p className="font-exo text-sm leading-relaxed" style={{ color: 'var(--ei-text-primary)' }}>{text}</p>
                <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map(d => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: d <= executionDifficulty ? 'var(--ei-gold)' : 'var(--ei-text-muted)' }} />
                    ))}
                    <span className="font-exo text-[9px] ml-1 uppercase" style={{ color: 'var(--ei-text-muted)' }}>execution</span>
                </div>
            </div>
        </motion.div>
    );
};

/* ——— Main Component ——— */
const CoachingAnalysis: React.FC<CoachingAnalysisProps> = ({ playerMetrics }) => {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = useCallback(() => {
        setLoading(true);
        setError(null);

        const backendPayload = {
            role: playerMetrics.role || 'Core',
            hero: playerMetrics.hero || 'Asset',
            win_prob_20min: playerMetrics.winProbability || playerMetrics.win_prob_20min || 50,
            gold_diff: playerMetrics.gold_diff || 0,
            gpm: playerMetrics.gpm || 0,
            benchmark_gpm: playerMetrics.gpmBenchmark || playerMetrics.benchmark_gpm || 550,
            xpm: playerMetrics.xpm || 0,
            kill_participation: playerMetrics.killParticipation || 50,
            deaths: playerMetrics.deaths || 0,
            hero_winrate: playerMetrics.hero_winrate || 50,
            top_important_features: playerMetrics.top_important_features || ['gpm', 'deaths'],
            performance_drop_detected: playerMetrics.performance_drop_detected || false,
            momentum_shift_detected: playerMetrics.momentum_shift_detected || false,
        };

        analyzePerformance(backendPayload as any)
            .then(setAnalysis)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [playerMetrics]);

    // ——— IDLE STATE ———
    if (!analysis && !loading && !error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl"
                style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'var(--ei-gold-glow)', border: '1px solid var(--ei-gold-border)' }}
                >
                    <Brain className="w-10 h-10 animate-pulse" style={{ color: 'var(--ei-gold)' }} />
                </motion.div>
                <h3 className="font-rajdhani text-2xl font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--ei-text-primary)' }}>
                    Analysis Engine Ready
                </h3>
                <p className="font-exo text-sm text-center max-w-md mb-8" style={{ color: 'var(--ei-text-secondary)' }}>
                    Generate deep performance insights for <strong style={{ color: 'var(--ei-gold)' }}>{playerMetrics.hero || 'this asset'}</strong>.
                    Our system will analyze {playerMetrics.role || 'Primary'} operation patterns.
                </p>
                <button
                    onClick={fetchAnalysis}
                    className="flex items-center gap-3 font-rajdhani font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, var(--ei-gold), var(--ei-gold-dim))',
                        color: '#000',
                        boxShadow: '0 0 20px rgba(255,215,0,0.25)',
                    }}
                >
                    <Activity size={18} /> Initialize Deep Analysis
                </button>
            </div>
        );
    }

    // ——— LOADING STATE ———
    if (loading) return <SkeletonLoader />;

    // ——— ERROR STATE ———
    if (error) {
        return (
            <div className="p-6 rounded-xl flex items-center gap-4" style={{ background: 'var(--ei-dire-dim)', border: '1px solid rgba(224,82,82,0.3)' }}>
                <Zap size={24} style={{ color: 'var(--ei-dire)' }} />
                <div>
                    <h4 className="font-rajdhani font-bold" style={{ color: 'var(--ei-dire)' }}>Analysis Failed</h4>
                    <p className="font-exo text-sm" style={{ color: 'var(--ei-text-secondary)' }}>{error}</p>
                </div>
            </div>
        );
    }

    // ——— FULL DASHBOARD ———
    const m = playerMetrics;
    return (
        <div className="space-y-6">
            {/* 1. HERO SHOWCASE */}
            <Section delay={0}>
                <HeroShowcase
                    heroName={m.hero}
                    role={m.role}
                    matchMinute={m.matchMinute || 20}
                    kills={m.kills || 0}
                    deaths={m.deaths || 0}
                    assists={m.assists || 0}
                />
            </Section>

            {/* 2. VERDICT + GAUGE */}
            <Section delay={0.1}>
                <div className="coaching-main-grid">
                    {/* Diagnosis */}
                    <div className="p-6 rounded-xl" style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}>
                        <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2 mb-4" style={{ color: 'var(--ei-gold)' }}>
                            <Brain size={16} /> Analysis Engine Verdict
                        </h3>
                        <p className="font-exo text-base leading-relaxed" style={{ color: 'var(--ei-text-primary)' }}>
                            {analysis.diagnosis}
                        </p>
                        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--ei-border-subtle)' }}>
                            <p className="font-exo text-xs italic" style={{ color: 'var(--ei-text-muted)' }}>
                                {analysis.summary}
                            </p>
                        </div>
                    </div>

                    {/* Win Probability */}
                    <div className="p-6 rounded-xl flex flex-col items-center justify-center"
                        style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}>
                        <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--ei-text-muted)' }}>
                            Success Probability
                        </h3>
                        <WinProbabilityGauge value={m.winProbability || m.win_prob_20min || 50} />
                    </div>
                </div>
            </Section>

            {/* 3. RADAR + WEAKNESSES */}
            <Section delay={0.2}>
                <div className="coaching-main-grid">
                    <div className="p-6 rounded-xl" style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}>
                        <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2 mb-4" style={{ color: 'var(--ei-text-secondary)' }}>
                            <Activity size={16} /> Performance Profile
                        </h3>
                        <PerformanceRadar metrics={{
                            gpm: m.gpm || 0,
                            gpmBenchmark: m.gpmBenchmark || m.benchmark_gpm || 550,
                            xpm: m.xpm || m.xpm || 0,
                            xpmBenchmark: m.xpmBenchmark || 580,
                            deaths: m.deaths || 0,
                            killParticipation: m.killParticipation || 50,
                            lastHits: m.lastHits || 0,
                            heroDamage: m.heroDamage || 0,
                            netWorth: m.netWorth || 1,
                            matchMinute: m.matchMinute || 20,
                        }} />
                    </div>

                    <WeaknessBreakdown weaknesses={analysis.weaknesses || []} />
                </div>
            </Section>

            {/* 4. TIMELINE */}
            <Section delay={0.3}>
                <TimelineReel events={[]} matchMinute={m.matchMinute || 20} snapshotMinute={m.matchMinute || 20} />
            </Section>

            {/* 5. TACTICAL RECOMMENDATIONS */}
            <Section delay={0.4}>
                <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2 mb-4" style={{ color: 'var(--ei-radiant)' }}>
                    <Target size={16} /> Strategic Recommendations
                </h3>
                <div className="coaching-main-grid">
                    {(analysis.tactics || []).map((t: string, i: number) => (
                        <TacticCard key={i} text={t} index={i} />
                    ))}
                </div>
            </Section>

            {/* 6. TRAINING DRILLS */}
            <Section delay={0.5}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2" style={{ color: 'var(--ei-amber)' }}>
                        <Zap size={16} /> Optimization Regimen
                    </h3>
                    <span className="font-exo text-[10px] uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ background: 'var(--ei-bg-glass)', color: 'var(--ei-text-muted)', border: '1px solid var(--ei-border-subtle)' }}>
                        AI Generated
                    </span>
                </div>
                <div className="drills-grid">
                    {(analysis.drills || []).map((drill: any, i: number) => (
                        <DrillCard key={i} drill={drill} index={i} />
                    ))}
                </div>
            </Section>

            {/* 7. ADVICE SIDEBAR (Mechanics, Strategy, Meta) */}
            <Section delay={0.6}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: 'Mechanics', icon: Zap, color: 'var(--ei-dire)', content: analysis.mechanical_focus },
                        { title: 'Strategy', icon: Shield, color: 'var(--ei-blue)', content: analysis.strategic_advice },
                        { title: 'Meta Insight', icon: Star, color: 'var(--ei-gold)', content: analysis.meta_advice },
                    ].map((card) => (
                        <div key={card.title} className="p-5 rounded-xl relative overflow-hidden" style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-3xl opacity-20" style={{ background: card.color }} />
                            <h5 className="font-rajdhani text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3 pb-2" style={{ color: 'var(--ei-text-muted)', borderBottom: '1px solid var(--ei-border-subtle)' }}>
                                <card.icon size={12} style={{ color: card.color }} /> {card.title}
                            </h5>
                            <p className="font-exo text-sm leading-relaxed" style={{ color: 'var(--ei-text-secondary)' }}>{card.content}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default CoachingAnalysis;
