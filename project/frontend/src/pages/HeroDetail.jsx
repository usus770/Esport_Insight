import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, Sword, Shield, Zap } from 'lucide-react';

const mockHeroDetails = {
    1: {
        name: "Anti-Mage", role: "Carry", difficulty: "High", quote: "Magic ends here.", description: "A highly mobile carry who drains mana and punishes spellcasters.",
        stats: { strength: 21, agility: 24, intelligence: 12 },
        moves: [
            { name: "Mana Void Combo", desc: "Blink > Abyssal Blade > Manta Style > Mana Void. Use on low mana targets for massive AoE damage." },
            { name: "Split Pushing", desc: "Use Blink to safely cut waves. Battle Fury is essential for farming speed." }
        ],
        videos: [
            { title: "Quick Antimage Carry Guide [New Patch]", url: "https://www.youtube.com/watch?v=Ye8HfzbFgCo" },
            { title: "Solo Mid AM Gameplay - Unlimited Mana Burn", url: "https://www.youtube.com/watch?v=law1_YpwKPo" },
            { title: "10K Coach: How to 1v9 as Anti-Mage", url: "https://www.youtube.com/watch?v=E5CSAQAy0Cs" }
        ]
    },
    2: {
        name: "Crystal Maiden", role: "Support", difficulty: "Low", quote: "Swift as the wolves of Icewrack.", description: "A fragile but powerful support who provides global mana regeneration.",
        stats: { strength: 17, agility: 16, intelligence: 14 },
        moves: [
            { name: "Glimmer Ult", desc: "Position in trees > Activate Freezing Field > Use Glimmer Cape immediately to survive." },
            { name: "Root & Nuke", desc: "Frostbite to hold enemy > Crystal Nova for slow and damage." }
        ],
        videos: [
            { title: "How To Play Crystal Maiden | Support Spotlight", url: "https://www.youtube.com/watch?v=Np0ThT1JI4U" },
            { title: "How Freezing Field Actually Works", url: "https://www.youtube.com/watch?v=9vkCA-6BNME" },
            { title: "Basic CM Guide: Warding & Mana", url: "https://www.youtube.com/watch?v=hylfUwP5R0E" }
        ]
    },
    3: {
        name: "Invoker", role: "Mid/Carry", difficulty: "Very High", quote: "I am a beacon of knowledge blazing out across a black sea of ignorance.", description: "A complex arsenal mage who combines three elements to cast ten distinct spells.",
        stats: { strength: 19, agility: 14, intelligence: 19 },
        moves: [
            { name: "Tornado Meteor Blast", desc: "Tornado > Chaos Meteor > Sun Strike/Deafening Blast combo for massive AoE." },
            { name: "Cold Snap Forge", desc: "Summon Forge Spirits > Cold Snap for early game lane dominance and harassment." }
        ],
        videos: [
            { title: "All Invoker Combos You Should Know", url: "https://www.youtube.com/watch?v=SCC_8RdgYzo" },
            { title: "Invoker: Quas Wex vs Exort Explained", url: "https://www.youtube.com/watch?v=qkVNaqRPWbk" },
            { title: "Sumiya World Best Invoker Gameplay", url: "https://www.youtube.com/watch?v=g3gZoQ2DQZ4" }
        ]
    }
};

const HeroDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hero = mockHeroDetails[id] || mockHeroDetails[1]; // Fallback to AM

    return (
        <div className="min-h-screen bg-dota-black text-white pb-20">
            {/* Hero Banner */}
            <div className="relative h-64 md:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-dota-map bg-cover opacity-50 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-dota-black to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-12">
                    <button onClick={() => navigate('/hub')} className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> Back to Hub
                    </button>
                    <motion.h1
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-6xl font-radiance text-white tracking-widest glow-text"
                    >
                        {hero.name}
                    </motion.h1>
                    <div className="flex gap-4 mt-4">
                        <span className="px-3 py-1 bg-red-900/50 border border-red-500 rounded text-red-300 uppercase text-xs tracking-wider">{hero.role}</span>
                        <span className="px-3 py-1 bg-yellow-900/50 border border-yellow-500 rounded text-yellow-300 uppercase text-xs tracking-wider">Difficulty: {hero.difficulty}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Col: Stats & Lore */}
                <div className="space-y-8">
                    <section className="bg-dota-card p-6 border border-dota-border rounded shadow-panel">
                        <h3 className="font-radiance text-xl text-dota-gold mb-4 border-b border-dota-border/50 pb-2">Attributes</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="bg-red-600 rounded-full p-2"><Sword size={16} /></span>
                                <div>
                                    <div className="text-xs text-gray-400">Strength</div>
                                    <div className="font-mono text-lg">{hero.stats.strength}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="bg-green-600 rounded-full p-2"><Shield size={16} /></span>
                                <div>
                                    <div className="text-xs text-gray-400">Agility</div>
                                    <div className="font-mono text-lg">{hero.stats.agility}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="bg-blue-600 rounded-full p-2"><Zap size={16} /></span>
                                <div>
                                    <div className="text-xs text-gray-400">Intelligence</div>
                                    <div className="font-mono text-lg">{hero.stats.intelligence}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <blockquote className="italic text-gray-500 border-l-2 border-dota-gold pl-4 py-2">
                        "{hero.quote}"
                    </blockquote>
                </div>

                {/* Right Col: Learning & Moves */}
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-3xl font-radiance text-white mb-6">Signature Moves</h2>
                        <div className="grid gap-4">
                            {hero.moves.map((move, idx) => (
                                <div key={idx} className="bg-dota-charcoal p-6 border-l-4 border-l-dota-radiant-DEFAULT rounded shadow pr-12 relative overflow-hidden group hover:bg-black/40 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sword size={64} />
                                    </div>
                                    <h4 className="text-xl font-bold text-dota-radiant-DEFAULT mb-2">{move.name}</h4>
                                    <p className="text-gray-300">{move.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-radiance text-white mb-6">Pro Replays & Guides</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {hero.videos.map((vid, idx) => (
                                <a
                                    key={idx}
                                    href={vid.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-black/50 aspect-video rounded-lg border border-dota-border flex flex-col items-center justify-center cursor-pointer group hover:border-dota-gold transition-colors relative no-underline"
                                >
                                    <PlayCircle size={48} className="text-white/50 group-hover:text-dota-gold transition-colors" />
                                    <p className="mt-4 font-bold text-gray-400 group-hover:text-white px-2 text-center">{vid.title}</p>
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">YouTube</span>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HeroDetail;
