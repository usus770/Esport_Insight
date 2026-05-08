import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface WinProbabilityGaugeProps {
    value: number; // 0–100
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

function getZone(value: number) {
    if (value < 25) return { label: 'Critical', color: 'var(--ei-dire)' };
    if (value < 40) return { label: 'Unfavourable', color: 'var(--ei-dire)' };
    if (value < 60) return { label: 'Contested', color: 'var(--ei-amber)' };
    if (value < 75) return { label: 'Favourable', color: 'var(--ei-radiant)' };
    return { label: 'Dominant', color: 'var(--ei-radiant)' };
}

const WinProbabilityGauge: React.FC<WinProbabilityGaugeProps> = ({ value }) => {
    const cx = 120, cy = 110, r = 85;
    const startAngle = 180, endAngle = 360;

    const motionVal = useMotionValue(0);
    const [displayVal, setDisplayVal] = useState(0);

    useEffect(() => {
        const controls = animate(motionVal, value, {
            duration: 1,
            type: 'spring',
            stiffness: 60,
            damping: 15,
            onUpdate: (v) => setDisplayVal(Math.round(v)),
        });
        return controls.stop;
    }, [value]);

    const needleAngle = useTransform(motionVal, [0, 100], [180, 360]);
    const zone = getZone(value);

    return (
        <div className="flex flex-col items-center" style={{ width: 240, height: 165 }}>
            <svg viewBox="0 0 240 130" width="240" height="130">
                {/* Background Track */}
                <path d={describeArc(cx, cy, r, startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} strokeLinecap="round" />

                {/* Red zone 0-35% */}
                <path d={describeArc(cx, cy, r, 180, 180 + 63)} fill="none" stroke="var(--ei-dire)" strokeWidth={10} strokeLinecap="round" opacity={0.35} />
                {/* Amber zone 35-65% */}
                <path d={describeArc(cx, cy, r, 243, 243 + 54)} fill="none" stroke="var(--ei-amber)" strokeWidth={10} strokeLinecap="round" opacity={0.35} />
                {/* Green zone 65-100% */}
                <path d={describeArc(cx, cy, r, 297, 360)} fill="none" stroke="var(--ei-radiant)" strokeWidth={10} strokeLinecap="round" opacity={0.35} />

                {/* Needle */}
                <motion.g style={{ originX: `${cx}px`, originY: `${cy}px`, rotate: needleAngle }}>
                    <line x1={cx} y1={cy} x2={cx + r - 12} y2={cy} stroke={zone.color} strokeWidth={2.5} strokeLinecap="round" />
                    <circle cx={cx} cy={cy} r={5} fill={zone.color} />
                </motion.g>
            </svg>

            {/* Value display */}
            <div className="text-center -mt-8 relative z-10">
                <div className="font-rajdhani text-5xl font-bold" style={{ color: zone.color }}>
                    {displayVal}%
                </div>
                <div className="font-exo text-xs uppercase tracking-[0.2em] mt-1" style={{ color: zone.color }}>
                    {zone.label}
                </div>
            </div>
        </div>
    );
};

export default WinProbabilityGauge;
