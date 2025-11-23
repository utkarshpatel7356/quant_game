import { useState, useEffect } from "react";
import usePriceFeed from "./hooks/usePriceFeed";
import Chart from "./components/Chart";
import Controls from "./components/Controls";
import Scoreboard from "./components/Scoreboard";
import Timer from "./components/Timer";
import StartScreen from "./components/StartScreen"; // IMPORTED
import Leaderboard from "./components/Leaderboard"; // IMPORTED

export default function App() {
  const { price, priceHistory } = usePriceFeed();

  // --- NEW STATE FOR ADDONS ---
  const [view, setView] = useState("START"); // 'START', 'GAME', 'LEADERBOARD'
  const [user, setUser] = useState(null); // Stores { username, high_score }
  // ---------------------------

  const [gameStarted, setGameStarted] = useState(false);
  const [position, setPosition] = useState(null); // "LONG" or "SHORT"
  const [entryPrice, setEntryPrice] = useState(null);
  const [pnl, setPnl] = useState(0);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  // ---------------------------------------------------------
  // 1. The Clock
  // ---------------------------------------------------------
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [gameStarted, gameOver]);

  // ---------------------------------------------------------
  // 2. The Game Over Check (Updated with API Saving)
  // ---------------------------------------------------------
  useEffect(() => {
    if (timeLeft === 0 && !gameOver && gameStarted) {
      let finalRoundScore = score; // Current realized score

      // Calculate pending PnL to add to final score
      if (position === "LONG") {
        const finalPnl = price - entryPrice;
        finalRoundScore += finalPnl;
        setScore((prev) => prev + finalPnl);
      } else if (position === "SHORT") {
        const finalPnl = entryPrice - price;
        finalRoundScore += finalPnl;
        setScore((prev) => prev + finalPnl);
      }

      // Reset positions
      setPnl(0);
      setPosition(null);
      setEntryPrice(null);
      setGameOver(true);
      setGameStarted(false);

      // --- NEW: SAVE SCORE TO DATABASE ---
      if (user) {
        // 1. Send to API
        fetch('/api/save-score', {
          method: 'POST',
          body: JSON.stringify({ username: user.username, score: finalRoundScore })
        });

        // 2. Update local high score immediately for UI
        if (finalRoundScore > user.high_score) {
          setUser(prev => ({ ...prev, high_score: finalRoundScore }));
        }
      }
      // -----------------------------------
    }
  }, [timeLeft, gameOver, gameStarted, position, price, entryPrice]); // eslint-disable-line

  // ---------------------------------------------------------
  // REALTIME UNREALIZED PnL
  // ---------------------------------------------------------
  useEffect(() => {
    if (position === "LONG" && entryPrice !== null) {
      setPnl(price - entryPrice);
    } else if (position === "SHORT" && entryPrice !== null) {
      setPnl(entryPrice - price);
    }
  }, [price, position, entryPrice]);

  // ---------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------
  const buy = () => {
    if (!gameStarted) setGameStarted(true);

    if (!position && !gameOver) {
      setPosition("LONG");
      setEntryPrice(price);
      setPnl(0);
    }
  };

  const sell = () => {
    if (!gameStarted) setGameStarted(true);

    if (!position && !gameOver) {
      // Open SHORT position
      setPosition("SHORT");
      setEntryPrice(price);
      setPnl(0);
    } else if (position === "LONG" && !gameOver) {
      // Close LONG position
      const realizedPnl = price - entryPrice;
      setScore((prev) => prev + realizedPnl);
      setPnl(0);
      setPosition(null);
      setEntryPrice(null);
    }
  };

  const close = () => {
    if (position === "LONG" && !gameOver) {
      const realizedPnl = price - entryPrice;
      setScore((prev) => prev + realizedPnl);
      setPnl(0);
      setPosition(null);
      setEntryPrice(null);
    } else if (position === "SHORT" && !gameOver) {
      const realizedPnl = entryPrice - price;
      setScore((prev) => prev + realizedPnl);
      setPnl(0);
      setPosition(null);
      setEntryPrice(null);
    }
  };

  const restart = () => {
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setPnl(0);
    setPosition(null);
    setEntryPrice(null);
  };

  // ---------------------------------------------------------
  // VIEW ROUTING
  // ---------------------------------------------------------

  if (view === "START") {
    return <StartScreen 
      onStart={(userData) => { setUser(userData); setView("GAME"); }} 
      onShowLeaderboard={() => setView("LEADERBOARD")}
    />;
  }

  if (view === "LEADERBOARD") {
    return <Leaderboard onBack={() => setView("START")} />;
  }

  // GAME VIEW
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER WITH USER INFO */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              🎯 Quant Trading Game
            </h1>
            <p className="text-gray-400 mt-2">Player: <span className="text-white font-bold">{user?.username}</span></p>
          </div>
          <div className="text-right">
             <div className="text-xs text-gray-500 uppercase">Your Best</div>
             <div className="text-xl font-mono text-yellow-400">${user?.high_score?.toFixed(2)}</div>
          </div>
        </div>

        <Chart data={priceHistory} />

        <div className="flex flex-col items-center justify-center">
          <Timer timeLeft={timeLeft} />
          {!gameStarted && !gameOver && (
            <span className="text-yellow-400 text-sm animate-pulse mt-1">
              Waiting for first trade... Click BUY or SELL to Start
            </span>
          )}
        </div>
        
        <Scoreboard 
          pnl={pnl} 
          score={score} 
          position={position}
          entryPrice={entryPrice}
          currentPrice={price}
        />

        {!gameOver ? (
          <Controls 
            onBuy={buy} 
            onSell={sell} 
            onClose={close}
            position={position}
          />
        ) : (
          <div className="text-center mt-8 animate-fade-in">
            <div className="bg-gray-800 p-8 rounded-lg mb-4 border border-gray-700">
              <h2 className="text-3xl font-bold mb-2 text-white">Game Over!</h2>
              <p className="text-xl text-gray-300">
                Final Score: 
                <span className={`font-bold ml-2 ${score >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${score.toFixed(2)}
                </span>
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition text-white shadow-lg shadow-blue-500/50" 
                onClick={restart}
              >
                🔄 Restart
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold text-lg transition text-white" 
                onClick={() => setView("LEADERBOARD")}
              >
                🏆 Leaderboard
              </button>
            </div>
            
            <button onClick={() => setView("START")} className="mt-6 text-gray-500 underline text-sm">
              Log out / Change User
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-sm text-gray-400 border border-gray-700">
          <h3 className="font-bold text-white mb-2">📖 How to Play:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Click <span className="text-green-400 font-bold">BUY</span> to open a LONG position or <span className="text-red-400 font-bold">SELL</span> to open a SHORT position.</li>
            <li>Click <span className="text-orange-400 font-bold">CLOSE</span> to take profits/losses and close your position.</li>
            <li>LONG profits when price goes up, SHORT profits when price goes down.</li>
            <li>Game ends automatically when timer hits 0.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}