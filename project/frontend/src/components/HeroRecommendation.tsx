import React, { useState } from 'react';
import { getHeroRecommendations } from '../services/api';

interface Recommendation {
    hero_id: number;
    hero_name: string;
    win_probability: number;
    roles: string[];
}

interface AssetRecommendationProps {
    radiantPicks: number[];
    direPicks: number[];
    onRecommendationSelect?: (heroId: number) => void;
}

const ROLES = ["Carry", "Support", "Offlane", "Mid"];

export default function HeroRecommendation({ radiantPicks, direPicks, onRecommendationSelect }: AssetRecommendationProps) {
    const [role, setRole] = useState<string>('');
    const [side, setSide] = useState<"radiant" | "dire">("radiant");
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRecommend = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getHeroRecommendations(radiantPicks, direPicks, role || undefined, side);
            setRecommendations(data.recommendations);
        } catch (err: any) {
            setError(err.message || "Failed to get recommendations");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, marginTop: 20 }}>
            <h3>Asset Recommendations</h3>

            <div style={{ display: 'flex', gap: 10, marginBottom: 15, flexWrap: 'wrap' }}>
                <div>
                    <label>Side: </label>
                    <select value={side} onChange={(e) => setSide(e.target.value as "radiant" | "dire")}>
                        <option value="radiant">Team Alpha</option>
                        <option value="dire">Team Omega</option>
                    </select>
                </div>

                <div>
                    <label>Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Any</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <button onClick={handleRecommend} disabled={loading} style={{
                    padding: "6px 12px",
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                }}>
                    {loading ? "Analyzing..." : "Get Recommendations"}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

            {recommendations.length > 0 && (
                <div style={{ display: 'grid', gap: 10 }}>
                    {recommendations.map((rec) => (
                        <div key={rec.hero_id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 10,
                            background: '#f5f5f5',
                            borderRadius: 4
                        }}>
                            <div>
                                <strong>{rec.hero_name}</strong>
                                <div style={{ fontSize: '0.8em', color: '#666' }}>{rec.roles.slice(0, 3).join(', ')}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', color: rec.win_probability > 0.5 ? 'green' : 'orange' }}>
                                    {(rec.win_probability * 100).toFixed(1)}% Win Rate
                                </div>
                                {onRecommendationSelect && (
                                    <button onClick={() => onRecommendationSelect(rec.hero_id)} style={{ fontSize: '0.8em', marginTop: 4 }}>
                                        Select
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
