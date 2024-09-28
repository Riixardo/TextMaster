
import Sidebar from '../components/side_bar';
import Scoreboard from '../components/scoreboard';
import React from "react";


export default function Home() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex w-full">
        {/* Scoreboard */}
        <Scoreboard />

        {/* Placeholder for Future Content */}
        <div className="flex-grow h-screen bg-white p-6">
          <h2 className="text-blue-500 text-2xl font-bold">Textmaster</h2>
          
        </div>
      </div>
    </div>
  );
}