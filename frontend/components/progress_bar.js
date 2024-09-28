import React from "react";

export default function ProgressBar({ width }) {
  return (
    <div className="w-50 bg-gray-200 rounded-full h-4">
      <div className="h-4 rounded-full" style={{ width, backgroundColor: '#665FE2'}}></div>
    </div>
  );
}