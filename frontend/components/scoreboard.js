import React from "react";
import ProgressBar from "./progress_bar";

export default function Scoreboard() {
  const players = [
    { rank: 1, name: "FrankIsDank" },
    { rank: 2, name: "Egg" },
    { rank: 3, name: "Rob" },
    { rank: 4, name: "Wres123" },
    { rank: 5, name: "Joe Biden" }
  ];

  return (
    <div className="score-board" style={{ borderRight: '2px solid #f3f3f3' }}>
      {/* Scoreboard List */}
      <div>
        <h2 className="text-gray-700 text-2xl font-bold" style={{ color: '#535353' }}>Scoreboard</h2>
        <ul className="mt-4">
          {players.map((player, index) => (
            <li
              key={index}
              className={`p-2 mb-2 shadow-md rounded-lg`}
              style={{ color: '#535353' }}
            >
              #{player.rank} {player.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        <ProgressBar width="1%" />
        <ProgressBar width="50%" />
        <ProgressBar width="100%" />

      </div>
    </div>
  );
}