import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DotaNavbar from './components/DotaNavbar';
import Home from './pages/Home';
import LiveMatches from './pages/LiveMatches';
import MatchAnalysis from './pages/MatchAnalysis';
import MetaCenter from './pages/MetaCenter';
import PlayerList from './pages/PlayerList';
import InsightHub from './pages/InsightHub';
import HeroDetail from './pages/HeroDetail';
import PlayerView from './pages/PlayerView';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-[#0B0E13] text-white selection:bg-dota-red/30">
        <DotaNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveMatches />} />
          <Route path="/analysis/:matchId" element={<MatchAnalysis />} />
          <Route path="/meta" element={<MetaCenter />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/player/:id" element={<PlayerView />} />
          <Route path="/hub" element={<InsightHub />} />
          <Route path="/hero/:id" element={<HeroDetail />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
