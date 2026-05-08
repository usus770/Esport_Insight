import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
    minute: number;
    type: 'death' | 'kill' | 'objective' | 'warning' | 'teamfight';
    label: string;
    impact: 'positive' | 'negative' | 'neutral';
    detail?: string;
}

interface TimelineReelProps {
    events: TimelineEvent[];
    matchMinute: number;
    snapshotMinute: number;
}

const EVENT_STYLES: Record<string, { color: string; symbol: string }> = {
    death: { color: 'var(--ei-dire)', symbol: '▼' },
    kill: { color: 'var(--ei-radiant)', symbol: '▲' },
    objective: { color: 'var(--ei-gold)', symbol: '★' },
    warning: { color: 'var(--ei-amber)', symbol: '◆' },
    teamfight: { color: 'var(--ei-purple)', symbol: '⚔' },
};

function generateDefaultTimeline(deaths: number, kills: number, matchMinute: number): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    const deathInterval = matchMinute / Math.max(deaths, 1);
    for (let i = 0; i < deaths; i++) {
        events.push({
            minute: Math.round(deathInterval * (i + 0.5)),
            type: 'death',
            label: `Death #${i + 1}`,
            impact: 'negative',
            detail: 'Gave away gold and XP to the enemy team.',
        });
    }
    const killInterval = matchMinute / Math.max(kills, 1);
    for (let i = 0; i < kills; i++) {
        events.push({
            minute: Math.round(killInterval * (i + 0.3)),
            type: 'kill',
            label: `Kill #${i + 1}`,
            impact: 'positive',
        });
    }
    // Add some landmarks
    if (matchMinute > 10) events.push({ minute: 10, type: 'warning', label: 'GPM Check', impact: 'neutral', detail: 'GPM benchmark check point' });
    if (matchMinute > 20) events.push({ minute: 20, type: 'objective', label: 'Mid-game Snapshot', impact: 'neutral', detail: 'Coaching snapshot taken here' });

    return events.sort((a, b) => a.minute - b.minute);
}

const TimelineReel: React.FC<TimelineReelProps> = ({ events, matchMinute, snapshotMinute }) => {
    const timelineEvents = events.length > 0 ? events : generateDefaultTimeline(5, 3, matchMinute);
    const totalMin = Math.max(matchMinute, 30);
    const pxPerMin = 32;
    const totalWidth = totalMin * pxPerMin;

    return (
        <div className="w-full">
            <h3 className="font-rajdhani text-sm font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--ei-text-muted)' }}>
                Match Timeline
            </h3>
            <div className="overflow-x-auto rounded-xl" style={{ background: 'var(--ei-bg-surface)', border: '1px solid var(--ei-border-subtle)' }}>
                <div className="relative" style={{ width: totalWidth, height: 90, minWidth: '100%' }}>
                    {/* Snapshot highlight band */}
                    <div
                        className="absolute top-0 bottom-0 z-0"
                        style={{
                            left: (snapshotMinute - 1) * pxPerMin,
                            width: pxPerMin * 2,
                            background: 'var(--ei-gold-glow)',
                            borderLeft: '1px dashed var(--ei-gold-border)',
                            borderRight: '1px dashed var(--ei-gold-border)',
                        }}
                    />

                    {/* Tick marks every 5 min */}
                    {Array.from({ length: Math.floor(totalMin / 5) + 1 }, (_, i) => i * 5).map((min) => (
                        <div
                            key={min}
                            className="absolute top-0 flex flex-col items-center"
                            style={{ left: min * pxPerMin, height: '100%' }}
                        >
                            <div className="w-px flex-1" style={{ background: 'var(--ei-border-subtle)' }} />
                            <span className="font-jetbrains text-[9px] py-1" style={{ color: 'var(--ei-text-muted)' }}>
                                {min}m
                            </span>
                        </div>
                    ))}

                    {/* Events */}
                    {timelineEvents.map((event, i) => {
                        const style = EVENT_STYLES[event.type] || EVENT_STYLES.warning;
                        const leftPx = event.minute * pxPerMin;
                        const isBelow = event.impact === 'negative';

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 15 }}
                                className="absolute group cursor-default"
                                style={{
                                    left: leftPx - 8,
                                    top: isBelow ? 50 : 12,
                                }}
                                title={event.detail || event.label}
                            >
                                <div
                                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                                    style={{
                                        color: style.color,
                                        background: `${style.color}22`,
                                        border: `1px solid ${style.color}44`,
                                    }}
                                >
                                    {style.symbol}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                    <div className="font-exo text-[10px] px-2 py-1 rounded" style={{ background: 'var(--ei-bg-elevated)', color: 'var(--ei-text-primary)', border: '1px solid var(--ei-border-subtle)' }}>
                                        {event.label}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Current minute cursor */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-0 bottom-0 w-0.5 z-10"
                        style={{ left: matchMinute * pxPerMin, background: 'var(--ei-gold)', boxShadow: '0 0 8px var(--ei-gold)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimelineReel;
