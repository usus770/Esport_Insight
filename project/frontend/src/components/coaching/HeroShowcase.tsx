import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HeroShowcaseProps {
    heroName: string;
    role: string;
    matchMinute: number;
    kills: number;
    deaths: number;
    assists: number;
}

const HERO_IMAGE_MAP: Record<string, string> = {
    'Anti-Mage': '/assets/heroes/anti_mage.png',
    'Crystal Maiden': '/assets/heroes/crystal_maiden.png',
    'Invoker': '/assets/heroes/invoker.png',
    'Pudge': '/assets/heroes/pudge.png',
    'Juggernaut': '/assets/heroes/juggernaut.png',
    'Earthshaker': '/assets/heroes/earthshaker.png',
};

const ROLE_COLORS: Record<string, string> = {
    Core: 'var(--ei-gold)',
    Support: 'var(--ei-teal)',
    Mid: 'var(--ei-purple)',
    Offlane: 'var(--ei-amber)',
    Jungle: 'var(--ei-radiant)',
};

const HeroShowcase: React.FC<HeroShowcaseProps> = ({ heroName, role, matchMinute, kills, deaths, assists }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const heroKey = heroName || 'Invoker';
    const imgSrc = HERO_IMAGE_MAP[heroKey] || '/assets/heroes/invoker.png';
    const roleColor = ROLE_COLORS[role] || 'var(--ei-gold)';

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
                height: 200,
                background: 'linear-gradient(135deg, var(--ei-bg-void) 0%, var(--ei-bg-surface) 100%)',
                border: '1px solid var(--ei-border-subtle)',
            }}
        >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 15% 50%, rgba(255,215,0,0.08) 0%, transparent 60%)' }} />

            {/* Hero image (left side) */}
            <div className="absolute left-0 top-0 bottom-0 w-56 overflow-hidden">
                {!imgLoaded && <div className="w-full h-full skeleton-text" />}
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: imgLoaded ? 1 : 0 }}
                    transition={{ duration: 0.6 }}
                    src={imgSrc}
                    alt={heroKey}
                    className="w-full h-full object-contain object-center"
                    style={{
                        filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.25))',
                        maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
                    }}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgLoaded(true)}
                />
            </div>

            {/* Hero name + info (center-right) */}
            <div className="absolute inset-0 flex items-center justify-center pl-36">
                <div className="text-center">
                    <motion.h2
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-widest"
                        style={{
                            background: 'linear-gradient(135deg, var(--ei-gold) 0%, var(--ei-gold-dim) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 8px rgba(255,215,0,0.3))',
                        }}
                    >
                        {heroKey}
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-center gap-4 mt-3"
                    >
                        <span
                            className="font-rajdhani text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                            style={{ background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44` }}
                        >
                            {role}
                        </span>
                        <span className="font-jetbrains text-xs" style={{ color: 'var(--ei-text-muted)' }}>
                            @{matchMinute}:00
                        </span>
                        <span className="font-jetbrains text-sm" style={{ color: 'var(--ei-text-primary)' }}>
                            <span style={{ color: 'var(--ei-radiant)' }}>{kills}</span>
                            <span style={{ color: 'var(--ei-text-muted)' }}>/</span>
                            <span style={{ color: 'var(--ei-dire)' }}>{deaths}</span>
                            <span style={{ color: 'var(--ei-text-muted)' }}>/</span>
                            <span style={{ color: 'var(--ei-teal)' }}>{assists}</span>
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Bottom gradient border */}
            <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--ei-gold-border), transparent)' }} />
        </div>
    );
};

export default HeroShowcase;
