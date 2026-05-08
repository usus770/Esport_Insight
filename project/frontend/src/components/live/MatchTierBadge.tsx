import { MatchTier, TIER_META } from '../../types/liveMatches';

interface MatchTierBadgeProps {
    tier: MatchTier | null | undefined;
    size?: 'sm' | 'md' | 'lg';
}

export default function MatchTierBadge({ tier, size = 'sm' }: MatchTierBadgeProps) {
    // If no tier is matched, or we don't know the tier, hide or show fallback.
    // For now, if no tier (value 0), don't render a badge to keep UI clean.
    if (!tier || !TIER_META[tier]) return null;

    const meta = TIER_META[tier];
    const isLg = size === 'lg';

    return (
        <div
            className={`tier-badge ${isLg ? 'tier-badge--lg' : ''}`}
            style={{
                color: meta.color,
                borderColor: meta.color,
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isLg ? '6px 14px' : '4px 10px'
            }}
        >
            {isLg ? meta.label : meta.shortLabel}
        </div>
    );
}
