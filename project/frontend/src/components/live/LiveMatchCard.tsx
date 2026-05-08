import { useNavigate } from 'react-router-dom';
import { LiveMatch, TIER_META } from '../../types/liveMatches';
import MatchTierBadge from './MatchTierBadge';
import { useEffect, useState } from 'react';
import React from 'react';

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function useCountUp(target: number, duration = 600): number {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);
    return value;
}

interface LiveMatchCardProps {
    match: LiveMatch;
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
    const navigate = useNavigate();
    const tier = match._tier;

    const radiantOriginal = match.radiant_team?.name || match.radiant_team?.tag;
    const direOriginal = match.dire_team?.name || match.dire_team?.tag;

    const radiantName = radiantOriginal || 'Radiant';
    const direName = direOriginal || 'Dire';

    const fallbackName = TIER_META[tier]?.label || "Ranked Match";
    const leagueName = match.league?.name || match.league_name || fallbackName;

    const total = (match.radiant_score || 0) + (match.dire_score || 0);
    const radiantPct = total > 0 ? Math.round(((match.radiant_score || 0) / total) * 100) : 50;

    const radiantScoreAnim = useCountUp(match.radiant_score || 0, 500);
    const direScoreAnim = useCountUp(match.dire_score || 0, 500);

    return (
        <div
            className="match-card"
            onClick={() => navigate(`/analysis/${match.match_id}`)}
        >
            {/* The volcanic / lava art layer, similar to image */}
            <div className="match-card__art" style={{ backgroundImage: "url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/blog/bg_top.jpg')" }} />
            <div className="match-card__glass" />

            {/* Header Row */}
            <div className="match-card__header">
                <MatchTierBadge tier={tier} size="sm" />

                <span className="match-card__duration">
                    {formatDuration(match.duration || 0)}
                </span>

                <span className="match-card__league">{leagueName}</span>
            </div>

            {/* Teams & Scores */}
            <div className="match-card__teams">
                <div className="match-team match-team--radiant">
                    <span className="match-team__name">{radiantName}</span>
                    <span className="match-team__score match-team__score--radiant">{radiantScoreAnim}</span>
                </div>

                <div className="match-vs">vs</div>

                <div className="match-team match-team--dire">
                    <span className="match-team__name">{direName}</span>
                    <span className="match-team__score match-team__score--dire">{direScoreAnim}</span>
                </div>
            </div>

            {/* Glowing Gradient Progress Bar */}
            <div className="match-scorebar-wrapper">
                <div className="match-scorebar" style={{ '--radiant-pct': `${radiantPct}%` } as React.CSSProperties}>
                    <div
                        className="match-scorebar-fill"
                        style={{
                            width: '100%',
                            background: `linear-gradient(90deg, #5ee6a3 0%, #5ee6a3 ${radiantPct}%, #ff5a5a ${radiantPct}%, #ff5a5a 100%)`
                        }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="match-card__footer">
                <button
                    className="btn-analyze"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/analysis/${match.match_id}`);
                    }}
                >
                    Analyze →
                </button>
                <span className="match-card__id">#{match.match_id}</span>
            </div>
        </div>
    );
}
