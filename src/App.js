import { useState, useEffect } from "react";
import usePriceFeed from "./hooks/usePriceFeed";
import Chart from "./components/Chart";
import Controls from "./components/Controls";
import Scoreboard from "./components/Scoreboard";
import Timer from "./components/Timer";

export default function App() {
  const { price, priceHistory } = usePriceFeed();

  const [gameStarted, setGameStarted] = useState(false);
  const [position, setPosition] = useState(null); // "LONG" or "SHORT"
  const [entryPrice, setEntryPrice] = useState(null);
  const [pnl, setPnl] = useState(0);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  // ---------------------------------------------------------
  // FIX: SEPARATED TIMER LOGIC
  // ---------------------------------------------------------
  
  // 1. The Clock (Runs independently of price)
  useEffect(() => {
    // Do not run if game hasn't started or is over
    if (!gameStarted || gameOver) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [gameStarted, gameOver]); // Removed 'price' so timer doesn't reset!

  // 2. The Game Over Check (Watches time and price)
  useEffect(() => {
    if (timeLeft === 0 && !gameOver && gameStarted) {
      // Time is up! Close positions.
      if (position === "LONG") {
        const finalPnl = price - entryPrice;
        setScore((prev) => prev + finalPnl);
      } else if (position === "SHORT") {
        const finalPnl = entryPrice - price;
        setScore((prev) => prev + finalPnl);
      }
      setPnl(0);
      setPosition(null);
      setEntryPrice(null);
      setGameOver(true);
      setGameStarted(false);
    }
  }, [timeLeft, gameOver, gameStarted, position, price, entryPrice]);

  // ---------------------------------------------------------

  // REALTIME UNREALIZED PnL
  useEffect(() => {
    if (position === "LONG" && entryPrice !== null) {
      setPnl(price - entryPrice);
    } else if (position === "SHORT" && entryPrice !== null) {
      setPnl(entryPrice - price);
    }
  }, [price, position, entryPrice]);

  // ACTIONS
  const buy = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (!position && !gameOver) {
      setPosition("LONG");
      setEntryPrice(price);
      setPnl(0);
    }
  };

  const sell = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }

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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            🎯 Quant Trading Game
          </h1>
          <p className="text-gray-400 mt-2">Trade the market and maximize your profit!</p>
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
            <button 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition text-white shadow-lg shadow-blue-500/50" 
              onClick={restart}
            >
              🔄 Restart Game
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