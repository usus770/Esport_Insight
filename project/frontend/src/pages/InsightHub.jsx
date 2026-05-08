import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Map, Swords, Shield, Trophy, Clock, Star } from 'lucide-react';

const mockHeroes = [
    { id: 1, name: "Anti-Mage", role: "Carry", difficulty: "High", imgUrl: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png" },
    { id: 2, name: "Crystal Maiden", role: "Support", difficulty: "Low", imgUrl: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crystal_maiden.png" },
    { id: 3, name: "Invoker", role: "Mid", difficulty: "Very High", imgUrl: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png" },
    { id: 4, name: "Pudge", role: "Tank", difficulty: "Medium", imgUrl: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png" },
    { id: 5, name: "Juggernaut", role: "Carry", difficulty: "Low", imgUrl: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png" },
    { id: 6, name: "Earthshaker", role: "Support", difficulty: "Medium", imgUrl: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/earthshaker.png" },
];

const mechanicInsights = [
    { id: 7, title: "Rune Spawn Timings", category: "Map Control", icon: <Clock className="w-8 h-8 text-blue-400" />, desc: "Water: 2:00, 4:00. Bounty: 0:00, then every 3 mins. Wisdom: Every 7 mins. Power Runes: Every 2 mins starting at 6:00." },
    { id: 8, title: "Tormentor Objective", category: "Objectives", icon: <Shield className="w-8 h-8 text-purple-400" />, desc: "Spawns at 20:00. Grants Aghanim's Shard to the lowest net worth hero without one. Regenerates health fast natively." },
    { id: 9, title: "Camp Stacking", category: "Farming", icon: <Map className="w-8 h-8 text-green-400" />, desc: "Pull creeps aggressively out of their spawn box starting around X:53 - X:55 to stack multiple camp layers." },
    { id: 10, title: "Roshan Respawns", category: "Objectives", icon: <Trophy className="w-8 h-8 text-red-500" />, desc: "Respawns randomly between 8 to 11 minutes after being slain. Drops Aegis, and subsequent deaths drop Cheese, Aghanim's Blessing, or Refresher Shard." },
];

const metaItems = [
    { id: 11, name: "Black King Bar", type: "Defense", desc: "Provides spell immunity (Avatar). Crucial for teamfight survival.", price: 4050 },
    { id: 12, name: "Khanda", type: "Damage", desc: "Empowers single-target spells with massive physical burst based on attack damage.", price: 5000 },
    { id: 13, name: "Parasma", type: "Magic Burst", desc: "Reduces enemy magic resistance on attack and applies a damage over time effect.", price: 5575 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const InsightHub = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Heroes'); // 'Heroes', 'Mechanics', 'Items'

    const filteredHeroes = mockHeroes.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            
            {/* Header section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 relative"
            >
                {/* Featured glowing banner */}
                <motion.div 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="max-w-3xl mx-auto bg-gradient-to-r from-dota-radiant-DEFAULT/20 via-dota-card to-dota-dire-DEFAULT/20 border border-dota-border rounded-xl p-4 flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                >
                    <Star className="text-dota-gold w-6 h-6 animate-pulse" />
                    <span className="text-white font-radiance">Featured Insight: Play the map around Wisdom Runes at 7:00, 14:00, 21:00.</span>
                </motion.div>

                <div>
                    <h1 className="text-5xl font-radiance text-transparent bg-clip-text bg-gradient-to-r from-dota-gold to-yellow-200 tracking-widest glow-text drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">
                        Knowledge Hub
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                        Master the ancients. Explore hero guides, critical mechanics, and the current meta item builds.
                    </p>
                </div>

                <div className="relative max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search across the hub..."
                        className="w-full bg-dota-charcoal/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full pl-14 text-white focus:border-dota-gold outline-none transition-all shadow-panel"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-5 top-4 text-gray-400 w-6 h-6" />
                </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-4 border-b border-white/10 pb-4">
                {['Heroes', 'Mechanics', 'Items'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full font-radiance transition-all ${activeTab === tab 
                            ? 'bg-dota-gold text-black font-bold shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                            : 'bg-dota-charcoal text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Based on Tabs */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'Heroes' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredHeroes.map((hero) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={hero.id}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => navigate(`/hero/${hero.id}`)}
                                    className="bg-dota-card/60 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] group relative"
                                >
                                    <div className="h-44 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
                                        <img src={hero.imgUrl} alt={hero.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dota-card via-transparent to-transparent opacity-90" />
                                    </div>
                                    <div className="p-5 relative -mt-10 bg-dota-card/90 backdrop-blur-md rounded-t-xl border-t border-white/10">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-dota-gold transition-colors font-radiance">{hero.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded bg-black/40 border ${hero.difficulty === 'High' || hero.difficulty === 'Very High' ? 'border-red-500/50 text-red-400' : 'border-green-500/50 text-green-400'}`}>
                                                {hero.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-dota-silver">{hero.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'Mechanics' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mechanicInsights.map((mech) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={mech.id}
                                    className="bg-dota-charcoal border-l-4 border-l-dota-gold p-6 rounded-r-xl shadow-lg relative overflow-hidden group hover:bg-white/[0.03] transition-colors"
                                >
                                    <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        {mech.icon}
                                    </div>
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="bg-dota-card p-3 rounded-lg border border-white/10 shadow-inner">
                                            {mech.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-radiance text-white">{mech.title}</h3>
                                            <p className="text-xs text-dota-gold uppercase tracking-wider">{mech.category}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-sm">{mech.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'Items' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {metaItems.map((item) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={item.id}
                                    className="bg-gradient-to-b from-dota-card to-black/80 border border-white/10 rounded-xl p-6 shadow-xl relative isolate"
                                >
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-dota-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-radiance text-yellow-100">{item.name}</h3>
                                        <span className="text-xs text-yellow-600 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-700/50 flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1 animate-pulse" /> {item.price}g
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{item.type}</p>
                                    <p className="text-sm text-gray-300 italic">"{item.desc}"</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default InsightHub;
