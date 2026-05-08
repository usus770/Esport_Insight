import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, MapPin, ChevronDown } from 'lucide-react';

interface Drill {
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Pro';
    desc: string;
    target?: string;
    duration?: string;
    focusArea?: string;
}

interface DrillCardProps {
    drill: Drill;
    index: number;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    Easy: { bg: 'rgba(79,195,138,0.12)', border: 'var(--ei-radiant)', text: 'var(--ei-radiant)' },
    Medium: { bg: 'rgba(245,166,35,0.12)', border: 'var(--ei-amber)', text: 'var(--ei-amber)' },
    Hard: { bg: 'rgba(224,82,82,0.12)', border: 'var(--ei-dire)', text: 'var(--ei-dire)' },
    Pro: { bg: 'rgba(155,114,248,0.12)', border: 'var(--ei-purple)', text: 'var(--ei-purple)' },
};

const FOCUS_LABELS: Record<string, string> = {
    Mechanics: 'Builds muscle memory and reaction time',
    'Decision-making': 'Improves strategic thinking under pressure',
    'Game Sense': 'Sharpens awareness and map reading',
    'Mental Game': 'Develops analytical review habits',
};

const DrillCard: React.FC<DrillCardProps> = ({ drill, index }) => {
    const [expanded, setExpanded] = useState(false);
    const colors = DIFFICULTY_COLORS[drill.difficulty] || DIFFICULTY_COLORS.Medium;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="group relative overflow-hidden rounded-xl"
            style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}
        >
            {/* Left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: colors.border }} />

            <div className="p-5 pl-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span
                            className="font-rajdhani text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                        >
                            {drill.difficulty}
                        </span>
                        {drill.focusArea && (
                            <span className="font-exo text-[10px] uppercase tracking-wider" style={{ color: 'var(--ei-text-muted)' }}>
                                {drill.focusArea}
                            </span>
                        )}
                    </div>
                </div>

                {/* Name */}
                <h4 className="font-rajdhani text-lg font-semibold mb-2 group-hover:text-[var(--ei-gold)] transition-colors"
                    style={{ color: 'var(--ei-text-primary)' }}>
                    {drill.name}
                </h4>

                {/* Description */}
                <p className="font-exo text-sm leading-relaxed mb-4" style={{ color: 'var(--ei-text-secondary)' }}>
                    {drill.desc}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 text-xs font-jetbrains" style={{ color: 'var(--ei-text-muted)' }}>
                    {drill.target && (
                        <span className="flex items-center gap-1.5">
                            <Target size={12} style={{ color: colors.text }} /> {drill.target}
                        </span>
                    )}
                    {drill.duration && (
                        <span className="flex items-center gap-1.5">
                            <Clock size={12} style={{ color: 'var(--ei-amber)' }} /> {drill.duration}
                        </span>
                    )}
                    {drill.focusArea && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={12} style={{ color: 'var(--ei-blue)' }} /> {drill.focusArea}
                        </span>
                    )}
                </div>

                {/* Why this matters (expandable) */}
                {drill.focusArea && FOCUS_LABELS[drill.focusArea] && (
                    <div className="mt-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-[11px] font-exo uppercase tracking-wider"
                            style={{ color: 'var(--ei-text-muted)' }}
                        >
                            Why this matters
                            <ChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                        </button>
                        {expanded && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="font-exo text-xs mt-1.5 leading-relaxed"
                                style={{ color: 'var(--ei-text-secondary)' }}
                            >
                                {FOCUS_LABELS[drill.focusArea]}. This drill directly addresses the weaknesses identified in your match analysis.
                            </motion.p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DrillCard;
