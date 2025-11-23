import { useState } from "react";

export default function StartScreen({ onStart, onShowLeaderboard }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    
    // Call the API
    const res = await fetch(`/api/login?username=${name}`);
    const data = await res.json();
    
    setLoading(false);
    onStart(data.user); // Pass user data up to App
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-green-400">Quant Trading Game</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <input
          className="p-2 rounded text-black"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 p-2 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Loading..." : "Start Trading"}
        </button>
      </form>
      
      <button 
        onClick={onShowLeaderboard}
        className="mt-4 text-gray-400 underline hover:text-white"
      >
        View Leaderboard
      </button>
    </div>
  );
}