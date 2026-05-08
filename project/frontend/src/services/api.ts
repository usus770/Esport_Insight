const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

// Get token from localStorage
function getToken(): string | null {
  return localStorage.getItem('token')
}

// Set token in localStorage
export function setToken(token: string) {
  localStorage.setItem('token', token)
}

// Remove token from localStorage
export function removeToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getToken()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Authentication API
export async function register(username: string, email: string, password: string) {
  const r = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  if (!r.ok) {
    const error = await r.json()
    throw new Error(error.detail || 'Registration failed')
  }
  return r.json()
}

export async function login(username: string, password: string) {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const r = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData
  })
  if (!r.ok) {
    const error = await r.json()
    throw new Error(error.detail || 'Login failed')
  }
  const data = await r.json()
  setToken(data.access_token)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data
}

export async function getCurrentUser() {
  const r = await fetch(`${API}/api/auth/me`, {
    headers: getAuthHeaders()
  })
  if (!r.ok) {
    throw new Error('Not authenticated')
  }
  return r.json()
}

// Match API
export async function getProMatches() {
  const r = await fetch(`${API}/api/pro-matches`);
  return r.json()
}

export async function getMatch(id: number) {
  const r = await fetch(`${API}/api/match/${id}`);
  return r.json()
}

export async function getMatchFeatures(id: number) {
  const r = await fetch(`${API}/api/match/${id}/features`);
  return r.json()
}

export async function predictWinProbability(features: any) {
  const r = await fetch(`${API}/api/predict`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(features)
  });
  return r.json()
}

export function liveSocket(id: number) {
  const wsUrl = (API.startsWith('https') ? API.replace('https', 'wss') : API.replace('http', 'ws'))
  return new WebSocket(`${wsUrl}/ws/live/${id}`)
}

// V1 API Wrappers for New Features
export async function getMatchDetails(id: string | number) {
  const r = await fetch(`${API}/api/v1/matches/${id}`);
  if (!r.ok) throw new Error("Failed to fetch match details");
  return r.json();
}

export async function getPlayerProfile(id: string | number) {
  const r = await fetch(`${API}/api/v1/players/${id}`);
  if (!r.ok) throw new Error("Failed to fetch player profile");
  return r.json();
}

// Recommendation API
export async function getHeroRecommendations(
  radiant_picks: number[],
  dire_picks: number[],
  role?: string,
  side: "radiant" | "dire" = "radiant"
) {
  const r = await fetch(`${API}/api/recommend`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ radiant_picks, dire_picks, role, side })
  });
  if (!r.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return r.json();
}

// Coaching API
export interface PlayerMetrics {
  role: string;
  hero: string;
  win_prob_20min: number;
  gold_diff: number;
  gpm: number;
  benchmark_gpm: number;
  xpm: number;
  kill_participation: number;
  deaths: number;
  hero_winrate: number;
  top_important_features: string[];
  performance_drop_detected: boolean;
  momentum_shift_detected: boolean;
}

export async function analyzePerformance(metrics: PlayerMetrics) {
  const r = await fetch(`${API}/api/v1/coach/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(metrics)
  });
  if (!r.ok) {
    throw new Error('Failed to analyze performance');
  }
  return r.json();
}





