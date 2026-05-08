import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown } from 'lucide-react';

interface WeaknessBreakdownProps {
    weaknesses: string[];
}

interface WeaknessDetail {
    severity: 'Critical' | 'Warning' | 'Advisory';
    what: string;
    why: string;
    fix: string;
}

const WEAKNESS_DATA: Record<string, WeaknessDetail> = {
    'High Mortality Rate': {
        severity: 'Critical',
        what: 'You died more than 8 times — each death hands gold and XP to the enemy.',
        why: 'In the pro scene, a 9-death game on a Core hero is usually a loss by design.',
        fix: 'Identify your death locations on the minimap. Most deaths happen off high ground or after overextending.',
    },
    'High Mortality Rate / Positioning Errors': {
        severity: 'Critical',
        what: 'Frequent deaths with positioning as the root cause.',
        why: 'Each death gives the enemy team 200+ gold, compounding their advantage.',
        fix: 'Wait for your team to initiate. Use terrain and fog of war as safety anchors.',
    },
    'Sub-optimal Farming Efficiency': {
        severity: 'Warning',
        what: 'Your GPM was 15%+ below the benchmark for your role.',
        why: 'Every 100 GPM gap = roughly 1 item level behind the enemy every 10 minutes.',
        fix: 'Run the Last Hit Trainer daily. Focus on wave-reading: prioritize creeps over fights.',
    },
    'Low Kill Participation (Passive Play)': {
        severity: 'Advisory',
        what: 'Your kill participation was below 40%, meaning you missed most team fights.',
        why: 'Even showing up for a stun in a fight can swing the outcome.',
        fix: 'Use a minimap alarm: every 3 minutes, ask "where should I be right now?"',
    },
    'Feeding / Critical Positioning Failures': {
        severity: 'Critical',
        what: 'You died over 10 times — this level of deaths directly funds enemy itemization.',
        why: 'At 10+ deaths, you have given away ~2000+ unreliable gold to the enemy team.',
        fix: 'Replay review: mark every death and categorize it. Cut the avoidable deaths by 50%.',
    },
    'Inconsistent Performance (Drop Detected)': {
        severity: 'Warning',
        what: 'A significant performance drop was detected mid-game.',
        why: 'This usually indicates tilting, fatigue, or a lost mental edge after a bad fight.',
        fix: 'After a bad teamfight, take 5 seconds to farm a neutral camp. Reset before re-engaging.',
    },
    'Isolated from Team Fights': {
        severity: 'Advisory',
        what: 'Your participation in kills was extremely low.',
        why: 'Being absent from fights means your team is always fighting 4v5.',
        fix: 'Carry a TP scroll always. When you see a fight erupting, TP in immediately.',
    },
};

const DEFAULT_DETAIL: WeaknessDetail = {
    severity: 'Advisory',
    what: 'An area for potential improvement was identified.',
    why: 'Addressing this can incrementally improve your performance.',
    fix: 'Review your replay and focus on this specific metric in your next game.',
};

const SEVERITY_STYLES = {
    Critical: { color: 'var(--ei-dire)', bg: 'var(--ei-dire-dim)', icon: '🔴' },
    Warning: { color: 'var(--ei-amber)', bg: 'rgba(245,166,35,0.10)', icon: '🟡' },
    Advisory: { color: 'var(--ei-blue)', bg: 'rgba(91,156,246,0.10)', icon: '🔵' },
};

const WeaknessCard: React.FC<{ weakness: string; index: number }> = ({ weakness, index }) => {
    const [open, setOpen] = useState(false);
    const detail = WEAKNESS_DATA[weakness] || DEFAULT_DETAIL;
    const style = SEVERITY_STYLES[detail.severity];

    return (
        <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-lg overflow-hidden cursor-pointer"
            style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}
            onClick={() => setOpen(!open)}
        >
            {/* Collapsed header */}
            <div className="flex items-center gap-3 p-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 4 }}
                    transition={{ delay: index * 0.08 + 0.3, duration: 0.4 }}
                    className="self-stretch rounded-full flex-shrink-0"
                    style={{ background: style.color }}
                />
                <span className="text-sm">{style.icon}</span>
                <div className="flex-1">
                    <div className="font-rajdhani text-sm font-semibold" style={{ color: 'var(--ei-text-primary)' }}>
                        {weakness}
                    </div>
                    <div className="font-exo text-[10px] uppercase tracking-widest" style={{ color: style.color }}>
                        {detail.severity}
                    </div>
                </div>
                <ChevronDown
                    size={16}
                    style={{
                        color: 'var(--ei-text-muted)',
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                    }}
                />
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--ei-border-subtle)' }}>
                            <div className="pt-3">
                                <div className="font-rajdhani text-xs font-bold uppercase tracking-wider mb-1" style={{ color: style.color }}>What</div>
                                <p className="font-exo text-sm" style={{ color: 'var(--ei-text-secondary)' }}>{detail.what}</p>
                            </div>
                            <div>
                                <div className="font-rajdhani text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ei-text-muted)' }}>Why It Matters</div>
                                <p className="font-exo text-sm" style={{ color: 'var(--ei-text-secondary)' }}>{detail.why}</p>
                            </div>
                            <div className="rounded-md p-3" style={{ background: style.bg }}>
                                <div className="font-rajdhani text-xs font-bold uppercase tracking-wider mb-1" style={{ color: style.color }}>Recommended Fix</div>
                                <p className="font-exo text-sm" style={{ color: 'var(--ei-text-primary)' }}>{detail.fix}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const WeaknessBreakdown: React.FC<WeaknessBreakdownProps> = ({ weaknesses }) => {
    return (
        <div className="space-y-3">
            <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2 mb-4"
                style={{ color: 'var(--ei-dire)' }}>
                <AlertTriangle size={16} /> Execution Gaps
            </h3>
            {weaknesses.map((w, i) => (
                <WeaknessCard key={i} weakness={w} index={i} />
            ))}
        </div>
    );
};

export default WeaknessBreakdown;
