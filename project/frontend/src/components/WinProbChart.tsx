import React from "react";
import Plot from "react-plotly.js";

export default function WinProbChart({ features, winProb }: { features?: any; winProb?: number | null }) {
  if (!features) return null;

  // Create a bar chart showing feature contributions
  const featureNames = [
    "Avg GPM", "Avg XPM", "Kill Participation", 
    "First Blood Time", "Tower Delta", "Hero Diversity",
    "Meta WR Delta", "Meta PK Delta", "Duration"
  ];
  
  const featureValues = [
    features.avg_gpm || 0,
    features.avg_xpm || 0,
    (features.kill_participation_avg || 0) * 100,
    features.first_blood_time || 0,
    features.tower_status_delta || 0,
    features.hero_diversity_delta || 0,
    (features.meta_wr_delta || 0) * 100,
    (features.meta_pk_delta || 0) * 100,
    features.duration || 0
  ];

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, backgroundColor: "#f9f9f9" }}>
      <h3>Match Features Visualization</h3>
      {winProb !== null && (
        <div style={{ marginBottom: 20, fontSize: 18, textAlign: "center" }}>
          <strong>Predicted Win Probability (Radiant): {(winProb * 100).toFixed(1)}%</strong>
        </div>
      )}
      <Plot
        data={[{
          x: featureNames,
          y: featureValues,
          type: "bar",
          marker: { color: featureValues.map(v => v >= 0 ? "#4caf50" : "#f44336") }
        }]}
        layout={{
          title: "Match Features",
          xaxis: { title: "Feature" },
          yaxis: { title: "Value" },
          height: 400
        }}
        style={{ width: "100%", height: "400px" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}





