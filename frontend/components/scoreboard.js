import React from "react";
import ProgressBar from "./progress_bar";

export default function Scoreboard() {
  const players = [
    { rank: 1, name: "FrankIsDank" , is_userPlayer: true },
    { rank: 2, name: "Egg", is_userPlayer: false },
    { rank: 3, name: "Rob", is_userPlayer: false },
    { rank: 4, name: "Wres123", is_userPlayer: false },
    { rank: 5, name: "Joe Biden", is_userPlayer: false }
  ];

  return (
    <div className="score-board" style={{ borderRight: '2px solid #f3f3f3' }}>
      {/* Scoreboard List */}
      <div>
        <h2 className="text-gray-700 text-2xl font-extrabold" style={{ color: '#535353' }}>Scoreboard</h2>
        <ul className="mt-4 font-bold">
          {players.map((player, index) => (
            <li 
              key={index}
              className={`p-2 mb-2 shadow-md rounded-lg`}
              style={{ backgroundColor: player.is_userPlayer ? '#535353' : '', color: player.is_userPlayer ? 'white' : '#535353' }}
            >
              #{player.rank} {player.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-1">
        <ProgressBar width="1%" name="Correctness" />
        <ProgressBar width="50%" name="Grammar" />
        <ProgressBar width="100%" name="Flow" />

      </div>
    </div>
  );
}