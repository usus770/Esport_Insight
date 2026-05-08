import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children, isActive }) => {
    // We can use inline styles or normal classes. I'll use inline styles to match requirements
    const linkStyle = isActive
        ? { color: '#6366f1', borderBottom: '2px solid #6366f1', textShadow: '0 0 16px rgba(99,102,241,0.35)' }
        : { color: '#8A8FA8' };

    return (
        <Link to={to} className="relative group px-6 py-2 transition-colors duration-150"
            style={linkStyle}
            onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#F0EDE8';
            }}
            onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#8A8FA8';
            }}>
            <span className="relative z-10 font-radiance text-lg tracking-widest uppercase">
                {children}
            </span>
        </Link>
    );
};

const DotaNavbar = () => {
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 w-full h-20 shadow-panel"
            style={{ background: 'rgba(6, 4, 12, 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,215,0,0.12)' }}>

            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
                {/* Logo Section */}
                <div className="flex items-center space-x-3 group cursor-pointer"
                    onClick={() => window.location.href = '/'}>
                    {/* The logo diamond */}
                    <div style={{
                        width: '26px',
                        height: '26px',
                        border: '2.5px solid #6366f1',
                        background: 'rgba(99,102,241,0.15)',
                        transform: 'rotate(45deg)',
                        transition: 'transform 0.6s ease, background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'rotate(225deg)';
                            e.currentTarget.style.background = 'rgba(99,102,241,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'rotate(45deg)';
                            e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                        }}
                    >
                        <div style={{ width: '12px', height: '12px', background: 'transparent' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-radiance text-white tracking-[0.2em] uppercase glow-text">
                            Esport<span className="text-indigo-400">Insight</span>
                        </h1>
                        <p className="text-xs text-gray-400 tracking-widest uppercase font-sans">Professional Analytics</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-2">
                    <NavLink to="/" isActive={location.pathname === '/'}>Analysis</NavLink>
                    <NavLink to="/live" isActive={location.pathname === '/live'}>Live Matches</NavLink>
                    <NavLink to="/hub" isActive={location.pathname === '/hub'}>Knowledge Hub</NavLink>
                    <NavLink to="/players" isActive={location.pathname === '/players'}>Players</NavLink>
                    <NavLink to="/meta" isActive={location.pathname === '/meta'}>Meta</NavLink>
                </div>

                {/* Right Status / User (Mock) */}
                <div className="flex items-center space-x-4">
                    {/* Placeholder for future user auth */}
                </div>
            </div>
        </nav>
    );
};

export default DotaNavbar;
