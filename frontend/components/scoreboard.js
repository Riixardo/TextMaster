import React from "react";
import ProgressBar from "./progress_bar";

export default function Scoreboard({ user_id, leaderboard, userPercentages }) {

  // console.log("scoreboard:", leaderboard);
  console.log("userPercentages:", userPercentages);

  // flow, conciseness, clarity, relevance
  // const flow = userScores ? `${userScores['Flow']}%` : "0%";
  // const conciseness = userScores ? `${userScores['Conciseness']}%` : "0%";
  // const clarity = userScores ? `${userScores['Clarity']}%` : "0%";
  // const relevance = userScores ? `${userScores['Relevance']}%` : "0%";
  const flow = userPercentages ? `${userPercentages['Flow']}%` : "0%";
  const conciseness = userPercentages ? `${userPercentages['Conciseness']}%` : "0%";
  const clarity = userPercentages ? `${userPercentages['Clarity']}%` : "0%";
  const relevance = userPercentages ? `${userPercentages['Relevance']}%` : "0%";

  
  return (
    <div className="score-board" style={{ borderRight: '2px solid #f3f3f3' }}>
      {/* Scoreboard List */}
      <div>
        <h2 className="text-gray-700 text-2xl font-extrabold" style={{ color: '#535353' }}>Scoreboard</h2>
        <ul className="mt-4 font-bold">
          {Array.isArray(leaderboard) && leaderboard.map((player, index) => (
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
        <ProgressBar width={relevance} name="relevance" />
        <ProgressBar width={clarity} name="clarity" />
        <ProgressBar width={flow} name="Flow" />
        <ProgressBar width={conciseness} name="Conciseness" />
      </div>
    </div>
  );
}