import React from "react";

export default function ProgressBar({ width, name }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bold mb-1" style={{ color: "#535353", fontSize: "0.875rem" }}>{name}</span>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width, backgroundColor: '#665FE2' }}></div>
      </div>
    </div>
  );
}