import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PerformanceRadarProps {
    metrics: {
        gpm: number;
        gpmBenchmark: number;
        xpm: number;
        xpmBenchmark: number;
        deaths: number;
        killParticipation: number;
        lastHits: number;
        heroDamage?: number;
        netWorth: number;
        matchMinute: number;
    };
}

function normalize(value: number, bench: number, inverse = false): number {
    if (inverse) return Math.max(0, Math.min(100, Math.round((1 - value / 15) * 100)));
    const ratio = value / bench;
    const clamped = Math.min(ratio, 1.5);
    return Math.round((clamped / 1.5) * 100);
}

const AXES = ['Economy', 'Experience', 'Survival', 'Aggression', 'Farm Eff.', 'Impact'];

function polarToCartesian(cx: number, cy: number, r: number, angleIndex: number, total: number) {
    const angle = (Math.PI * 2 * angleIndex) / total - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function buildPolygon(cx: number, cy: number, r: number, values: number[]): string {
    return values
        .map((v, i) => {
            const { x, y } = polarToCartesian(cx, cy, (r * v) / 100, i, values.length);
            return `${x},${y}`;
        })
        .join(' ');
}

const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ metrics }) => {
    const cx = 150, cy = 150, outerR = 110;
    const n = AXES.length;

    const playerValues = useMemo(() => [
        normalize(metrics.gpm, metrics.gpmBenchmark),
        normalize(metrics.xpm, metrics.xpmBenchmark),
        normalize(metrics.deaths, 1, true),
        Math.min(100, metrics.killParticipation),
        normalize(metrics.lastHits / Math.max(metrics.matchMinute, 1), 8), // ~8 LH/min benchmark
        normalize((metrics.heroDamage || 0) / Math.max(metrics.netWorth, 1), 1.5),
    ], [metrics]);

    const benchValues = [80, 80, 75, 65, 80, 70]; // Pro benchmark normalized

    const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

    const avgScore = Math.round(playerValues.reduce((a, b) => a + b, 0) / playerValues.length);
    const isGood = avgScore >= 55;

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 300 300" width="280" height="280">
                {/* Grid rings */}
                {rings.map((fraction) => (
                    <polygon
                        key={fraction}
                        points={Array.from({ length: n }, (_, i) => {
                            const { x, y } = polarToCartesian(cx, cy, outerR * fraction, i, n);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={1}
                    />
                ))}

                {/* Grid lines from center */}
                {AXES.map((_, i) => {
                    const { x, y } = polarToCartesian(cx, cy, outerR, i, n);
                    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />;
                })}

                {/* Benchmark polygon */}
                <polygon
                    points={buildPolygon(cx, cy, outerR, benchValues)}
                    fill="rgba(255,215,0,0.06)"
                    stroke="rgba(255,215,0,0.35)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                />

                {/* Player polygon */}
                <motion.polygon
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    points={buildPolygon(cx, cy, outerR, playerValues)}
                    fill={isGood ? 'rgba(79,195,138,0.12)' : 'rgba(224,82,82,0.12)'}
                    stroke={isGood ? 'var(--ei-radiant)' : 'var(--ei-dire)'}
                    strokeWidth={2}
                />

                {/* Data points */}
                {playerValues.map((v, i) => {
                    const { x, y } = polarToCartesian(cx, cy, (outerR * v) / 100, i, n);
                    return (
                        <motion.circle
                            key={i}
                            initial={{ r: 0 }}
                            animate={{ r: 4 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                            cx={x}
                            cy={y}
                            fill={isGood ? 'var(--ei-radiant)' : 'var(--ei-dire)'}
                            style={{ filter: `drop-shadow(0 0 4px ${isGood ? 'var(--ei-radiant)' : 'var(--ei-dire)'})` }}
                        />
                    );
                })}

                {/* Axis Labels */}
                {AXES.map((label, i) => {
                    const { x, y } = polarToCartesian(cx, cy, outerR + 22, i, n);
                    return (
                        <text
                            key={label}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="var(--ei-text-secondary)"
                            fontSize="10"
                            fontFamily="'Exo 2', sans-serif"
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-2 text-[10px] font-exo uppercase tracking-wider" style={{ color: 'var(--ei-text-muted)' }}>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5" style={{ backgroundColor: 'rgba(255,215,0,0.5)', display: 'inline-block' }} /> Pro Benchmark
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5" style={{ backgroundColor: isGood ? 'var(--ei-radiant)' : 'var(--ei-dire)', display: 'inline-block' }} /> Your Performance
                </span>
            </div>
        </div>
    );
};

export default PerformanceRadar;
