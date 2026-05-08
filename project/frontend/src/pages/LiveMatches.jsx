import React from 'react';
import LiveMatchFeed from '../components/LiveMatchFeed';
import '../styles/live-matches.css';

const LiveMatches = () => {
    return (
        <div className="live-matches-page text-white font-sans">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="page-header-title">
                        LIVE OPERATIONS
                    </div>
                    <p className="page-header-subtitle">
                        Priority-ranked match feed · Auto-refreshes 30s
                    </p>
                    <div className="page-header-line" />
                </div>
                <LiveMatchFeed />
            </div>
        </div>
    );
};

export default LiveMatches;
