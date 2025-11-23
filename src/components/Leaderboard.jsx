import { useEffect, useState } from "react";

export default function Leaderboard({ onBack }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaders(data.leaderboard));
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">🏆 Leaderboard</h2>
      
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-4">
        {leaders.map((user, index) => (
          <div key={index} className="flex justify-between border-b border-gray-700 py-3 last:border-0">
            <span className="font-bold text-lg">#{index + 1} {user.username}</span>
            <span className="text-green-400 font-mono">${user.high_score.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onBack} 
        className="mt-8 bg-gray-700 px-6 py-2 rounded hover:bg-gray-600"
      >
        Back to Home
      </button>
    </div>
  );
}