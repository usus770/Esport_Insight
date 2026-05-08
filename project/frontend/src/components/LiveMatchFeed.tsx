import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchTier, TIER_META, PriorityFeedResponse } from '../types/liveMatches';
import LiveMatchCard from './live/LiveMatchCard';
import MatchTierBadge from './live/MatchTierBadge';

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';
const REFRESH_INTERVAL = 30_000;

const contextBarVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
};

export default function LiveMatchFeed() {
    const [feed, setFeed] = useState<PriorityFeedResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTierOverride, setActiveTierOverride] = useState<MatchTier | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [lowerTierExpanded, setLowerTierExpanded] = useState(false);

    const fetchFeed = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (showAll) params.set('show_all', 'true');
            if (activeTierOverride) params.set('tier', String(activeTierOverride));

            const resp = await fetch(`${API_BASE}/api/v1/live/priority?${params}`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data: PriorityFeedResponse = await resp.json();
            setFeed(data);
            setLastRefresh(new Date());
            setError(null);
        } catch {
            setError('Unable to reach live feed. Retrying...');
        } finally {
            setLoading(false);
        }
    }, [showAll, activeTierOverride]);

    useEffect(() => {
        fetchFeed();
        const interval = setInterval(fetchFeed, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchFeed]);

    const activeTier: MatchTier = (activeTierOverride || feed?.active_tier || 4) as MatchTier;
    const primaryMatches = showAll
        ? feed?.matches || []
        : (feed?.by_tier?.[String(activeTier)] || feed?.matches || []);

    const lowerMatches = showAll ? [] : Object.entries(feed?.by_tier || {})
        .filter(([tier]) => Number(tier) > activeTier)
        .flatMap(([, matches]) => matches);

    return (
        <section className="live-feed-container">
            {/* Filter Bar (Header) */}
            <div className="live-controls-bar">
                <div className="live-indicator">
                    <span className="live-dot" />
                    <span className="live-label-count">
                        {feed ? feed.total_live : '--'} <span className="live-label-text">LIVE MATCHES</span>
                    </span>
                </div>

                {/* Tier tabs (Rounded pills) */}
                <div className="tier-tabs">
                    <button
                        className={`tier-tab ${!activeTierOverride ? 'tier-tab--active' : ''}`}
                        onClick={() => setActiveTierOverride(null)}
                    >
                        AUTO
                    </button>
                    {(feed?.tiers_available || []).map(tier => {
                        const meta = TIER_META[tier];
                        const isActive = activeTierOverride === tier;
                        return (
                            <button
                                key={tier}
                                className={`tier-tab ${isActive ? 'tier-tab--active' : ''}`}
                                onClick={() => setActiveTierOverride(tier as MatchTier)}
                            >
                                {meta.shortLabel}
                            </button>
                        );
                    })}
                </div>

                <div className="feed-controls">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={showAll}
                            onChange={e => setShowAll(e.target.checked)}
                        />
                        <span>Show All</span>
                        <span className="refresh-text">{lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </label>
                </div>
            </div>

            {/* Context bar */}
            {feed && !loading && (
                <motion.div
                    className="tier-context-bar"
                    variants={contextBarVariants}
                    initial="hidden"
                    animate="show"
                >
                    <MatchTierBadge tier={activeTier} size="lg" />
                    <span className="tier-context-text">
                        <strong>{primaryMatches.length}</strong> {TIER_META[activeTier]?.label || 'Live'} match{primaryMatches.length !== 1 ? 'es' : ''}
                        {activeTier < 4 && !showAll ? ' — lower tiers hidden' : ''}
                    </span>
                </motion.div>
            )}

            {/* Match grid */}
            {loading ? (
                <div className="match-grid">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton-loader">
                            <div className="skeleton-shimmer" style={{ width: '40px' }} />
                            <div className="skeleton-shimmer" style={{ width: '100%', height: '50px', marginTop: '20px' }} />
                            <div className="skeleton-shimmer" style={{ width: '100px', bottom: '24px', position: 'absolute' }} />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="feed-error">{error}</div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <motion.div className="match-grid" layout>
                        {primaryMatches.map((match) => (
                            <LiveMatchCard key={match.match_id} match={match} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Lower tier collapsed section */}
            {lowerMatches.length > 0 && !showAll && (
                <div className="lower-tier-section">
                    <button
                        className={`lower-tier-toggle ${lowerTierExpanded ? 'lower-tier-toggle--expanded' : ''}`}
                        onClick={() => setLowerTierExpanded(prev => !prev)}
                    >
                        {lowerMatches.length} lower-priority match{lowerMatches.length !== 1 ? 'es' : ''} available
                    </button>
                    <AnimatePresence>
                        {lowerTierExpanded && (
                            <motion.div
                                className="match-grid"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                {lowerMatches.map(match => (
                                    <LiveMatchCard key={match.match_id} match={match} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}
