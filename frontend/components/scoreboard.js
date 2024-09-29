import React from "react";
import ProgressBar from "./progress_bar";

export default function Scoreboard({ user_id, leaderboard }) {

  // const players = [
  //   ["FrankIsDank", 20],
  //   ["Egg", 15],
  //   ["Rob", 10],
  //   ["Wres123", 5],
  //   ["Joe Biden", 1]
  // ];

  console.log("scoreboard:", leaderboard);

  
  return (
    // <div>a</div>
    <div className="score-board" style={{ borderRight: '2px solid #f3f3f3' }}>
      {/* Scoreboard List */}
      <div>
        <h2 className="text-gray-700 text-2xl font-extrabold" style={{ color: '#535353' }}>Scoreboard</h2>
        <ul className="mt-4 font-bold">
          {leaderboard.map((player, index) => (
            <li 
              key={index}
              className={`p-2 mb-2 shadow-md rounded-lg`}
              style={{ backgroundColor: player[0] === user_id ? '#535353' : '', color: player[0] === user_id ? 'white' : '#535353' }}
            >
              #{index + 1} {player[0]}
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