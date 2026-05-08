export type MatchTier = 1 | 2 | 3 | 4;

export const TIER_META: Record<MatchTier, {
    label: string;
    shortLabel: string;
    color: string;
    bgColor: string;
    description: string;
}> = {
    1: {
        label: 'Tournament',
        shortLabel: 'INTL',
        color: '#FFD700',
        bgColor: 'rgba(255,215,0,0.12)',
        description: 'International & Major tournaments',
    },
    2: {
        label: 'Scrim',
        shortLabel: 'SCRM',
        color: '#9B72F8',
        bgColor: 'rgba(155,114,248,0.12)',
        description: 'Professional practice scrimmages',
    },
    3: {
        label: 'Pro Match',
        shortLabel: 'PRO',
        color: '#5B9CF6',
        bgColor: 'rgba(91,156,246,0.12)',
        description: 'DPC leagues & regional qualifiers',
    },
    4: {
        label: 'Ranked',
        shortLabel: 'MMR',
        color: '#4A4F68',
        bgColor: 'rgba(74,79,104,0.12)',
        description: 'High-MMR public matchmaking',
    },
};

export interface LiveMatch {
    match_id: number;
    radiant_team?: { name: string; tag: string; logo?: string };
    dire_team?: { name: string; tag: string; logo?: string };
    radiant_score: number;
    dire_score: number;
    duration: number;
    game_mode: number;
    lobby_type: number;
    spectators?: number;
    league?: { name: string; tier: string };
    league_name?: string;
    series_type?: number;
    series_current?: number;
    _tier: MatchTier;
    _tier_label: string;
    _tier_color: string;
    average_mmr?: number;
}

export interface PriorityFeedResponse {
    active_tier: MatchTier;
    active_tier_label: string;
    tiers_available: MatchTier[];
    matches: LiveMatch[];
    by_tier: Record<string, LiveMatch[]>;
    total_live: number;
}
