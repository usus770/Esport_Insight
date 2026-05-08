import React from "react";

export default function MatchInfo({ match, features, players }: { match: any; features?: any; players?: any[] }) {
  if (!match && !features) return null;
  
  const roleNames: { [key: number]: string } = {
    1: "Carry",
    2: "Mid",
    3: "Offlane",
    4: "Support",
    5: "Hard Support"
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, backgroundColor: "#f9f9f9" }}>
      <h3>Match Information</h3>
      
      {features && (
        <div style={{ marginBottom: 20 }}>
          <h4>Match Features</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, fontSize: 14 }}>
            <div><strong>Patch:</strong> {match?.patch || "N/A"}</div>
            <div><strong>Duration:</strong> {features.duration ? `${Math.floor(features.duration / 60)}:${(features.duration % 60).toString().padStart(2, '0')}` : "N/A"}</div>
            <div><strong>Avg GPM:</strong> {features.avg_gpm?.toFixed(1) || "N/A"}</div>
            <div><strong>Avg XPM:</strong> {features.avg_xpm?.toFixed(1) || "N/A"}</div>
            <div><strong>First Blood:</strong> {features.first_blood_time ? `${Math.floor(features.first_blood_time / 60)}:${(features.first_blood_time % 60).toString().padStart(2, '0')}` : "N/A"}</div>
            <div><strong>Tower Delta:</strong> {features.tower_status_delta || 0}</div>
            <div><strong>Meta WR Delta:</strong> {(features.meta_wr_delta || 0).toFixed(3)}</div>
            <div><strong>Meta PK Delta:</strong> {(features.meta_pk_delta || 0).toFixed(3)}</div>
          </div>
        </div>
      )}

      {players && players.length > 0 && (
        <div>
          <h4>Player Performance</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 15 }}>
            {players.map((player: any, idx: number) => (
              <div key={idx} style={{ 
                border: "1px solid #ccc", 
                borderRadius: 4, 
                padding: 10, 
                backgroundColor: player.is_radiant ? "#e3f2fd" : "#fff3e0" 
              }}>
                <div><strong>Hero ID:</strong> {player.hero_id}</div>
                <div><strong>Role:</strong> {roleNames[player.role] || `Role ${player.role}`}</div>
                <div><strong>Team:</strong> {player.is_radiant ? "Radiant" : "Dire"}</div>
                <div><strong>GPM:</strong> {player.gpm?.toFixed(1)} ({player.deltas?.gpm_delta > 0 ? "+" : ""}{player.deltas?.gpm_delta?.toFixed(1)})</div>
                <div><strong>XPM:</strong> {player.xpm?.toFixed(1)} ({player.deltas?.xpm_delta > 0 ? "+" : ""}{player.deltas?.xpm_delta?.toFixed(1)})</div>
                <div><strong>KDA:</strong> {player.kda?.toFixed(2)} ({player.deltas?.kda_delta > 0 ? "+" : ""}{player.deltas?.kda_delta?.toFixed(2)})</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





